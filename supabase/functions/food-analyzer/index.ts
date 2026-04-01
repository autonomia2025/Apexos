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
              content: `Eres un nutricionista experto. 
El usuario te describe una comida en lenguaje natural 
(puede ser en porciones, gramos, tazas, unidades, etc).
Tu tarea es estimar los valores nutricionales totales.

Respondé ÚNICAMENTE con un JSON válido, sin texto extra:
{
  "meal_name": "nombre descriptivo del plato",
  "calories": número entero,
  "protein_g": número decimal,
  "carbs_g": número decimal,
  "fat_g": número decimal,
  "breakdown": [
    { "item": "nombre ingrediente", "amount": "cantidad", "calories": número }
  ]
}

Reglas:
- Usá valores realistas basados en tablas nutricionales estándar
- Si no podés estimar algo, usá 0
- meal_name debe ser descriptivo y en español
- breakdown muestra cada ingrediente por separado
- Nunca agregues texto fuera del JSON`
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
