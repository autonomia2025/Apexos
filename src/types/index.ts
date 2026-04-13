export type UserId = string;

export interface User {
  id: UserId;
  name: string;
  color: string;
  initials: string;
  role: 'jose' | 'anto';
  monthlyBudgetCLP: number;
  calorieTarget: number;
  proteinTarget: number;
}

export type ExpenseCategory = 'Comida' | 'Transporte' | 'Salud' | 'Ocio' | 'Ropa' | 'Otro';
export type LearningResource = 'Libro' | 'Curso' | 'Podcast' | 'Video' | 'Práctica';

export interface DailyMetrics {
  calories: { consumed: number; target: number; };
  macros: { protein: number; carbs: number; fat: number; proteinTarget?: number; };
  trainingDays: number;
  studyHours: number;
  studyStreak: number;
  streak: number;
  mood: number;
  compliance: number;
  steps: number;
  finance: {
    spent: number;
    budget: number;
    savingsRate: number;
    topCategory: { name: string; amount: number; percentage?: number };
    compliance?: number;
  };
  learning: {
    activeTopics: string[];
    inProgressCount: number;
  };
}

export interface MealLog { id: string; name: string; calories: number; time: string; macros: { protein: number; carbs: number; fat: number; }; }
export interface WorkoutLog { id: string; type: string; duration: number; date: string; notes?: string; }
export interface ExpenseLog { id: string; category: ExpenseCategory; description: string; amount: number; date: string; }
export interface LearningLog { id: string; topic: string; duration: string | number; resource: string; notes?: string; date: string; }

export interface UserData {
  user: User;
  metrics: DailyMetrics;
  recentMeals: MealLog[];
  recentWorkouts: WorkoutLog[];
  recentExpenses: ExpenseLog[];
  recentLearning: LearningLog[];
  weeklyActivity: string[];
  aiMessages: {
    home: string;
    nutrition: string;
    fitness: string;
    finance: string;
    learn: string;
  };
}

export interface CoupleData {
  jose: UserData;
  anto: UserData;
}
