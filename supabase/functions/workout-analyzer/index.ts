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
              content: `Eres un coach deportivo experto.
El usuario describe su entrenamiento en lenguaje natural.
Analizá y respondé ÚNICAMENTE con JSON válido, sin texto extra:
{
  "workout_type": "Fuerza|Cardio|Deporte|Movilidad|Otro",
  "duration_min": número entero,
  "calories_burned": número entero estimado,
  "summary": "descripción corta del entrenamiento",
  "intensity": "baja|media|alta"
}
Basate en estándares deportivos reales para estimar calorías. Respondé solo el JSON.`
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
    const workout = JSON.parse(cleanContent);

    return new Response(
      JSON.stringify(workout),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
