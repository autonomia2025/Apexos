import React from 'react';
import { useCouple } from '../../../hooks/useCouple';
import { GlassCard } from '../../ui/GlassCard';

export const WeekNumbers: React.FC = () => {
  const { users } = useCouple();

  return (
    <GlassCard style={{ padding: '24px', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '14px', fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#d4724a', marginBottom: '16px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        Semana en números
      </h3>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        {(['jose', 'anto'] as const).map((userId) => {
          const user = users[userId];
          const profile = user.user;
          const m = user.metrics;
          
          return (
            <div key={userId} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', paddingLeft: userId === 'anto' ? '16px' : 0, borderLeft: userId === 'anto' ? '1px solid rgba(193,96,58,0.15)' : 'none' }}>
              <div 
                 style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(193,96,58,0.15)',
                   color: profile.color, 
                   backgroundColor: `${profile.color}11`,
                   borderColor: `${profile.color}33`
                 }}
              >
                 {profile.name}
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#b08878', fontWeight: 500 }}>Total Calorías</span>
                  <span style={{ color: profile.color, fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
                    {(m.calories.consumed * 7).toLocaleString('es-ES')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#b08878', fontWeight: 500 }}>Total Entrenos</span>
                  <span style={{ color: profile.color, fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
                    {m.trainingDays}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#b08878', fontWeight: 500 }}>Hrs Estudio</span>
                  <span style={{ color: profile.color, fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
                    {m.studyHours}h
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#b08878', fontWeight: 500 }}>Ahorro Semana</span>
                  <span style={{ color: profile.color, fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
                    {m.finance.savingsRate}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
