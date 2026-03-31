import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { Department, Objective, KeyResult } from '../../../types/tablio';

interface OKRsSectionProps {
  okrs: Record<Department, Objective[]>;
}

export const OKRsSection: React.FC<OKRsSectionProps> = ({ okrs }) => {
  const departments: Department[] = ['Informática', 'Desarrollo IA', 'Ventas', 'Marketing'];
  const [activeTab, setActiveTab] = useState<Department>('Ventas');

  const getStatusColor = (status: KeyResult['status']) => {
    switch (status) {
      case 'Completado': return 'bg-green-400/20 text-green-300 border-green-400/30';
      case 'En riesgo': return 'bg-red-400/20 text-red-300 border-red-400/30';
      case 'En curso': return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30';
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-display font-bold text-white mb-2">OKRs Trimestrales</h2>
      
      {/* Department Tabs */}
      <GlassCard className="p-1.5 flex overflow-x-auto no-scrollbar border-gold-400/10">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveTab(dept)}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors relative flex-1 ${
              activeTab === dept ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {activeTab === dept && (
              <motion.div
                layoutId="okrTabIndicator"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-400 shadow-[0_0_8px_var(--color-gold-400)]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{dept}</span>
          </button>
        ))}
      </GlassCard>

      {/* OKR Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
             className="space-y-4"
          >
             {okrs[activeTab].map((objective) => (
               <motion.div key={objective.id} whileTap={{ scale: 0.98 }}>
                 <GlassCard className="p-5 border-white/5 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   {/* Header OKR */}
                   <div className="flex justify-between items-start mb-6">
                     <h3 className="font-display font-bold text-white text-lg w-3/4 leading-tight">
                       {objective.title}
                     </h3>
                     <div className="bg-gold-400/10 border border-gold-400/30 px-3 py-1 rounded-full text-gold-400 font-bold font-mono text-sm">
                       {objective.completion}%
                     </div>
                   </div>

                   {/* Key Results */}
                   <div className="space-y-4">
                     {objective.keyResults.map((kr) => {
                       const progress = Math.min((kr.currentValue / kr.targetValue) * 100, 100);
                       
                       return (
                         <div key={kr.id} className="space-y-2">
                           <div className="flex justify-between items-start text-sm">
                             <div className="flex-1 pr-4">
                               <p className="text-gray-400 font-medium">{kr.description}</p>
                             </div>
                             <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                               <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getStatusColor(kr.status)}`}>
                                 {kr.status}
                               </span>
                               <span className="text-gray-400 font-mono text-xs">
                                 {kr.currentValue} / {kr.targetValue} {kr.unit}
                               </span>
                             </div>
                           </div>
                           
                           <div className="w-full h-1.5 bg-navy-800 rounded-full overflow-hidden border border-white/5">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${progress}%` }}
                               transition={{ duration: 1, ease: 'easeOut' }}
                               className="h-full rounded-full bg-gold-400 shadow-[0_0_10px_rgba(240,192,64,0.5)]"
                             />
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </GlassCard>
               </motion.div>
             ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
