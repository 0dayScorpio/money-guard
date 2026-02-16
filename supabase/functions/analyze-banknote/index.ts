import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DAILY_LIMIT = 5;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_CURRENCIES = ["EUR", "USD", "GBP", "BGN"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { imageBase64, currency, deviceId } = body;

    // --- Input Validation ---

    // 1. Require deviceId for rate limiting
    if (!deviceId || typeof deviceId !== "string" || deviceId.length < 10 || deviceId.length > 128) {
      return new Response(
        JSON.stringify({ error: "Valid device ID required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Validate imageBase64 presence and type
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Validate image size
    if (imageBase64.length > MAX_IMAGE_SIZE) {
      return new Response(
        JSON.stringify({ error: "Image too large (max 10MB)" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Validate currency if provided
    if (currency && (typeof currency !== "string" || !VALID_CURRENCIES.includes(currency.toUpperCase()))) {
      return new Response(
        JSON.stringify({ error: "Invalid currency" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Server-Side Rate Limiting (using this project's own database) ---
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const scanClient = createClient(supabaseUrl, supabaseKey);
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

    const systemPrompt = `Ти си експерт по верификация на банкноти. Анализирай предоставеното изображение и определи дали банкнотата е истинска или фалшива.

Защитни характеристики, които трябва да провериш:

ЗА ЕВРО (EUR):
- Холограмна лента с преливащи цветове
- Воден знак с портрет на Европа
- Защитна нишка с надпис
- Изумруден номер (променящ цвета)
- Релефен печат
- Микропечат
- UV флуоресценция

ЗА ЩАТСКИ ДОЛАР (USD):
- 3D защитна лента (за $100 - синя с движещи се изображения)
- Цветопроменящо мастило
- Воден знак с портрет
- Защитна нишка
- Микропечат
- Специална хартия (памук и лен)

ЗА БРИТАНСКА ЛИРА (GBP):
- Полимерен материал
- Прозрачен прозорец
- Холограмни елементи
- Цветопроменящи изображения

ЗА БЪЛГАРСКИ ЛЕВ (BGN):
- Воден знак с портрет
- Защитна нишка с надпис
- Кинеграма (холограмен елемент)
- Скрито изображение
- Цветопроменяща се лента

Отговори САМО с валиден JSON обект в следния формат (без markdown, без допълнителен текст):
{
  "result": "authentic" | "suspicious" | "fake",
  "confidence": число от 0 до 100,
  "currency": "EUR" | "USD" | "GBP" | "BGN" | "UNKNOWN",
  "denomination": номинал като число или null ако не може да се определи,
  "detectedFeatures": [
    {
      "name": "име на защитната характеристика",
      "detected": true/false,
      "description": "кратко описание на откритото"
    }
  ],
  "analysis": "Подробно обяснение на анализа на български език - какво е открито, какво липсва и защо е даден този резултат",
  "recommendations": ["препоръка 1", "препоръка 2"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { 
                type: "text", 
                text: `Анализирай тази банкнота${currency ? ` (предполагаема валута: ${currency})` : ''}. Определи дали е истинска, съмнителна или фалшива въз основа на видимите защитни характеристики.` 
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
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
    let analysisResult;
    try {
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      analysisResult = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      analysisResult = {
        result: "suspicious",
        confidence: 50,
        currency: currency || "UNKNOWN",
        denomination: null,
        detectedFeatures: [],
        analysis: "Не можах да анализирам изображението правилно. Моля, направете по-ясна снимка на банкнотата.",
        recommendations: ["Направете нова снимка с по-добро осветление", "Уверете се, че цялата банкнота е видима"]
      };
    }

    // Include remaining scans in response
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
        analysis: "Възникна грешка при анализа на банкнотата."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
