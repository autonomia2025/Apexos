import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { TablioData, Department } from '../../../types/tablio';

interface HealthScoreProps {
  data: TablioData;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ data }) => {
  const getDotColor = (score: number) => {
    if (score >= 80) return 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]';
    if (score >= 60) return 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]';
    return 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]';
  };

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <GlassCard className="p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute inset-x-0 -top-24 h-48 bg-gold-400/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="relative z-10 w-40 h-40 md:w-48 md:h-48 mb-6 mt-2">
           {/* SVG Circle Ring */}
           <svg className="w-full h-full transform -rotate-90">
             <circle
               cx="50%"
               cy="50%"
               r="46%"
               fill="none"
               stroke="rgba(240, 192, 64, 0.1)"
               strokeWidth="8"
             />
             <motion.circle
               cx="50%"
               cy="50%"
               r="46%"
               fill="none"
               stroke="var(--color-gold-400)"
               strokeWidth="8"
               strokeLinecap="round"
               initial={{ strokeDasharray: "0 1000" }}
               animate={{ strokeDasharray: `${(data.healthScore / 100) * 289} 1000` }}
               transition={{ duration: 1.5, ease: 'easeOut' }}
             />
           </svg>
           
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="flex items-start gap-1">
               <span className="text-5xl md:text-7xl font-display font-bold text-gold-400 tracking-tighter" style={{ fontSize: '72px' }}>
                  {data.healthScore}
               </span>
               <div className="mt-2 text-green-400 flex flex-col items-center bg-green-400/10 px-1 py-0.5 rounded-md border border-green-400/20">
                  <ArrowUpRight size={16} strokeWidth={3} />
               </div>
             </div>
           </div>
        </div>

        <h3 className="text-sm font-body text-gray-400 font-medium tracking-wide relative z-10 mb-8 uppercase">
           Salud empresarial
        </h3>

        {/* Department Mini Scores */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
           {(Object.entries(data.departmentScores) as [Department, number][]).map(([dept, score]) => (
             <div key={dept} className="bg-navy-800/50 rounded-xl px-3 py-3 border border-white/5 flex flex-col items-center gap-2 relative">
                <div className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest text-center truncate w-full">
                  {dept}
                </div>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${getDotColor(score)}`} />
                   <span className="font-display text-white text-lg font-bold">{score}%</span>
                </div>
             </div>
           ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};
