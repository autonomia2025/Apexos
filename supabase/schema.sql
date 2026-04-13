-- Users profile (linked to Supabase auth)
create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  role text check (role in ('jose', 'anto')) unique not null,
  color text not null,
  initials text not null,
  monthly_budget_clp int default 500000,
  calorie_target int default 2000,
  protein_target_g int default 150,
  created_at timestamptz default now()
);

-- Nutrition logs
create table nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  meal_name text not null,
  calories int not null default 0,
  protein_g numeric default 0,
  carbs_g numeric default 0,
  fat_g numeric default 0,
  meal_type text check (meal_type in 
    ('Desayuno','Almuerzo','Cena','Snack')) 
    default 'Almuerzo',
  logged_at timestamptz default now()
);

-- Fitness logs
create table fitness_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  workout_type text check (workout_type in 
    ('Fuerza','Cardio','Deporte','Movilidad','Otro')) 
    not null,
  duration_min int not null default 0,
  notes text,
  logged_at timestamptz default now()
);

-- Finance logs
create table finance_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  amount numeric not null,
  category text check (category in 
    ('Comida','Transporte','Salud','Ocio','Ropa','Otro')) 
    not null,
  note text,
  type text check (type in ('gasto','ingreso')) 
    default 'gasto',
  logged_at timestamptz default now()
);

-- Learning logs
create table learning_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  topic text not null,
  duration_min int not null default 0,
  resource_type text check (resource_type in 
    ('Libro','Curso','Podcast','Video','Práctica')) 
    default 'Video',
  logged_at timestamptz default now()
);

-- Daily check-ins
create table daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mood_score int check (mood_score between 1 and 5),
  weight_kg numeric,
  water_glasses int default 0,
  goal_met boolean default false,
  notes text,
  steps int default 0,
  checkin_date date default current_date,
  unique(user_id, checkin_date)
);

-- Goals
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  couple_goal boolean default false,
  module text check (module in 
    ('nutrition','fitness','finance',
     'learning','general')) not null,
  title text not null,
  target_value numeric,
  current_value_jose numeric default 0,
  current_value_anto numeric default 0,
  unit text default '',
  deadline date,
  status text check (status in 
    ('active','completed','paused')) 
    default 'active',
  created_at timestamptz default now()
);

-- Tablio OKRs
create table tablio_okrs (
  id uuid primary key default gen_random_uuid(),
  department text check (department in 
    ('informatica','ia','ventas','marketing')) not null,
  objective text not null,
  quarter text not null default 'Q2-2025',
  created_at timestamptz default now()
);

-- Tablio Key Results
create table tablio_key_results (
  id uuid primary key default gen_random_uuid(),
  okr_id uuid references tablio_okrs(id) on delete cascade,
  description text not null,
  current_value numeric default 0,
  target_value numeric not null,
  unit text default '',
  status text check (status in 
    ('en_curso','completado','en_riesgo')) 
    default 'en_curso'
);

-- Tablio Projects
create table tablio_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  venture text check (venture in 
    ('RecepcionistaAI','AutonomIA',
     'BotFactory','ROMO OS','Otro')) not null,
  department text not null,
  status text check (status in 
    ('Activo','En pausa','Completado')) 
    default 'Activo',
  priority text check (priority in 
    ('Alta','Media','Baja')) default 'Media',
  progress int default 0 
    check (progress between 0 and 100),
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Tablio Revenue
create table tablio_revenue (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  year int not null,
  amount numeric not null default 0,
  venture text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table nutrition_logs enable row level security;
alter table fitness_logs enable row level security;
alter table finance_logs enable row level security;
alter table learning_logs enable row level security;
alter table daily_checkins enable row level security;
alter table goals enable row level security;
alter table tablio_okrs enable row level security;
alter table tablio_key_results enable row level security;
alter table tablio_projects enable row level security;
alter table tablio_revenue enable row level security;

-- Policies: authenticated users can read all,
-- but only write their own data
create policy "Users can read all profiles"
  on profiles for select to authenticated
  using (true);

create policy "Users can read all logs"
  on nutrition_logs for select to authenticated
  using (true);

create policy "Users insert own nutrition logs"
  on nutrition_logs for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can read all fitness logs"
  on fitness_logs for select to authenticated
  using (true);

create policy "Users insert own fitness logs"
  on fitness_logs for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can read all finance logs"
  on finance_logs for select to authenticated
  using (true);

create policy "Users insert own finance logs"
  on finance_logs for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can read all learning logs"
  on learning_logs for select to authenticated
  using (true);

create policy "Users insert own learning logs"
  on learning_logs for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can read all checkins"
  on daily_checkins for select to authenticated
  using (true);

create policy "Users insert own checkins"
  on daily_checkins for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users upsert own checkins"
  on daily_checkins for update to authenticated
  using (user_id = auth.uid());

create policy "Users can read all goals"
  on goals for select to authenticated
  using (true);

create policy "Users can manage goals"
  on goals for all to authenticated
  using (true);

create policy "All authenticated read tablio"
  on tablio_okrs for select to authenticated
  using (true);

create policy "All authenticated read kr"
  on tablio_key_results for select to authenticated
  using (true);

create policy "All authenticated read projects"
  on tablio_projects for select to authenticated
  using (true);

create policy "All authenticated manage projects"
  on tablio_projects for all to authenticated
  using (true);

create policy "All authenticated read revenue"
  on tablio_revenue for select to authenticated
  using (true);
