import { Goal } from '../types/goals';

export const mockGoals: Goal[] = [
  {
    id: 'g1',
    type: 'personal',
    userId: 'jose',
    module: 'fitness',
    title: 'Correr 100km en el mes',
    description: 'Acumular kilómetros de running',
    targetValue: 100,
    currentValueJose: 45,
    currentValueAnto: 45, // Personal goal, so same as jose or unused
    unit: 'km',
    deadline: 'Fin de mes',
    status: 'active'
  },
  {
    id: 'g2',
    type: 'personal',
    userId: 'anto',
    module: 'learning',
    title: 'Completar curso de Figma UX/UI',
    description: 'Avanzar módulos del curso avanzado',
    targetValue: 20,
    currentValueJose: 12, // Used for Anto
    currentValueAnto: 12,
    unit: 'horas',
    deadline: '15 de Mayo',
    status: 'active'
  },
  {
    id: 'g3',
    type: 'shared',
    userId: 'both',
    module: 'finance',
    title: 'Fondo de Vacaciones',
    description: 'Ahorrar para el viaje a la nieve',
    targetValue: 1000,
    currentValueJose: 450,
    currentValueAnto: 300,
    unit: 'usd',
    deadline: 'Julio 2026',
    status: 'active'
  },
  {
    id: 'g4',
    type: 'shared',
    userId: 'both',
    module: 'general',
    title: 'Días sin comida delivery',
    description: 'Cocinar en casa para mejorar ahorro y salud',
    targetValue: 20,
    currentValueJose: 15,
    currentValueAnto: 18,
    unit: 'días',
    deadline: 'Fin de mes',
    status: 'active'
  }
];
