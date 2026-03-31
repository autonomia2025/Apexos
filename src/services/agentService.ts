import OpenAI from 'openai';

export type AgentType = 'nutrition' | 'fitness' | 'finance' | 'learning' | 'planner' | 'business';

// Context Interfaces matching the prompt requirements
export interface NutritionContext {
  userName: string;
  caloriasHoy: number;
  caloriasMeta: number;
  proteinaHoy: number;
  proteinaMeta: number;
  pesoActual: number;
  pesoMeta: number;
  tendenciaPeso: 'bajando' | 'subiendo' | 'estable';
  cumplimientoSemana: number;
}

export interface FitnessContext {
  userName: string;
  entrenosSemana: number;
  metaEntrenosSemana: number;
  ultimoEntreno: string;
  rachaActual: number;
  pasosHoy: number;
}

export interface FinanceContext {
  userName: string;
  gastosMes: number;
  presupuestoMes: number;
  tasaAhorro: number;
  categoriaTopGasto: string;
  cumplimientoPresupuesto: number;
}

export interface LearningContext {
  userName: string;
  horasEstaSemana: number;
  metaHorasSemana: number;
  rachaActual: number;
  temaActivo: string;
  recursoTipo: string;
}

export interface BusinessContext {
  mrrActual: number;
  mrrMeta: number;
  okrCompletion: { informatica: number, ia: number, ventas: number, marketing: number };
  companyHealthScore: number;
  projectsEnRiesgo: number;
  topPriority: string;
}

export type AgentContext = NutritionContext | FitnessContext | FinanceContext | LearningContext | BusinessContext | (NutritionContext & FitnessContext & FinanceContext & LearningContext);

// API initialization
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  console.warn("⚠️ VITE_OPENAI_API_KEY is missing. Using fallback mock messages.");
}

const openai = apiKey ? new OpenAI({ 
  apiKey,
  dangerouslyAllowBrowser: true // Safe for local/personal OS but normally needs a backend
}) : null;

// System Prompts
const PROMPTS: Record<AgentType, string> = {
  nutrition: `Eres un nutricionista deportivo de alto rendimiento.
Analizás los datos del usuario y das coaching concreto,
directo y motivador en español rioplatense.
Máximo 2 oraciones. Sin saludos ni despedidas.
Solo el insight más importante en este momento.
Usá el nombre del usuario al inicio.`,
  fitness: `Eres un coach de fuerza y rendimiento deportivo de élite.
Analizás los datos de entrenamiento del usuario y das
una recomendación específica y accionable en español rioplatense.
Máximo 2 oraciones. Sin saludos. Directo al punto.
Usá el nombre del usuario al inicio.`,
  finance: `Eres un asesor financiero personal enfocado en disciplina
y libertad financiera. Analizás los datos de gastos e ingresos
y das un insight concreto en español rioplatense.
Máximo 2 oraciones. Sin saludos. Solo lo más relevante ahora.
Usá el nombre del usuario al inicio.`,
  learning: `Eres un estratega de aprendizaje acelerado.
Analizás los hábitos de estudio del usuario y sugerís
ajustes concretos para maximizar retención y progreso.
Máximo 2 oraciones en español rioplatense. Sin saludos.
Usá el nombre del usuario al inicio.`,
  planner: `Eres un coach de productividad y diseño de vida de alto rendimiento.
Analizás el panorama completo del usuario (nutrición, fitness,
finanzas, aprendizaje) y das una sola prioridad clara para hoy.
Máximo 2 oraciones en español rioplatense. Directo y motivador.
Usá el nombre del usuario al inicio.`,
  business: `Eres un advisor estratégico de startups y negocios digitales
de alto rendimiento. Analizás métricas empresariales reales
y das una recomendación estratégica concreta y accionable
en español rioplatense. Máximo 3 oraciones. Sin saludos.
Directo al punto más crítico ahora mismo para el crecimiento
del negocio. Usá el nombre Jose al inicio.`
};

// Fallback Messages
const FALLBACKS: Record<AgentType, (name: string) => string> = {
  nutrition: (name) => `${name}, revisá tu ingesta de proteína hoy y mantené el déficit calórico.`,
  fitness: (name) => `${name}, priorizá la recuperación si entrenaste más de 3 días seguidos.`,
  finance: (name) => `${name}, revisá tus gastos de la semana y ajustá la categoría más alta.`,
  learning: (name) => `${name}, 25 minutos de práctica deliberada hoy es mejor que 2 horas sin foco.`,
  planner: (name) => `${name}, elegí una sola prioridad para hoy y ejecutala completamente.`,
  business: (name) => `${name}, el crecimiento de MRR es clave esta semana. Poné el foco absoluto en destrabar el pipeline de ventas.`
};

export async function callAgent(
  agentType: AgentType,
  userName: string,
  contextData: AgentContext
): Promise<string> {
  // If no API key, return the fallback message immediately with a slight delay
  if (!openai) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(FALLBACKS[agentType](userName)), 1500);
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: PROMPTS[agentType] },
        { role: "user", content: `Datos actuales: ${JSON.stringify(contextData)}` }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.choices[0]?.message?.content?.trim() || FALLBACKS[agentType](userName);
  } catch (error) {
    console.error(`Error calling ${agentType} agent:`, error);
    // On error, return fallback message
    return FALLBACKS[agentType](userName);
  }
}
