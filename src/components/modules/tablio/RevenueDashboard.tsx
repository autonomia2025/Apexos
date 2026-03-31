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
    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', margin: '0 0 8px 0' }}>Ingresos (MRR)</h2>
      
      <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', borderColor: 'rgba(193,96,58,0.2)' }}>
        
        {/* Top 3 Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(193,96,58,0.08)', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3 style={{ color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, fontSize: '10px', margin: 0 }}>MRR Actual</h3>
            <p style={{ margin: 0, fontSize: '40px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#c1603a', letterSpacing: '-0.02em' }}>
              ${data.mrrActual.toLocaleString()} USD
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
            <h3 style={{ color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, fontSize: '10px', margin: 0 }}>Meta MRR</h3>
            <p style={{ margin: 0, fontSize: '24px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
              ${data.mrrMeta.toLocaleString()} USD
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, fontSize: '10px' }}>Progreso Hacia la Meta</span>
              <span style={{ color: '#c1603a', fontFamily: '"Outfit", sans-serif', fontSize: '14px', fontWeight: 700 }}>{progress.toFixed(0)}%</span>
           </div>
           <div style={{ width: '100%', height: '8px', background: 'rgba(193,96,58,0.1)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(193,96,58,0.08)' }}>
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 1.5, ease: 'easeOut' }}
               style={{ height: '100%', borderRadius: '999px', background: '#c1603a', boxShadow: '0 0 10px rgba(193,96,58,0.5)' }}
             />
           </div>
        </div>

        {/* Chart (CSS-based responsive histogram) */}
        <div style={{ paddingTop: '16px', height: '192px', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
           {data.history.map((pt, i) => {
              const height = (pt.value / maxRevenue) * 100;
              return (
               <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: '100%' }}>
                 <div style={{ position: 'relative', width: '100%', margin: '0 4px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '100%' }}>
                    {/* Value Popover (hidden by default) */}
                    <div style={{ position: 'absolute', top: '-32px', background: '#fff8f4', border: '1px solid rgba(193,96,58,0.2)', color: '#c1603a', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', zIndex: 10, pointerEvents: 'none', fontFamily: '"Outfit", sans-serif' }}>
                       ${pt.value}
                    </div>
                    
                    {/* Bar */}
                    <motion.div 
                      style={{ width: '100%', maxWidth: '2.5rem', background: 'linear-gradient(to top, rgba(193,96,58,0.1), #c1603a)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', boxShadow: '0 0 10px rgba(193,96,58,0.2)' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                    />
                 </div>
                 <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '8px' }}>
                   {pt.month}
                 </span>
               </div>
             )
           })}
        </div>

        {/* Revenue by Venture */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(193,96,58,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, fontSize: '10px', textAlign: 'center', width: '100%', display: 'block', margin: 0 }}>Distribuido por Producto</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
             {data.byVenture.map((v) => (
               <div 
                 key={v.venture} 
                 style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', border: '1px solid rgba(193,96,58,0.3)', background: 'rgba(193,96,58,0.05)', fontSize: '12px', fontWeight: 700 }}
               >
                 <span style={{ color: '#2d1a0e' }}>{v.venture}</span>
                 <span style={{ color: '#c1603a', fontFamily: '"Outfit", sans-serif' }}>${v.amount}</span>
                 <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif' }}>({v.percentage}%)</span>
               </div>
             ))}
          </div>
        </div>

      </GlassCard>
    </section>
  );
};
