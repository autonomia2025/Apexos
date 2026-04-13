import { supabase } from './supabase';

// ── NUTRITION ──────────────────────────────
export async function getNutritionLogs(userId: string, days = 7) {
  // Fetch last N+1 days to handle timezone safely
  const since = new Date();
  since.setDate(since.getDate() - (days + 1));
  since.setHours(0, 0, 0, 0);
  
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
  console.log('addNutritionLog called with:', log);
  
  const { data, error } = await supabase
    .from('nutrition_logs')
    .insert([log])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(error.message);
  }
  
  console.log('Insert successful:', data);
  return data;
}

export async function analyzeMeal(description: string) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data, error } = await supabase.functions.invoke(
    'food-analyzer',
    {
      body: { description },
      headers: session ? {
        Authorization: `Bearer ${session.access_token}`,
      } : {},
    }
  );

  if (error) {
    console.error('food-analyzer error:', error);
    throw error;
  }

  return data;
}

// ── FITNESS ────────────────────────────────
export async function getFitnessLogs(userId: string, days = 7) {
  // Fetch last N+1 days to handle timezone safely
  const since = new Date();
  since.setDate(since.getDate() - (days + 1));
  since.setHours(0, 0, 0, 0);
  
  const chileToday = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
  
  const [{ data: logs, error: logsError }, { data: checkin }] = await Promise.all([
    supabase
      .from('fitness_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', since.toISOString())
      .order('logged_at', { ascending: false }),
    supabase
      .from('daily_checkins')
      .select('steps')
      .eq('user_id', userId)
      .eq('checkin_date', chileToday)
      .maybeSingle()
  ]);
    
  if (logsError) throw logsError;
  return { logs: logs || [], todaySteps: checkin?.steps || 0 };
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
  const { data: { session } } = await supabase.auth.getSession();

  const { data, error } = await supabase.functions.invoke(
    'workout-analyzer',
    {
      body: { description },
      headers: session ? {
        Authorization: `Bearer ${session.access_token}`,
      } : {},
    }
  );

  if (error) throw error;
  return data;
}

