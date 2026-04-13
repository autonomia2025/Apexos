import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Dumbbell, PersonStanding, Flame, Compass, HelpCircle } from 'lucide-react';
import { getTodayChile, toChileDate } from '../../../lib/utils';

interface ActivityGridProps {
  user: any;
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({ user }) => {
  const { user: profile, rawLogs = [] } = user;
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  // Build this week's activity from rawLogs
  const todayChile = getTodayChile();
  const now = new Date(todayChile);
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d.toLocaleDateString('en-CA')); // en-CA gives YYYY-MM-DD
  }

  // Map each day to the workout type (if any)
  const getWorkoutForDay = (dateISO: string): string => {
    const dayLogs = rawLogs.filter((l: any) =>
      toChileDate(l.logged_at) === dateISO &&
      !(l.notes || '').startsWith('pasos:')
    );
    if (dayLogs.length === 0) return 'Descanso';
    return dayLogs[0].workout_type || 'Fuerza';
  };

  const weeklyActivity = weekDates.map(getWorkoutForDay);

  const getIconForType = (type: string, color: string) => {
    const props = { size: 18, color: color };
    switch (type) {
      case 'Fuerza':
        return <Dumbbell {...props} />;
      case 'Cardio':
        return <Flame {...props} />;
      case 'Deporte':
        return <Compass {...props} />;
      case 'Movilidad':
        return <PersonStanding {...props} />;
      case 'Descanso':
        return <div style={{ width: '16px', height: '16px', borderRadius: '999px', background: 'rgba(193,96,58,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}></div>;
      default:
        return <HelpCircle {...props} />;
    }
  };

  return (
    <GlassCard style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '14px', fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#d4724a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '24px', marginTop: 0 }}>
        Matriz Semanal
      </h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {days.map((day, index) => {
          const type = weeklyActivity[index];
          const isRest = type === 'Descanso';
          const isFuture = weekDates[index] > todayChile;

          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '10px', fontFamily: '"Outfit", sans-serif', color: '#b08878' }}>{day}</span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                  opacity: isFuture ? 0.3 : 1,
                  background: isRest ? 'transparent' : 'rgba(193,96,58,0.08)',
                  border: isRest ? 'none' : '1px solid rgba(193,96,58,0.15)',
                  boxShadow: !isRest ? `0 0 10px ${profile.color}22` : 'none',
                  borderColor: !isRest ? `${profile.color}40` : undefined
                }}
              >
                {getIconForType(type, isRest ? 'var(--navy-800)' : profile.color)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '10px', fontFamily: '"Outfit", sans-serif', color: '#b08878', textTransform: 'uppercase' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Dumbbell size={12}/> Fuerza</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Flame size={12}/> Cardio</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><PersonStanding size={12}/> Movilidad</div>
      </div>
    </GlassCard>
  );
};
