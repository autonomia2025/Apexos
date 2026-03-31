import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { TablioData, Department } from '../../../types/tablio';

interface HealthScoreProps {
  data: TablioData;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ data }) => {
  const getDotColor = (score: number) => {
    if (score >= 80) return { background: '#4a9068', boxShadow: '0 0 8px rgba(74,222,128,0.5)' };
    if (score >= 60) return { background: '#d4922a', boxShadow: '0 0 8px rgba(250,204,21,0.5)' };
    return { background: '#c94040', boxShadow: '0 0 8px rgba(248,113,113,0.5)' };
  };

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '-96px', height: '192px', background: 'rgba(193,96,58,0.05)', filter: 'blur(48px)', opacity: 0.5, pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', zIndex: 10, width: '192px', height: '192px', marginBottom: '24px', marginTop: '8px' }}>
           {/* SVG Circle Ring */}
           <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
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
           
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ fontSize: '72px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#c1603a', letterSpacing: '-0.03em' }}>
                   {data.healthScore}
                </span>
                <div style={{ marginTop: '8px', color: '#4a9068', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(74,222,128,0.1)', padding: '2px 4px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.2)' }}>
                   <ArrowUpRight size={16} strokeWidth={3} />
                </div>
              </div>
            </div>
         </div>

        <h3 style={{ fontSize: '14px', color: '#b08878', fontWeight: 500, letterSpacing: '0.03em', position: 'relative', zIndex: 10, marginBottom: '32px', textTransform: 'uppercase', marginTop: 0 }}>
           Salud empresarial
        </h3>

        {/* Department Mini Scores */}
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', position: 'relative', zIndex: 10 }}>
           {(Object.entries(data.departmentScores) as [Department, number][]).map(([dept, score]) => (
             <div key={dept} style={{ background: '#ffffff', borderRadius: '12px', padding: '12px', border: '1px solid #e8d5c8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}>
                <div style={{ fontSize: '12px', color: '#b08878', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {dept}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '999px', ...getDotColor(score) }} />
                   <span style={{ fontFamily: '"Outfit", sans-serif', color: '#2d1a0e', fontSize: '18px', fontWeight: 700 }}>{score}%</span>
                </div>
             </div>
           ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};
