import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_CURRENCIES = ["EUR", "USD", "GBP", "BGN"];

/** SHA-256 hash of the raw base64 string for cache keying */
async function hashImage(base64: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(base64);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { imageBase64, currency, deviceId } = body;

    // --- Input Validation ---
    if (!deviceId || typeof deviceId !== "string" || deviceId.length < 10 || deviceId.length > 128) {
      return new Response(
        JSON.stringify({ error: "Valid device ID required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (imageBase64.length > MAX_IMAGE_SIZE) {
      return new Response(
        JSON.stringify({ error: "Image too large (max 10MB)" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (currency && (typeof currency !== "string" || !VALID_CURRENCIES.includes(currency.toUpperCase()))) {
      return new Response(
        JSON.stringify({ error: "Invalid currency" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const scanClient = createClient(supabaseUrl, supabaseKey);

    // --- Cache Lookup (before consuming a scan) ---
    const imageHash = await hashImage(imageBase64);
    const { data: cached } = await scanClient
      .from("banknote_analysis_cache")
      .select("result")
      .eq("image_hash", imageHash)
      .maybeSingle();

    if (cached?.result) {
      // Return cached result — no scan limit
      const cachedResult = cached.result as Record<string, unknown>;
      cachedResult.fromCache = true;

      return new Response(
        JSON.stringify(cachedResult),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- AI Analysis ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert banknote authentication system specialized in Euro (EUR) and Bulgarian Lev (BGN) banknotes. When given an image of a banknote, you must:

1. IDENTIFY THE BANKNOTE
   - Determine the denomination (5, 10, 20, 50, 100, 200, 500 etc.)
   - Determine the currency (EUR or BGN; if clearly another currency, still identify it)
   - Identify the series/year if visible (e.g. EUR "Europa" series 2013+ vs first series 1st 2002; BGN 1999 series, 2020 polymer series, etc.)

2. INSPECT EVERY VISIBLE SECURITY ELEMENT
   For each feature, decide one of:
     - CLEARLY PRESENT and correct (strong positive evidence)
     - CLEARLY MISSING or wrong (strong negative evidence)
     - NOT VERIFIABLE from this image (lighting/angle/resolution insufficient — neutral, do NOT count as positive or negative)
   Never assume a feature exists just because the series should have it. Judge ONLY what you actually see.

   EUR security features to check when visible:
   - Portrait window / hologram stripe (Europa portrait, denomination, € symbol)
   - Emerald number (color-shift green→deep blue on tilt)
   - Watermark (portrait + denomination)
   - Security thread with repeating "EURO" + denomination microtext
   - Microprint
   - Raised print / intaglio texture cues
   - Registration / see-through number
   - Overall print sharpness, color register, paper/polymer feel cues visible in image

   BGN security features to check when visible:
   - Watermark (portrait + denomination)
   - Security thread with "БНБ" / denomination text
   - Kinegram / hologram patch with color-shift
   - Latent (hidden) image visible at an angle
   - Color-shifting ink on denomination
   - Microprint, intaglio relief cues, serial number style and font
   - For polymer notes (e.g. 20 BGN polymer): transparent window, holographic window elements

3. SCORE AUTHENTICITY 0–100 % WITH HIGH PRECISION
   The confidence number is a calibrated probability that the banknote is GENUINE.
   Compute it as follows — be exact, not lazy with round numbers:

   a) Start from a neutral baseline of 50.
   b) For every CLEARLY PRESENT and correct security feature, add weight:
        - Major feature (hologram/portrait window, watermark, security thread, color-shift number): +8 to +12 each
        - Secondary feature (microprint, registration mark, intaglio cue, serial style): +2 to +5 each
   c) For every CLEARLY MISSING or WRONG feature that should be on this denomination/series:
        - Major feature missing/wrong: −15 to −25 each
        - Secondary feature missing/wrong: −3 to −7 each
   d) Penalize image quality issues that prevent verification (do not reward or punish the note itself, but cap the maximum confidence):
        - Blurry / low-resolution / glare: cap confidence at 70
        - Only one side visible: cap at 85
        - Cropped / partial banknote: cap at 60
        - Not actually a banknote: confidence = 0
   e) Clamp the final number to 0–100. Output an INTEGER, but it MUST reflect the real evidence — avoid lazy values like 50, 75, 90, 100. Prefer specific numbers like 37, 64, 82, 91, 97 that match the actual count and quality of verified features.

4. DECIDE THE RESULT LABEL FROM THE SCORE — STRICT CORRELATION REQUIRED
   The "confidence" number is the probability the note is GENUINE. The "result" label MUST match the number:
   - "authentic": confidence MUST be in 85–100. Requires at least 2 major features clearly verified.
   - "suspicious": confidence MUST be in 36–84.
   - "fake": confidence MUST be in 0–35. If you say in the analysis that the note is clearly fake/counterfeit, confidence MUST be ≤ 25 (typically 5–20).
   It is FORBIDDEN to output e.g. result="fake" with confidence=50, or result="authentic" with confidence=60. The number and the label must always agree, and both must match the tone of the written analysis.

5. HARD RULES — NEVER BREAK
   - If the image is NOT a banknote (phone, paper, person, object, etc.): result="suspicious", confidence=0, explain clearly.
   - Never invent features you do not actually see.
   - When in doubt, prefer "suspicious" over "authentic".
   - Be conservative but precise: the confidence number must be defensible from the features you list AND consistent with the result label and the written analysis.
   - Before outputting, re-read your own "analysis" text. If it says the note is fake/counterfeit → confidence ≤ 25 and result="fake". If it says clearly genuine → confidence ≥ 85 and result="authentic". Never contradict yourself.

OUTPUT — ONLY valid JSON, no markdown, no extra text. All human-readable text fields ("description", "analysis", "recommendations") MUST be written in Bulgarian (formal, -те endings). Keys and enum values stay in English exactly as below:
{
  "result": "authentic" | "suspicious" | "fake",
  "confidence": integer 0-100 (precise, evidence-based, not a round guess),
  "currency": "EUR" | "USD" | "GBP" | "BGN" | "UNKNOWN",
  "denomination": number or null,
  "detectedFeatures": [
    {
      "name": "Точно название на характеристиката",
      "detected": true | false,
      "description": "Какво точно виждате или не виждате на изображението"
    }
  ],
  "analysis": "Подробен анализ на български: кои защитни елементи са потвърдени, кои липсват или са съмнителни, как тези наблюдения водят до конкретната стойност на confidence.",
  "recommendations": ["конкретна препоръка 1", "конкретна препоръка 2"]
}`;

    const userText = currency
      ? `Анализирай тази банкнота. Потребителят смята, че е ${currency}. Провери дали потвърждаваш това и оцени автентичността.`
      : `Анализирай тази банкнота. Определи валутата, номинала и автентичността въз основа на ВИДИМИТЕ защитни характеристики.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        temperature: 0,  // Deterministic output — same image = same result
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userText },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Твърде много заявки. Моля, опитайте отново след малко." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Необходимо е допълнително зареждане на кредити." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from AI
    let analysisResult: Record<string, unknown>;
    try {
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) cleanContent = cleanContent.slice(7);
      if (cleanContent.startsWith("```")) cleanContent = cleanContent.slice(3);
      if (cleanContent.endsWith("```")) cleanContent = cleanContent.slice(0, -3);
      analysisResult = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      analysisResult = {
        result: "suspicious",
        confidence: 0,
        currency: currency || "UNKNOWN",
        denomination: null,
        detectedFeatures: [],
        analysis: "Не можах да анализирам изображението правилно. Моля, направете по-ясна снимка на цялата банкнота при добро осветление.",
        recommendations: ["Направете нова снимка с по-добро осветление", "Уверете се, че цялата банкнота е видима и в рамката"],
      };
    }

    // --- Reconcile confidence with result label so they never contradict each other ---
    {
      const result = String(analysisResult.result ?? "suspicious");
      let confidence = Number(analysisResult.confidence);
      if (!Number.isFinite(confidence)) confidence = 50;
      confidence = Math.max(0, Math.min(100, Math.round(confidence)));

      if (result === "fake" && confidence > 35) {
        // Fake notes must read low — pull into the 5–25 range, biased by original signal
        confidence = Math.max(5, Math.min(25, Math.round(confidence * 0.25)));
      } else if (result === "authentic" && confidence < 85) {
        confidence = Math.max(85, Math.min(100, confidence < 50 ? 85 : confidence + (85 - confidence)));
      } else if (result === "suspicious") {
        if (confidence < 36) confidence = 40;
        else if (confidence > 84) confidence = 80;
      }
      analysisResult.confidence = confidence;
    }

    // Store in cache so same image always returns same result
    try {
      await scanClient
        .from("banknote_analysis_cache")
        .insert({ image_hash: imageHash, result: analysisResult });
    } catch (e) {
      console.warn("Cache insert failed (non-fatal):", (e as Error).message);
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing banknote:", error);
    return new Response(
      JSON.stringify({
        error: "Грешка при анализа",
        result: "suspicious",
        confidence: 0,
        analysis: "Възникна грешка при анализа на банкнотата.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
