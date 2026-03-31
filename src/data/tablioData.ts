import { TablioData } from '../types/tablio';

export const mockTablioData: TablioData = {
  healthScore: 78,
  departmentScores: {
    'Informática': 85,
    'Desarrollo IA': 65,
    'Ventas': 70,
    'Marketing': 92,
  },
  okrs: {
    'Informática': [
      {
        id: 'inf1',
        title: 'Infraestructura estable y escalable',
        completion: 90,
        keyResults: [
          { id: 'kr1', description: 'Uptime del sistema ≥99.5%', currentValue: 97.2, targetValue: 99.5, unit: '%', status: 'En curso' },
          { id: 'kr2', description: 'Reducir tiempo de deploy a <10min', currentValue: 14, targetValue: 10, unit: 'min', status: 'En riesgo' },
          { id: 'kr3', description: '0 incidentes críticos en el trimestre', currentValue: 2, targetValue: 0, unit: '', status: 'En riesgo' },
        ]
      },
      {
        id: 'inf2',
        title: 'Automatización de procesos internos',
        completion: 60,
        keyResults: [
          { id: 'kr4', description: '3 flujos de n8n productivos', currentValue: 2, targetValue: 3, unit: '', status: 'En curso' },
          { id: 'kr5', description: 'Dashboard interno operativo', currentValue: 60, targetValue: 100, unit: '%', status: 'En curso' },
        ]
      }
    ],
    'Desarrollo IA': [
      {
        id: 'ia1',
        title: 'Lanzar RecepcionistaAI a 5 clientes',
        completion: 50,
        keyResults: [
          { id: 'kr6', description: 'Clientes activos pagando', currentValue: 2, targetValue: 5, unit: '', status: 'En curso' },
          { id: 'kr7', description: 'NPS promedio ≥8', currentValue: 9.1, targetValue: 8, unit: '', status: 'Completado' },
          { id: 'kr8', description: 'Tiempo de onboarding <2 días', currentValue: 1.5, targetValue: 2, unit: 'días', status: 'Completado' },
        ]
      },
      {
        id: 'ia2',
        title: 'Consolidar AutonomIA Suite',
        completion: 35,
        keyResults: [
          { id: 'kr9', description: '3 módulos documentados', currentValue: 1, targetValue: 3, unit: '', status: 'En curso' },
          { id: 'kr10', description: 'Demo deck listo', currentValue: 40, targetValue: 100, unit: '%', status: 'En riesgo' },
        ]
      }
    ],
    'Ventas': [
      {
        id: 'ven1',
        title: 'Alcanzar $2,000 USD MRR',
        completion: 40,
        keyResults: [
          { id: 'kr11', description: 'MRR actual', currentValue: 800, targetValue: 2000, unit: 'USD', status: 'En riesgo' },
          { id: 'kr12', description: '10 propuestas enviadas', currentValue: 6, targetValue: 10, unit: '', status: 'En curso' },
          { id: 'kr13', description: 'Tasa de cierre ≥30%', currentValue: 33, targetValue: 30, unit: '%', status: 'Completado' }
        ]
      },
      {
        id: 'ven2',
        title: 'Pipeline estructurado',
        completion: 65,
        keyResults: [
          { id: 'kr14', description: 'CRM activo con 20+ leads', currentValue: 12, targetValue: 20, unit: '', status: 'En curso' },
          { id: 'kr15', description: 'Follow-up system operativo', currentValue: 70, targetValue: 100, unit: '%', status: 'En curso' },
        ]
      }
    ],
    'Marketing': [
      {
        id: 'mkt1',
        title: 'Presencia digital activa',
        completion: 85,
        keyResults: [
          { id: 'kr16', description: '4 posts semanales en LinkedIn', currentValue: 2, targetValue: 4, unit: '', status: 'En curso' },
          { id: 'kr17', description: 'Landing page AutonomIA live', currentValue: 80, targetValue: 100, unit: '%', status: 'En curso' },
          { id: 'kr18', description: '500 visitas mensuales', currentValue: 210, targetValue: 500, unit: '', status: 'En riesgo' },
        ]
      },
      {
        id: 'mkt2',
        title: 'Generar 20 leads inbound/mes',
        completion: 35,
        keyResults: [
          { id: 'kr19', description: 'Leads generados este mes', currentValue: 7, targetValue: 20, unit: '', status: 'En riesgo' },
          { id: 'kr20', description: 'Email sequence activa', currentValue: 0, targetValue: 100, unit: '%', status: 'En riesgo' },
        ]
      }
    ]
  },
  revenue: {
    mrrActual: 800,
    mrrMeta: 2000,
    history: [
      { month: 'Oct', value: 200 },
      { month: 'Nov', value: 350 },
      { month: 'Dic', value: 400 },
      { month: 'Ene', value: 550 },
      { month: 'Feb', value: 700 },
      { month: 'Mar', value: 800 },
    ],
    byVenture: [
      { venture: 'RecepcionistaAI', amount: 600, percentage: 75 },
      { venture: 'BotFactory', amount: 200, percentage: 25 },
    ]
  },
  projects: [
    {
      id: 'p1', name: 'RecepcionistaAI — Onboarding clientes', venture: 'RecepcionistaAI',
      departments: ['Ventas', 'Desarrollo IA'], status: 'Activo', progress: 45,
      lastUpdated: 'hace 2 días', priority: 'Alta'
    },
    {
      id: 'p2', name: 'AutonomIA Suite — Documentación', venture: 'AutonomIA',
      departments: ['Desarrollo IA'], status: 'Activo', progress: 20,
      lastUpdated: 'hace 5 días', priority: 'Media'
    },
    {
      id: 'p3', name: 'ROMO OS — Portal de clientes', venture: 'ROMO OS',
      departments: ['Informática'], status: 'Activo', progress: 60,
      lastUpdated: 'hace 1 día', priority: 'Alta'
    },
    {
      id: 'p4', name: 'BotFactory — Pitch deck inversores', venture: 'BotFactory',
      departments: ['Marketing'], status: 'En pausa', progress: 30,
      lastUpdated: 'hace 2 semanas', priority: 'Media'
    },
    {
      id: 'p5', name: 'Landing AutonomIA', venture: 'AutonomIA',
      departments: ['Marketing'], status: 'Activo', progress: 80,
      lastUpdated: 'hace 3 horas', priority: 'Alta'
    }
  ]
};
