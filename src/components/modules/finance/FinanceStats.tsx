import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { DonutChart } from '../../ui/DonutChart';
import { UserData } from '../../../types';
import { TrendingUp, TrendingDown, Tag } from 'lucide-react';

interface FinanceStatsProps {
  user: UserData;
}

export const FinanceStats: React.FC<FinanceStatsProps> = ({ user }) => {
  const { metrics, user: profile } = user;
  const { spent, budget, savingsRate, topCategory } = metrics.finance;

  // Compliance badge calculation
  const budgetCompliance = (spent / budget) * 100;
  let complianceColor = 'text-green-400 bg-green-400/10 border-green-400/30';
  if (budgetCompliance > 80) complianceColor = 'text-red-400 bg-red-400/10 border-red-400/30';
  else if (budgetCompliance > 50) complianceColor = 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-3">
             <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-white/10"
              style={{ backgroundColor: `${profile.color}22`, color: profile.color }}
            >
              {profile.initials}
            </div>
            <h2 className="text-xl font-display font-semibold text-white">
              Presupuesto
            </h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${complianceColor}`}>
            {budgetCompliance.toFixed(0)}% Utilizado
          </div>
        </div>
        
        <DonutChart 
          current={spent} 
          max={budget} 
          color={profile.color} 
          label="Gastado (Mensual)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
         <div className="bg-navy-800/80 rounded-xl p-4 border border-white/5 flex flex-col justify-center items-center">
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-1">Tasa Ahorro</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white font-display">{savingsRate}%</span>
              {savingsRate > 20 ? (
                <TrendingUp size={18} className="text-green-400" />
              ) : (
                <TrendingDown size={18} className="text-red-400" />
              )}
            </div>
         </div>
         
         <div className="bg-navy-800/80 rounded-xl p-4 border border-white/5 flex flex-col justify-center items-center">
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-1">Top Gasto</span>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mt-1">
               <Tag size={12} className="text-gold-300" />
               <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{topCategory.name} {topCategory.percentage}%</span>
             </div>
         </div>
      </div>
    </GlassCard>
  );
};
