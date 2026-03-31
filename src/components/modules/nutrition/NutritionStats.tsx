import React from 'react';
import { motion } from 'framer-motion';
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
    <GlassCard className="p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 w-full mb-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-white/10"
            style={{ backgroundColor: `${profile.color}22`, color: profile.color }}
          >
            {profile.initials}
          </div>
          <h2 className="text-xl font-display font-semibold text-white">
            Resumen de Hoy
          </h2>
        </div>
        
        <DonutChart 
          current={metrics.calories.consumed} 
          max={metrics.calories.target} 
          color={profile.color} 
          label="Kcal Consumidas"
        />
      </div>

      <div className="space-y-4 w-full">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Desglose Macros</h3>
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
          <span className="text-sm font-medium text-gray-400">Cumplimiento Semanal</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-display text-gold-400">{metrics.compliance}%</span>
            <span className="text-lg">🔥</span>
          </div>
      </div>
    </GlassCard>
  );
};
