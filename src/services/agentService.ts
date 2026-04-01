import { supabase } from '../lib/supabase';

export type AgentType = 'nutrition' | 'fitness' | 'finance' | 'learning' | 'planner' | 'business';

export interface NutritionContext {
  userName: string; caloriasHoy: number; caloriasMeta: number;
  proteinaHoy: number; proteinaMeta: number; pesoActual: number;
  pesoMeta: number; tendenciaPeso: string; cumplimientoSemana: number;
}
export interface FitnessContext {
  userName: string; entrenosSemana: number; metaEntrenosSemana: number;
  ultimoEntreno: string; rachaActual: number; pasosHoy: number;
}
export interface FinanceContext {
  userName: string; gastosMes: number; presupuestoMes: number;
  tasaAhorro: number; categoriaTopGasto: string; cumplimientoPresupuesto: number;
}
export interface LearningContext {
  userName: string; horasEstaSemana: number; metaHorasSemana: number;
  rachaActual: number; temaActivo: string; recursoTipo: string;
}
export interface BusinessContext {
  mrrActual: number; mrrMeta: number;
  okrCompletion: { informatica: number; ia: number; ventas: number; marketing: number };
  companyHealthScore: number; projectsEnRiesgo: number; topPriority: string;
}
export type AgentContext =
  | NutritionContext | FitnessContext | FinanceContext
  | LearningContext | BusinessContext
  | (NutritionContext & FitnessContext & FinanceContext & LearningContext);

const FALLBACKS: Record<AgentType, (name: string) => string> = {
  nutrition: (n) => `${n}, revisá tu ingesta de proteína hoy y mantené el déficit calórico.`,
  fitness:   (n) => `${n}, priorizá la recuperación si entrenaste más de 3 días seguidos.`,
  finance:   (n) => `${n}, revisá tus gastos de la semana y ajustá la categoría más alta.`,
  learning:  (n) => `${n}, 25 minutos de práctica deliberada hoy es mejor que 2 horas sin foco.`,
  planner:   (n) => `${n}, elegí una sola prioridad para hoy y ejecutala completamente.`,
  business:  (n) => `${n}, enfocate en cerrar los leads activos antes de generar nuevos.`,
};

export async function callAgent(
  agentType: AgentType,
  userName: string,
  contextData: AgentContext
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('agent', {
      body: { agentType, userName, contextData },
    });

    if (error) throw error;
    return data?.message ?? FALLBACKS[agentType](userName);
  } catch (error) {
    console.error('Agent error:', error);
    return FALLBACKS[agentType](userName);
  }
}
