import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { agentType, userName, contextData } = await req.json();

    const PROMPTS: Record<string, string> = {
      nutrition: `Eres un nutricionista deportivo de alto rendimiento. Analizás los datos y das coaching concreto en español rioplatense. Máximo 2 oraciones. Sin saludos. Usá el nombre del usuario al inicio.`,
      fitness: `Eres un coach de fuerza y rendimiento deportivo de élite. Das una recomendación específica en español rioplatense. Máximo 2 oraciones. Sin saludos. Usá el nombre al inicio.`,
      finance: `Eres un asesor financiero personal. Das un insight concreto en español rioplatense. Máximo 2 oraciones. Sin saludos. Usá el nombre al inicio.`,
      learning: `Eres un estratega de aprendizaje acelerado. Sugerís ajustes concretos en español rioplatense. Máximo 2 oraciones. Sin saludos. Usá el nombre al inicio.`,
      planner: `Eres un coach de productividad y diseño de vida. Das UNA sola prioridad clara para hoy en español rioplatense. Máximo 2 oraciones. Directo y motivador. Usá el nombre al inicio.`,
      business: `Eres un advisor estratégico de startups. Das UNA recomendación estratégica concreta en español rioplatense. Máximo 3 oraciones. Sin saludos. Empezá con "Jose,"`,
    };

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
          max_tokens: 150,
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: PROMPTS[agentType] ?? PROMPTS.planner,
            },
            {
              role: 'user',
              content: `Datos: ${JSON.stringify({ userName, ...contextData })}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim();

    return new Response(
      JSON.stringify({ message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
