import { toChileDate } from './utils';

export type EventType = 
  'nutrition' | 'fitness' | 'learning' | 
  'custom' | 'reunion' | 'recordatorio' | 
  'meta_deadline' | 'examen' | 'cita' | 
  'viaje' | 'otro';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;        // YYYY-MM-DD Chile
  time?: string;       // HH:MM
  endTime?: string;
  allDay: boolean;
  visibility: 'personal' | 'shared';
  userColor?: string;  // Jose or Anto color
  userName?: string;
  typeColor: string;   // color by event type
  description?: string;
  location?: string;
  canDelete?: boolean;
  raw?: any;
}

export const EVENT_TYPE_CONFIG: Record<EventType, {
  color: string;
  bg: string;
  label: string;
  emoji: string;
}> = {
  nutrition:      { color: '#e67e22', bg: '#fef3e2', label: 'Comida',     emoji: '🥗' },
  fitness:        { color: '#c1603a', bg: '#fdf0e8', label: 'Entreno',    emoji: '💪' },
  learning:       { color: '#8b5cf6', bg: '#f3f0ff', label: 'Estudio',    emoji: '📚' },
  custom:         { color: '#2d1a0e', bg: '#f5f0ea', label: 'Evento',     emoji: '📌' },
  reunion:        { color: '#0891b2', bg: '#e0f7fa', label: 'Reunión',    emoji: '🤝' },
  recordatorio:   { color: '#d4849e', bg: '#fdf0f5', label: 'Recordatorio',emoji: '🔔' },
  meta_deadline:  { color: '#c1603a', bg: '#fff4f0', label: 'Meta',       emoji: '🎯' },
  examen:         { color: '#dc2626', bg: '#fff0f0', label: 'Examen',     emoji: '📝' },
  cita:           { color: '#059669', bg: '#f0fdf4', label: 'Cita',       emoji: '🏥' },
  viaje:          { color: '#7c3aed', bg: '#f5f0ff', label: 'Viaje',      emoji: '✈️' },
  otro:           { color: '#6b7280', bg: '#f9f9f9', label: 'Otro',       emoji: '📎' },
};