// ── FINANCE ────────────────────────────────
export async function getFinanceLogs(userId: string, days = 30) {
  // Fetch last N+1 days to handle timezone safely
  const since = new Date();
  since.setDate(since.getDate() - (days + 1));
  since.setHours(0, 0, 0, 0);
  
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
  // Fetch last N+1 days to handle timezone safely
  const since = new Date();
  since.setDate(since.getDate() - (days + 1));
  since.setHours(0, 0, 0, 0);
  
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
  steps?: number;
}) {
  const chileToday = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
  const { data, error } = await supabase
    .from('daily_checkins')
    .upsert(
      { ...checkin, checkin_date: chileToday },
      { onConflict: 'user_id,checkin_date' }
    )
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getTodayCheckin(userId: string) {
  const chileToday = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('checkin_date', chileToday)
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

export async function updateGoalProgress(
  goalId: string,
  _userId: string,
  newValue: number,
  role: 'jose' | 'anto'
) {
  const column = role === 'jose' 
    ? 'current_value_jose' 
    : 'current_value_anto';
    
  const { error } = await supabase
    .from('goals')
    .update({ [column]: newValue })
    .eq('id', goalId);
    
  if (error) throw error;
}

export async function getActiveGoalsForModule(
  userId: string,
  module: string
) {
  const { data } = await supabase
    .from('goals')
    .select('*')
    .eq('status', 'active')
    .eq('module', module)
    .or(`user_id.eq.${userId},couple_goal.eq.true`);
  return data || [];
}

export async function autoUpdateGoals(
  userId: string,
  role: 'jose' | 'anto',
  module: string,
  value: number
) {
  const goals = await getActiveGoalsForModule(userId, module);
  
  await Promise.all(
    goals
      .filter(g => g.auto_track)
      .map(g => updateGoalProgress(g.id, userId, value, role))
  );
}

// ── TABLIO ─────────────────────────────────
export async function getTablioDashboard() {
  const [okrs, projects, revenue] = await Promise.all([
    supabase
      .from('tablio_okrs')
      .select(`
        *,
        tablio_key_results (*)
      `)
      .order('department'),
    supabase
      .from('tablio_projects')
      .select('*')
      .order('priority')
      .order('updated_at', { ascending: false }),
    supabase
      .from('tablio_revenue')
      .select('*')
      .order('year', { ascending: true })
      .order('month', { ascending: true }),
  ]);

  return {
    okrs: okrs.data || [],
    projects: projects.data || [],
    revenue: revenue.data || [],
  };
}

export async function getTablioclients() {
  const { data, error } = await supabase
    .from('tablio_clients')
    .select('*, tablio_payments(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addTablioClient(client: {
  name: string;
  venture: string;
  mrr_usd: number;
  mrr_clp: number;
  status: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('tablio_clients')
    .insert(client)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addTablioPayment(payment: {
  client_id: string;
  amount_usd: number;
  amount_clp: number;
  payment_date: string;
  month: string;
  year: number;
  status: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('tablio_payments')
    .insert(payment)
    .select()
    .single();
  if (error) throw error;
  return data;
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

export async function updateProfileSettings(
  userId: string,
  settings: {
    monthly_budget_clp?: number;
    calorie_target?: number;
    protein_target_g?: number;
  }
) {
  const { error } = await supabase
    .from('profiles')
    .update(settings)
    .eq('id', userId);
  if (error) throw error;
}

export async function getUserSummary(userId: string) {
  if (!userId) return defaultSummary();
  
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoISO = weekAgo.toISOString();

  // Use select with only needed columns to reduce payload
  const [nutrition, fitness, checkin] = await Promise.all([
    supabase
      .from('nutrition_logs')
      .select('calories, protein_g')  // only needed cols
      .eq('user_id', userId)
      .gte('logged_at', today + 'T00:00:00'),
    supabase
      .from('fitness_logs')
      .select('logged_at')  // only need dates for count
      .eq('user_id', userId)
      .gte('logged_at', weekAgoISO),
    supabase
      .from('daily_checkins')
      .select('mood_score, goal_met, weight_kg')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .maybeSingle(),
  ]);

  const calories = (nutrition.data || [])
    .reduce((sum, item) => sum + (item.calories || 0), 0);
  
  const protein = (nutrition.data || [])
    .reduce((sum, item) => sum + (Number(item.protein_g) || 0), 0);

  const trainingDays = new Set(
    (fitness.data || []).map(l => l.logged_at.split('T')[0])
  ).size;

  return {
    calories,
    protein: Math.round(protein),
    trainingDays,
    streak: 0,
    compliance: Math.min(Math.round((calories / 2000) * 100), 100),
    mood: checkin.data?.mood_score || 0,
    goalMet: checkin.data?.goal_met || false,
    weight: checkin.data?.weight_kg || null,
  };
}

function defaultSummary() {
  return {
    calories: 0, protein: 0, trainingDays: 0,
    streak: 0, compliance: 0, mood: 0,
    goalMet: false, weight: null,
  };
}

// ── CALENDAR ────────────────────────────────
export async function getCalendarEvents(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('calendar_events')
    .select(`
      *,
      profiles:created_by (
        name,
        color,
        initials
      )
    `)
    .gte('start_date', startDate)
    .lte('start_date', endDate)
    .order('start_date')
    .order('start_time');
    
  if (error) throw error;
  return data || [];
}

export async function getActivityForDateRange(
  joseId: string,
  antoId: string,
  startDate: string,
  endDate: string
) {
  // endDate is YYYY-MM-DD, we need to cover the full day
  const endDateTime = `${endDate}T23:59:59`;
  const startDateTime = `${startDate}T00:00:00`;

  const [
    joseNutrition, antoNutrition,
    joseFitness, antoFitness,
    joseLearning, antoLearning,
    events
  ] = await Promise.all([
    supabase.from('nutrition_logs').select('id,meal_name,calories,meal_type,logged_at').eq('user_id', joseId).gte('logged_at', startDateTime).lte('logged_at', endDateTime),
    supabase.from('nutrition_logs').select('id,meal_name,calories,meal_type,logged_at').eq('user_id', antoId).gte('logged_at', startDateTime).lte('logged_at', endDateTime),
    supabase.from('fitness_logs').select('id,workout_type,duration_min,logged_at,notes').eq('user_id', joseId).gte('logged_at', startDateTime).lte('logged_at', endDateTime),
    supabase.from('fitness_logs').select('id,workout_type,duration_min,logged_at,notes').eq('user_id', antoId).gte('logged_at', startDateTime).lte('logged_at', endDateTime),
    supabase.from('learning_logs').select('id,topic,duration_min,logged_at,resource_type').eq('user_id', joseId).gte('logged_at', startDateTime).lte('logged_at', endDateTime),
    supabase.from('learning_logs').select('id,topic,duration_min,logged_at,resource_type').eq('user_id', antoId).gte('logged_at', startDateTime).lte('logged_at', endDateTime),
    getCalendarEvents(startDate, endDate),
  ]);

  return {
    jose: {
      nutrition: joseNutrition.data || [],
      fitness: joseFitness.data || [],
      learning: joseLearning.data || [],
    },
    anto: {
      nutrition: antoNutrition.data || [],
      fitness: antoFitness.data || [],
      learning: antoLearning.data || [],
    },
    events: events,
  };
}

export async function createCalendarEvent(event: {
  created_by: string;
  title: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  all_day: boolean;
  visibility: 'personal' | 'shared';
  color?: string;
  location?: string;
  repeat_type?: string;
}) {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert([event])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCalendarEvent(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    all_day: boolean;
    visibility: string;
    location: string;
    event_type: string;
  }>
) {
  const { error } = await supabase
    .from('calendar_events')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCalendarEvent(id: string) {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── DELETE FUNCTIONS ───────────────────────────
export async function deleteNutritionLog(id: string) {
  const { error } = await supabase
    .from('nutrition_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function deleteFitnessLog(id: string) {
  const { error } = await supabase
    .from('fitness_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function deleteFinanceLog(id: string) {
  const { error } = await supabase
    .from('finance_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function deleteLearningLog(id: string) {
  const { error } = await supabase
    .from('learning_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
