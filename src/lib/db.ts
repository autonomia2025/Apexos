import { supabase } from './supabase';

// ── NUTRITION ──────────────────────────────
export async function getNutritionLogs(userId: string, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', since.toISOString())
    .order('logged_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function addNutritionLog(log: {
  user_id: string;
  meal_name: string;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  meal_type: string;
}) {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .insert([log])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function analyzeMeal(description: string): Promise<{
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  breakdown: { item: string; amount: string; calories: number }[];
}> {
  const { data, error } = await supabase.functions.invoke(
    'food-analyzer',
    { body: { description } }
  );
  if (error) throw error;
  return data;
}

// ── FITNESS ────────────────────────────────
export async function getFitnessLogs(userId: string, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  const { data, error } = await supabase
    .from('fitness_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', since.toISOString())
    .order('logged_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function addFitnessLog(log: {
  user_id: string;
  workout_type: string;
  duration_min: number;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('fitness_logs')
    .insert([log])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function analyzeWorkout(description: string): Promise<{
  workout_type: string;
  duration_min: number;
  calories_burned: number;
  summary: string;
  intensity: 'baja' | 'media' | 'alta';
}> {
  const { data, error } = await supabase.functions.invoke(
    'workout-analyzer',
    { body: { description } }
  );
  if (error) throw error;
  return data;
}

// ── FINANCE ────────────────────────────────
export async function getFinanceLogs(userId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  const { data, error } = await supabase
    .from('finance_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', since.toISOString())
    .order('logged_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function addFinanceLog(log: {
  user_id: string;
  amount: number;
  category: string;
  note?: string;
  type: 'gasto' | 'ingreso';
}) {
  const { data, error } = await supabase
    .from('finance_logs')
    .insert([log])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── LEARNING ───────────────────────────────
export async function getLearningLogs(userId: string, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  const { data, error } = await supabase
    .from('learning_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', since.toISOString())
    .order('logged_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function addLearningLog(log: {
  user_id: string;
  topic: string;
  duration_min: number;
  resource_type: string;
}) {
  const { data, error } = await supabase
    .from('learning_logs')
    .insert([log])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── CHECK-IN ───────────────────────────────
export async function upsertCheckin(checkin: {
  user_id: string;
  mood_score?: number;
  weight_kg?: number;
  water_glasses?: number;
  goal_met?: boolean;
  notes?: string;
}) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_checkins')
    .upsert(
      { ...checkin, checkin_date: today },
      { onConflict: 'user_id,checkin_date' }
    )
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getTodayCheckin(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('checkin_date', today)
    .maybeSingle();
    
  if (error) throw error;
  return data;
}

// ── GOALS ──────────────────────────────────
export async function getGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .or(`user_id.eq.${userId},couple_goal.eq.true`)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function addGoal(goal: {
  user_id: string;
  couple_goal: boolean;
  module: string;
  title: string;
  target_value?: number;
  unit?: string;
  deadline?: string;
}) {
  const { data, error } = await supabase
    .from('goals')
    .insert([goal])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── TABLIO ─────────────────────────────────
export async function getTablioDashboard() {
  const [okrs, projects, revenue] = await Promise.all([
    supabase
      .from('tablio_okrs')
      .select('*, tablio_key_results(*)')
      .order('department'),
    supabase
      .from('tablio_projects')
      .select('*')
      .order('priority', { ascending: false })
      .order('updated_at', { ascending: false }),
    supabase
      .from('tablio_revenue')
      .select('*')
      .order('year', { ascending: true })
      .order('month', { ascending: true }),
  ]);
  
  if (okrs.error) throw okrs.error;
  if (projects.error) throw projects.error;
  if (revenue.error) throw revenue.error;

  return {
    okrs: okrs.data || [],
    projects: projects.data || [],
    revenue: revenue.data || [],
  };
}

export async function addProject(project: {
  name: string;
  venture: string;
  department: string;
  priority: string;
  status: string;
  progress: number;
}) {
  const { data, error } = await supabase
    .from('tablio_projects')
    .insert([project])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProjectProgress(id: string, progress: number) {
  const { error } = await supabase
    .from('tablio_projects')
    .update({ progress, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function getUserSummary(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const [nutrition, fitness, finance, learning, checkin] = await Promise.all([
    supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', today),
    supabase
      .from('fitness_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', startOfWeek.toISOString()),
    supabase
      .from('finance_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', today),
    supabase
      .from('learning_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', startOfWeek.toISOString()),
    supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .maybeSingle(),
  ]);

  const calories = (nutrition.data || []).reduce((sum, item) => sum + item.calories, 0);
  const coreMacros = (nutrition.data || []).reduce((acc, item) => ({
    protein: acc.protein + (Number(item.protein_g) || 0),
    carbs: acc.carbs + (Number(item.carbs_g) || 0),
    fat: acc.fat + (Number(item.fat_g) || 0),
  }), { protein: 0, carbs: 0, fat: 0 });

  const trainingDays = new Set((fitness.data || []).map(f => new Date(f.logged_at).toISOString().split('T')[0])).size;
  const financeSpent = (finance.data || []).reduce((sum, item) => sum + (item.type === 'gasto' ? Number(item.amount) : 0), 0);
  const studyHours = (learning.data || []).reduce((sum, item) => sum + (item.duration_min / 60), 0);

  return {
    calories,
    macros: coreMacros,
    trainingDays,
    financeSpent,
    studyHours,
    checkin: checkin.data,
    compliance: checkin.data?.goal_met ? 100 : 0,
    streak: 0, 
  };
}
