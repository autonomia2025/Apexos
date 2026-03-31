export type Department = 'Informática' | 'Desarrollo IA' | 'Ventas' | 'Marketing';

export interface KeyResult {
  id: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: 'En curso' | 'Completado' | 'En riesgo';
}

export interface Objective {
  id: string;
  title: string;
  keyResults: KeyResult[];
  completion: number; // percentage 0-100
}

export interface Project {
  id: string;
  name: string;
  venture: 'RecepcionistaAI' | 'AutonomIA' | 'BotFactory' | 'ROMO OS' | 'Otro';
  departments: Department[];
  status: 'Activo' | 'En pausa' | 'Completado';
  progress: number;
  lastUpdated: string;
  priority: 'Alta' | 'Media' | 'Baja';
}

export interface RevenueData {
  mrrActual: number;
  mrrMeta: number;
  history: { month: string; value: number }[];
  byVenture: { venture: string; amount: number; percentage: number }[];
}

export interface TablioData {
  healthScore: number;
  departmentScores: Record<Department, number>;
  okrs: Record<Department, Objective[]>;
  revenue: RevenueData;
  projects: Project[];
}
