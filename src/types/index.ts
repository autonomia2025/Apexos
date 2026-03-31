export type UserId = 'jose' | 'anto';

export interface User {
  id: UserId;
  name: string;
  color: string;
  initials: string;
}

export type ExpenseCategory = 'Comida' | 'Transporte' | 'Salud' | 'Ocio' | 'Ropa' | 'Otro';
export type LearningResource = 'Libro' | 'Curso' | 'Podcast' | 'Video' | 'Práctica';

export interface DailyMetrics {
  calories: { consumed: number; target: number; };
  macros: { protein: number; carbs: number; fat: number; };
  trainingDays: number; // out of 5
  studyHours: number;
  studyStreak: number;
  streak: number;
  mood: number; // 1-5
  compliance: number; // percentage
  steps: number;
  finance: {
    spent: number;
    budget: number;
    savingsRate: number; // percentage
    topCategory: { name: string; percentage: number };
  };
  learning: {
    activeTopics: string[];
    inProgressCount: number;
  };
}

export interface MealLog { id: string; name: string; calories: number; time: string; macros: { protein: number; carbs: number; fat: number; }; }
export interface WorkoutLog { id: string; type: 'Fuerza' | 'Cardio' | 'Deporte' | 'Movilidad' | 'Otro'; duration: number; date: string; notes?: string; }
export interface ExpenseLog { id: string; category: ExpenseCategory; description: string; amount: number; date: string; }
export interface LearningLog { id: string; topic: string; duration: number; resource: LearningResource; notes?: string; date: string; }

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
