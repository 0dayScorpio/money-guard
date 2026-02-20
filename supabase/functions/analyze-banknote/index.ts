import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DAILY_LIMIT = 5;
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
      // Return cached result — does NOT consume a scan
      const cachedResult = cached.result as Record<string, unknown>;

      // Still fetch remaining for display purposes (read-only)
      const today = new Date().toISOString().slice(0, 10);
      const { data: usageData } = await scanClient
        .from("scan_usage")
        .select("scan_count")
        .eq("device_id", deviceId)
        .eq("scan_date", today)
        .maybeSingle();
      const used = usageData?.scan_count ?? 0;
      cachedResult.remaining = Math.max(0, DAILY_LIMIT - used);
      cachedResult.fromCache = true;

      return new Response(
        JSON.stringify(cachedResult),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Server-Side Rate Limiting ---
    const { data: limitCheck, error: limitError } = await scanClient.rpc("consume_scan", {
      p_device_id: deviceId,
      p_daily_limit: DAILY_LIMIT,
    });

    const limitResult = Array.isArray(limitCheck) ? limitCheck[0] : limitCheck;

    if (limitError || !limitResult?.allowed) {
      return new Response(
        JSON.stringify({
          error: "Дневният лимит за сканиране е достигнат. Опитайте утре.",
          remaining: limitResult?.remaining ?? 0,
          limit: DAILY_LIMIT,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- AI Analysis ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Ти си съдебен експерт по банкноти с 20+ години опит. Твоята ЕДИНСТВЕНА задача е да анализираш изображения на банкноти и да определиш тяхната автентичност.

КРИТИЧНИ ПРАВИЛА — НИКОГА НЕ ГИ НАРУШАВАЙ:
1. Ако изображението НЕ е банкнота (телефон, хартия, хора, предмети и т.н.), върни "result": "suspicious", confidence: 0, и обясни ясно, че изображението не е банкнота.
2. НИКОГА не измисляй или предполагай характеристики, които не виждаш ясно в изображението.
3. НИКОГА не даваш "authentic" само защото изображението изглежда като банкнота — трябва да видиш РЕАЛНИ защитни елементи.
4. Ако качеството на изображението е лошо и не можеш да видиш защитните характеристики, задължително посочи това и дай "suspicious" с ниска увереност.
5. Бъди КОНСЕРВАТИВЕН: при съмнение винаги избери "suspicious" вместо "authentic".
6. Анализирай САМО това, което РЕАЛНО виждаш в изображението — без предположения.

МЕТОДОЛОГИЯ НА АНАЛИЗА:
За всяка видима защитна характеристика:
- Провери дали е физически видима в изображението
- Опиши ТОЧНО какво виждаш (или не виждаш)
- Не предполагай наличие на характеристика само защото банкнотата от тази серия трябва да я има

ЗАЩИТНИ ХАРАКТЕРИСТИКИ ПО ВАЛУТА:

ЕВРО (EUR) — серия "Европа" (2013+) и стара серия:
- Холограмна лента/наклейка с портрет на Европа и номинал (нова серия) или стикер (стара серия)
- Изумруден номер — числата сменят цвета от изумрудено към дълбоко синьо при наклон
- Воден знак — видим при поставяне на светлина
- Защитна нишка — вградена тъмна лента с надпис "EURO" + номинал
- Релефен печат — усеща се при докосване (невидим на снимка, но може да се вижда структура)
- Портал с холограма (нова серия) — показва € символ и карта на Европа
- Микропечат — дребни букви, видими само при увеличение
- UV флуоресцентни елементи (не видими на нормална снимка)

ЩАТСКИ ДОЛАР (USD):
- 3D защитна лента (за $100 — синя с движещи се камбани/100)
- Цветопроменящо мастило на номинала (долу вдясно) — злато → зелено
- Воден знак с портрет вдясно от основния
- Защитна нишка с UV надпис "USA 100" (за $100)
- Микропечат около портрета
- Портрет с фин детайл и фон от концентрични линии

БРИТАНСКА ЛИРА (GBP):
- Полимерна основа (прозрачен прозорец с холограма)
- Портрет на монарха в холограмния прозорец
- Цветопроменящи числа

БЪЛГАРСКИ ЛЕВ (BGN):
- Воден знак с портрет
- Защитна нишка с надпис "БНБ"
- Кинеграма (холограмен елемент с преливащи цветове)
- Скрито изображение видимо само под ъгъл
- Цветопроменяща се лента с номинала

ФОРМАТ НА ОТГОВОРА — САМО валиден JSON, без markdown, без допълнителен текст:
{
  "result": "authentic" | "suspicious" | "fake",
  "confidence": число от 0 до 100,
  "currency": "EUR" | "USD" | "GBP" | "BGN" | "UNKNOWN",
  "denomination": номинал като число или null,
  "detectedFeatures": [
    {
      "name": "Точно название на характеристиката",
      "detected": true | false,
      "description": "Конкретно описание на РЕАЛНО видяното или невидяното"
    }
  ],
  "analysis": "Подробен анализ на български: какво ТОЧНО видях, какво липсва/съмнително, защо е даден този резултат. Бъди конкретен и честен.",
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
        model: "google/gemini-2.5-flash",
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

    // Store in cache so same image always returns same result
    await scanClient
      .from("banknote_analysis_cache")
      .insert({ image_hash: imageHash, result: analysisResult })
      .throwOnError()
      .catch((e: Error) => console.warn("Cache insert failed (non-fatal):", e.message));

    // Attach remaining scan count
    analysisResult.remaining = limitResult?.remaining ?? 0;

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
