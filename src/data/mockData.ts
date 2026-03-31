import { CoupleData } from '../types';

export const mockData: CoupleData = {
  jose: {
    user: {
      id: 'jose',
      name: 'Jose',
      color: 'var(--user-jose)',
      initials: 'JS',
    },
    metrics: {
      calories: { consumed: 2100, target: 2500 },
      macros: { protein: 150, carbs: 200, fat: 70 },
      trainingDays: 4,
      studyHours: 2,
      studyStreak: 3,
      streak: 12,
      mood: 4,
      compliance: 85,
      steps: 8500,
      finance: {
        spent: 850,
        budget: 1000,
        savingsRate: 15, // ↑
        topCategory: { name: 'Comida', percentage: 34 },
      },
      learning: {
        activeTopics: ['React', 'TypeScript', 'Design Systems'],
        inProgressCount: 2,
      }
    },
    recentMeals: [
      { id: '1', name: 'Avena con Proteína', calories: 450, time: '08:30', macros: { protein: 40, carbs: 50, fat: 10 } },
      { id: '2', name: 'Pollo con Arroz', calories: 600, time: '13:00', macros: { protein: 55, carbs: 60, fat: 15 } },
    ],
    recentWorkouts: [
      { id: 'w1', type: 'Fuerza', duration: 60, date: 'Hoy', notes: 'Día de pierna, enfocado en sentadillas.' },
      { id: 'w2', type: 'Cardio', duration: 30, date: 'Ayer', notes: 'Trote suave' },
    ],
    recentExpenses: [
      { id: 'e1', category: 'Comida', description: 'Supermercado', amount: -65.50, date: 'Hoy' },
      { id: 'e2', category: 'Transporte', description: 'Uber al centro', amount: -15.00, date: 'Ayer' },
      { id: 'e3', category: 'Otro', description: 'Venta de artículo usado', amount: 50.00, date: 'Hace 3 días' }
    ],
    recentLearning: [
      { id: 'l1', topic: 'React Server Components', duration: 45, resource: 'Video', date: 'Hoy', notes: 'Conceptos básicos' },
      { id: 'l2', topic: 'TypeScript Avanzado', duration: 60, resource: 'Curso', date: 'Ayer' },
    ],
    weeklyActivity: ['Fuerza', 'Cardio', 'Fuerza', 'Descanso', 'Fuerza', 'Cardio', 'Deporte'],
    aiMessages: {
      home: "Jose, bajaste 0.3kg esta semana. Vas bien, mantén el déficit.",
      nutrition: "Bien con la proteína hoy. ¿Planeas merendar algo ligero?",
      fitness: "Entrenaste piernas 2 veces esta semana. Considerá un día de recuperación activa.",
      finance: "Jose, gastaste un 30% más de lo presupuestado esta semana en Ocio. Revisá las suscripciones activas.",
      learn: "Buen progreso en React. Te faltan 2 horas para tu meta semanal."
    },
  },
  anto: {
    user: {
      id: 'anto',
      name: 'Anto',
      color: 'var(--user-anto)',
      initials: 'AM',
    },
    metrics: {
      calories: { consumed: 1600, target: 1800 },
      macros: { protein: 90, carbs: 150, fat: 55 },
      trainingDays: 3,
      studyHours: 6,
      studyStreak: 6,
      streak: 8,
      mood: 5,
      compliance: 92,
      steps: 12000,
      finance: {
        spent: 420,
        budget: 600,
        savingsRate: 30, // ↑
        topCategory: { name: 'Comida', percentage: 40 },
      },
      learning: {
        activeTopics: ['Diseño UI', 'Framer Motion', 'Figma'],
        inProgressCount: 3,
      }
    },
    recentMeals: [
      { id: '3', name: 'Tostadas con Huevo', calories: 350, time: '09:00', macros: { protein: 20, carbs: 30, fat: 15 } },
      { id: '4', name: 'Ensalada de Atún', calories: 400, time: '14:00', macros: { protein: 35, carbs: 15, fat: 20 } },
    ],
    recentWorkouts: [
      { id: 'w3', type: 'Movilidad', duration: 45, date: 'Ayer', notes: 'Yoga flow' },
    ],
    recentExpenses: [
      { id: 'e4', category: 'Ropa', description: 'Zapatillas de correr', amount: -120.00, date: 'Hace 2 días' },
      { id: 'e5', category: 'Salud', description: 'Farmacia', amount: -25.00, date: 'Hace 4 días' },
    ],
    recentLearning: [
      { id: 'l3', topic: 'Framer Motion Basics', duration: 90, resource: 'Curso', date: 'Hoy', notes: 'Animaciones de layouts' },
      { id: 'l4', topic: 'Teoría del Color', duration: 30, resource: 'Libro', date: 'Ayer' },
    ],
    weeklyActivity: ['Cardio', 'Movilidad', 'Descanso', 'Fuerza', 'Cardio', 'Descanso', 'Movilidad'],
    aiMessages: {
      home: "Anto, excelente constancia en tus horas de estudio esta semana. ¡Sigue así!",
      nutrition: "Llevas 3 días bajo en proteína. Agregá una porción de huevos en el desayuno.",
      fitness: "Buen ritmo con los pasos diarios. ¿Probamos una sesión de fuerza mañana?",
      finance: "El ahorro mensual va excelente, ya superaste la meta del 20%.",
      learn: "Anto, llevas 4 días estudiando diseño. Ya vas 6 horas esta semana. ¿Querés agregar un objetivo semanal?"
    },
  },
};
