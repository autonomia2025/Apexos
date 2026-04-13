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
    const { description } = await req.json();

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 200,
          temperature: 0.2,
          messages: [
            {
              role: 'system',
              content: `Eres un nutricionista experto con acceso a tablas nutricionales precisas. El usuario describe una comida.
Tu tarea es estimar valores nutricionales REALES.

REGLAS ESTRICTAS:
1. Usá valores por 100g de tablas nutricionales estándar
2. El campo "calories" del JSON raíz DEBE ser exactamente la SUMA de todos los calories del breakdown array
3. Estimá porciones realistas si no se especifican
4. Sé preciso — estos datos se usan para tracking de salud

Respondé ÚNICAMENTE con JSON válido sin texto extra:
{
  "meal_name": "nombre descriptivo",
  "calories": SUMA_EXACTA_DEL_BREAKDOWN,
  "protein_g": número_decimal,
  "carbs_g": número_decimal,
  "fat_g": número_decimal,
  "breakdown": [
    { 
      "item": "nombre ingrediente",
      "amount": "cantidad estimada",
      "calories": número_entero
    }
  ]
}

La suma de breakdown[].calories DEBE igualar calories.`
            },
            {
              role: 'user',
              content: description
            }
          ],
        }),
      }
    );

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    
    // Parse JSON response – cleanup markdown if present
    const cleanContent = content.replace(/^```json/, '').replace(/```$/, '').trim();
    const nutrition = JSON.parse(cleanContent);

    return new Response(
      JSON.stringify(nutrition),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
