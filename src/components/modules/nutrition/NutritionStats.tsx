import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { DonutChart } from '../../ui/DonutChart';
import { ProgressBar } from '../../ui/ProgressBar';
import { UserData } from '../../../types';

interface NutritionStatsProps {
  user: UserData;
}

export const NutritionStats: React.FC<NutritionStatsProps> = ({ user }) => {
  const { metrics, user: profile } = user;

  return (
    <GlassCard className="p-6 md:p-7">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 w-full mb-4 pb-4 border-b border-white/10">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-white/10"
            style={{ backgroundColor: `${profile.color}22`, color: profile.color }}
          >
            {profile.initials}
          </div>
          <div>
            <h2 className="text-[34px] leading-none font-display font-semibold text-white">Resumen de Hoy</h2>
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mt-1">Nutricion diaria</p>
          </div>
        </div>
        
        <DonutChart 
          current={metrics.calories.consumed} 
          max={metrics.calories.target} 
          color={profile.color} 
          label="Kcal Consumidas"
        />
      </div>

      <div className="space-y-4 w-full">
        <h3 className="text-[34px] leading-none font-display font-semibold text-white">Desglose Macros</h3>
        <ProgressBar 
          label="Proteína" 
          current={metrics.macros.protein} 
          max={180} 
          color={profile.color} 
        />
        <ProgressBar 
          label="Carbos" 
          current={metrics.macros.carbs} 
          max={300} 
          color={profile.color} 
        />
        <ProgressBar 
          label="Grasas" 
          current={metrics.macros.fat} 
          max={100} 
          color={profile.color} 
        />
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center w-full">
          <span className="text-sm font-semibold text-gray-300">Cumplimiento Semanal</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-display text-gold-400">{metrics.compliance}%</span>
            <span className="text-lg">🔥</span>
          </div>
      </div>
    </GlassCard>
  );
};
