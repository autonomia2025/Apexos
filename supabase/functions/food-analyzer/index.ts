import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Read body as text first to handle encoding
    const bodyText = await req.text();
    let description = '';

    try {
      const body = JSON.parse(bodyText);
      description = body.description || '';
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!description || description.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'description is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing description:', description);

    const openaiRes = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 500,
          temperature: 0.1,
          messages: [
            {
              role: 'system',
              content: 'You are a nutrition expert. Analyze the food description and respond ONLY with valid JSON, no markdown, no extra text. Format: {"meal_name":"string","calories":number,"protein_g":number,"carbs_g":number,"fat_g":number,"breakdown":[{"item":"string","amount":"string","calories":number}]}. The calories field MUST equal the sum of all breakdown calories.',
            },
            {
              role: 'user',
              content: `Analyze this meal and estimate nutritional values: ${description}`,
            },
          ],
        }),
      }
    );

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI error status:', openaiRes.status, errText);
      return new Response(
        JSON.stringify({ error: 'OpenAI request failed', status: openaiRes.status }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content?.trim();

    console.log('OpenAI response:', content);

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Empty response from OpenAI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Strip markdown code blocks if present
    const cleaned = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let nutrition;
    try {
      nutrition = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', cleaned);
      return new Response(
        JSON.stringify({ error: 'Failed to parse nutrition data', raw: cleaned }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Recalculate calories from breakdown on server side
    if (nutrition.breakdown && Array.isArray(nutrition.breakdown)) {
      const recalculated = nutrition.breakdown.reduce(
        (sum: number, item: any) => sum + (Number(item.calories) || 0), 0
      );
      if (recalculated > 0) {
        nutrition.calories = recalculated;
      }
    }

    return new Response(
      JSON.stringify(nutrition),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
