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
    <GlassCard style={{ padding: '24px', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '14px', fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#d4724a', marginBottom: '16px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        Resumen Semanal
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {(['jose', 'anto'] as const).map((userId) => {
          const profile = users[userId].user;
          const statusArray = completionData[userId];
          
          return (
            <div key={userId} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{ width: '32px', height: '32px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px', border: '1px solid rgba(193,96,58,0.15)', backgroundColor: `${profile.color}22`, color: profile.color }}
              >
                {profile.initials}
              </div>
              
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                {days.map((day, index) => {
                  const status = statusArray[index];
                  const bgColor = getPillColor(status, profile.color);
                  const isNone = status === 'none';
                  
                  return (
                    <div 
                      key={index} 
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '32px', opacity: isNone ? 0.5 : 1 }}
                    >
                      <span style={{ fontSize: '10px', fontFamily: '"Outfit", sans-serif', color: '#b08878' }}>{day}</span>
                      <div 
                        style={{ 
                          width: '100%',
                          height: '8px',
                          borderRadius: '999px',
                          border: '1px solid rgba(193,96,58,0.15)',
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
