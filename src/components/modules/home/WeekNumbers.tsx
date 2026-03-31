import React from 'react';
import { useCouple } from '../../../hooks/useCouple';
import { GlassCard } from '../../ui/GlassCard';

export const WeekNumbers: React.FC = () => {
  const { users } = useCouple();

  return (
    <GlassCard className="p-4 md:p-6 mb-6">
      <h3 className="text-sm font-display font-semibold text-gold-300 mb-4 uppercase tracking-widest">
        Semana en números
      </h3>
      
      <div className="flex gap-4 divide-x divide-white/10">
        {(['jose', 'anto'] as const).map((userId) => {
          const user = users[userId];
          const profile = user.user;
          const m = user.metrics;
          
          return (
            <div key={userId} className={`flex-1 flex flex-col items-center gap-3 ${userId === 'anto' ? 'pl-4' : ''}`}>
              <div 
                 className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border"
                 style={{ 
                   color: profile.color, 
                   backgroundColor: `${profile.color}11`,
                   borderColor: `${profile.color}33`
                 }}
              >
                 {profile.name}
              </div>

              <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Total Calorías</span>
                  <span className="font-mono font-bold" style={{ color: profile.color }}>
                    {(m.calories.consumed * 7).toLocaleString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Total Entrenos</span>
                  <span className="font-mono font-bold" style={{ color: profile.color }}>
                    {m.trainingDays}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Hrs Estudio</span>
                  <span className="font-mono font-bold" style={{ color: profile.color }}>
                    {m.studyHours}h
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Ahorro Semana</span>
                  <span className="font-mono font-bold" style={{ color: profile.color }}>
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
