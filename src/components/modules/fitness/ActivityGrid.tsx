import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { UserData } from '../../../types';
import { Dumbbell, PersonStanding, Flame, Compass, HelpCircle } from 'lucide-react';

interface ActivityGridProps {
  user: UserData;
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({ user }) => {
  const { weeklyActivity = [], user: profile } = user;
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

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
        return <div style={{ width: '16px', height: '16px', borderRadius: '999px', background: 'rgba(193,96,58,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}></div>; // Empty circle for rest
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
