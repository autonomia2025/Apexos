import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { UserData } from '../../../types';
import { Dumbbell, PersonStanding, Flame, Compass, HelpCircle } from 'lucide-react';

interface ActivityGridProps {
  user: UserData;
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({ user }) => {
  const { weeklyActivity, user: profile } = user;
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
        return <div className="w-4 h-4 rounded-full bg-navy-800 border border-white/20"></div>; // Empty circle for rest
      default:
        return <HelpCircle {...props} />;
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-sm font-display font-semibold text-gold-300 uppercase tracking-widest mb-6">
        Matriz Semanal
      </h3>
      
      <div className="flex justify-between items-center w-full">
        {days.map((day, index) => {
          const type = weeklyActivity[index];
          const isRest = type === 'Descanso';
          
          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-mono text-gray-500">{day}</span>
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isRest ? 'bg-transparent' : 'bg-white/5 border border-white/10'
                }`}
                style={{
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
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-mono text-gray-500 uppercase">
        <div className="flex items-center gap-1"><Dumbbell size={12}/> Fuerza</div>
        <div className="flex items-center gap-1"><Flame size={12}/> Cardio</div>
        <div className="flex items-center gap-1"><PersonStanding size={12}/> Movilidad</div>
      </div>
    </GlassCard>
  );
};
