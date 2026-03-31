import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { RevenueData } from '../../../types/tablio';

interface RevenueDashboardProps {
  data: RevenueData;
}

export const RevenueDashboard: React.FC<RevenueDashboardProps> = ({ data }) => {
  const progress = Math.min((data.mrrActual / data.mrrMeta) * 100, 100);
  const maxRevenue = Math.max(...data.history.map(d => d.value));

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-display font-bold text-white mb-2">Ingresos (MRR)</h2>
      
      <GlassCard className="p-6 md:p-8 space-y-8 border-gold-400/20">
        
        {/* Top 3 Pills */}
        <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h3 className="text-sm font-body text-gray-400 uppercase tracking-widest font-bold text-[10px]">MRR Actual</h3>
            <p className="text-3xl md:text-4xl font-display font-bold text-gold-400 font-mono tracking-tighter">
              ${data.mrrActual.toLocaleString()} USD
            </p>
          </div>
          
          <div className="space-y-1 text-right">
            <h3 className="text-sm font-body text-gray-400 uppercase tracking-widest font-bold text-[10px]">Meta MRR</h3>
            <p className="text-xl font-display font-bold text-gray-300 font-mono">
              ${data.mrrMeta.toLocaleString()} USD
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
           <div className="flex justify-between items-center">
              <span className="text-sm font-body text-gray-400 uppercase tracking-widest font-bold text-[10px]">Progreso Hacia la Meta</span>
              <span className="text-gold-400 font-mono text-sm font-bold">{progress.toFixed(0)}%</span>
           </div>
           <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden border border-white/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 1.5, ease: 'easeOut' }}
               className="h-full rounded-full bg-gold-400 shadow-[0_0_10px_rgba(240,192,64,0.5)]"
             />
           </div>
        </div>

        {/* Chart (CSS-based responsive histogram) */}
        <div className="pt-4 h-48 w-full flex items-end justify-between gap-1 sm:gap-2">
           {data.history.map((pt, i) => {
             const height = (pt.value / maxRevenue) * 100;
             return (
               <div key={i} className="flex flex-col items-center justify-end w-full h-full group">
                 <div className="relative w-full mx-1 flex justify-center items-end h-full">
                    {/* Value Popover (hidden by default) */}
                    <div className="absolute -top-8 bg-navy-800 border border-gold-400/20 text-gold-400 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none font-mono">
                       ${pt.value}
                    </div>
                    
                    {/* Bar */}
                    <motion.div 
                      className="w-full max-w-[2.5rem] bg-gradient-to-t from-gold-400/10 to-gold-400 rounded-t-sm shadow-[0_0_10px_rgba(240,192,64,0.2)]"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                    />
                 </div>
                 <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider mt-2 group-hover:text-gold-400 transition-colors">
                   {pt.month}
                 </span>
               </div>
             )
           })}
        </div>

        {/* Revenue by Venture */}
        <div className="pt-6 border-t border-white/5 space-y-3">
          <h3 className="text-sm font-body text-gray-400 uppercase tracking-widest font-bold text-[10px] text-center w-full block">Distribuido por Producto</h3>
          <div className="flex flex-wrap gap-2 justify-center">
             {data.byVenture.map((v) => (
               <div 
                 key={v.venture} 
                 className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/5 text-xs font-bold"
               >
                 <span className="text-white">{v.venture}</span>
                 <span className="text-gold-400 font-mono">${v.amount}</span>
                 <span className="text-gray-500 font-mono">({v.percentage}%)</span>
               </div>
             ))}
          </div>
        </div>

      </GlassCard>
    </section>
  );
};
