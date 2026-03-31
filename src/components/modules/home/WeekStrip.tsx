import React from 'react';
import { useCouple } from '../../../hooks/useCouple';
import { GlassCard } from '../../ui/GlassCard';

export const WeekStrip: React.FC = () => {
  const { users } = useCouple();
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  // Mock completion data
  const completionData = {
    jose: ['complete', 'complete', 'partial', 'none', 'complete', 'none', 'none'],
    anto: ['complete', 'partial', 'none', 'complete', 'complete', 'none', 'none'],
  };

  const getPillColor = (status: string, userColor: string) => {
    switch (status) {
      case 'complete':
        return 'var(--gold-400)';
      case 'partial':
        return userColor;
      default:
        return 'transparent';
    }
  };

  return (
    <GlassCard className="p-4 md:p-6 mb-6">
      <h3 className="text-sm font-display font-semibold text-gold-300 mb-4 uppercase tracking-widest">
        Resumen Semanal
      </h3>
      
      <div className="flex flex-col gap-4">
        {(['jose', 'anto'] as const).map((userId) => {
          const profile = users[userId].user;
          const statusArray = completionData[userId];
          
          return (
            <div key={userId} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] border border-white/10"
                style={{ backgroundColor: `${profile.color}22`, color: profile.color }}
              >
                {profile.initials}
              </div>
              
              <div className="flex-1 flex justify-between">
                {days.map((day, index) => {
                  const status = statusArray[index];
                  const bgColor = getPillColor(status, profile.color);
                  const isNone = status === 'none';
                  
                  return (
                    <div 
                      key={index} 
                      className={`flex flex-col items-center gap-1 w-8 ${isNone ? 'opacity-50' : ''}`}
                    >
                      <span className="text-[10px] font-mono text-gray-400">{day}</span>
                      <div 
                        className="w-full h-2 rounded-full border border-white/10"
                        style={{ 
                          backgroundColor: bgColor,
                          boxShadow: !isNone ? `0 0 8px ${bgColor}66` : 'none'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