// Transform raw DB activity into CalendarEvents
export function transformActivityToEvents(
  activity: any,
  joseUser: any,
  antoUser: any
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  // Jose nutrition
  activity.jose.nutrition.forEach((log: any) => {
    events.push({
      id: `n-jose-${log.id}`,
      title: log.meal_name,
      type: 'nutrition',
      date: toChileDate(log.logged_at),
      time: new Date(log.logged_at).toLocaleTimeString('es-CL', {
        timeZone: 'America/Santiago',
        hour: '2-digit', minute: '2-digit'
      }),
      allDay: false,
      visibility: 'personal',
      userColor: joseUser?.color,
      userName: 'Jose',
      typeColor: EVENT_TYPE_CONFIG.nutrition.color,
      description: `${log.calories} kcal · ${log.meal_type}`,
      canDelete: false,
    });
  });

  // Anto nutrition
  activity.anto.nutrition.forEach((log: any) => {
    events.push({
      id: `n-anto-${log.id}`,
      title: log.meal_name,
      type: 'nutrition',
      date: toChileDate(log.logged_at),
      time: new Date(log.logged_at).toLocaleTimeString('es-CL', {
        timeZone: 'America/Santiago',
        hour: '2-digit', minute: '2-digit'
      }),
      allDay: false,
      visibility: 'personal',
      userColor: antoUser?.color,
      userName: 'Anto',
      typeColor: EVENT_TYPE_CONFIG.nutrition.color,
      description: `${log.calories} kcal · ${log.meal_type}`,
      canDelete: false,
    });
  });

  // Jose fitness
  activity.jose.fitness.forEach((log: any) => {
    if (log.notes?.startsWith('pasos:')) return;
    events.push({
      id: `f-jose-${log.id}`,
      title: log.workout_type,
      type: 'fitness',
      date: toChileDate(log.logged_at),
      allDay: false,
      visibility: 'personal',
      userColor: joseUser?.color,
      userName: 'Jose',
      typeColor: EVENT_TYPE_CONFIG.fitness.color,
      description: `${log.duration_min} min`,
      canDelete: false,
    });
  });

  // Anto fitness
  activity.anto.fitness.forEach((log: any) => {
    if (log.notes?.startsWith('pasos:')) return;
    events.push({
      id: `f-anto-${log.id}`,
      title: log.workout_type,
      type: 'fitness',
      date: toChileDate(log.logged_at),
      allDay: false,
      visibility: 'personal',
      userColor: antoUser?.color,
      userName: 'Anto',
      typeColor: EVENT_TYPE_CONFIG.fitness.color,
      description: `${log.duration_min} min`,
      canDelete: false,
    });
  });

  // Jose learning
  activity.jose.learning.forEach((log: any) => {
    events.push({
      id: `l-jose-${log.id}`,
      title: log.topic,
      type: 'learning',
      date: toChileDate(log.logged_at),
      allDay: false,
      visibility: 'personal',
      userColor: joseUser?.color,
      userName: 'Jose',
      typeColor: EVENT_TYPE_CONFIG.learning.color,
      description: `${Math.round(log.duration_min / 60 * 10) / 10}h`,
      canDelete: false,
    });
  });

  // Anto learning
  activity.anto.learning.forEach((log: any) => {
    events.push({
      id: `l-anto-${log.id}`,
      title: log.topic,
      type: 'learning',
      date: toChileDate(log.logged_at),
      allDay: false,
      visibility: 'personal',
      userColor: antoUser?.color,
      userName: 'Anto',
      typeColor: EVENT_TYPE_CONFIG.learning.color,
      description: `${Math.round(log.duration_min / 60 * 10) / 10}h`,
      canDelete: false,
    });
  });

  // Custom calendar events
  activity.events.forEach((event: any) => {
    const config = EVENT_TYPE_CONFIG[event.event_type as EventType] 
      || EVENT_TYPE_CONFIG.otro;
    events.push({
      id: event.id,
      title: event.title,
      type: event.event_type as EventType,
      date: event.start_date,
      time: event.start_time?.slice(0, 5),
      endTime: event.end_time?.slice(0, 5),
      allDay: event.all_day,
      visibility: event.visibility,
      typeColor: config.color,
      description: event.description,
      location: event.location,
      canDelete: true,
      raw: event,
    });
  });

  return events;
}

// Group events by date
export function groupEventsByDate(
  events: CalendarEvent[]
): Record<string, CalendarEvent[]> {
  return events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);
}

// Get week dates (Mon-Sun) for a given date
export function getWeekDates(date: Date): string[] {
  const d = new Date(date);
  const day = d.getDay();
  // Adjust to Monday: 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    return day.toLocaleDateString('en-CA', {
      timeZone: 'America/Santiago'
    });
  });
}

// Get all dates in a month
export function getMonthDates(year: number, month: number): {
  date: string;
  isCurrentMonth: boolean;
}[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Start from Monday of first week
  const startDay = new Date(firstDay);
  const startDow = startDay.getDay();
  // Adjust to Monday
  const dayAdjustment = startDow === 0 ? 6 : startDow - 1;
  startDay.setDate(startDay.getDate() - dayAdjustment);
  
  // End on Sunday of last week
  const endDay = new Date(lastDay);
  const endDow = endDay.getDay();
  if (endDow !== 0) {
    endDay.setDate(endDay.getDate() + (7 - endDow));
  }
  
  const dates = [];
  const current = new Date(startDay);
  
  // Use a safety counter to avoid infinite loops
  let safety = 0;
  while (current <= endDay && safety < 50) {
    dates.push({
      date: current.toLocaleDateString('en-CA'),
      isCurrentMonth: current.getMonth() === month,
    });
    current.setDate(current.getDate() + 1);
    safety++;
  }
  
  return dates;
}
