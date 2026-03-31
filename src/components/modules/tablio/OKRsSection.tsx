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
      case 'Completado': return { background: 'rgba(74,222,128,0.2)', color: '#86efac', borderColor: 'rgba(74,222,128,0.3)' };
      case 'En riesgo': return { background: 'rgba(248,113,113,0.2)', color: '#fca5a5', borderColor: 'rgba(248,113,113,0.3)' };
      case 'En curso': return { background: 'rgba(250,204,21,0.2)', color: '#fde047', borderColor: 'rgba(250,204,21,0.3)' };
    }
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#fff', margin: '0 0 8px 0' }}>OKRs Trimestrales</h2>
      
      {/* Department Tabs */}
      <GlassCard className="no-scrollbar" style={{ padding: '6px', display: 'flex', overflowX: 'auto', borderColor: 'rgba(240,192,64,0.1)' }}>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveTab(dept)}
            style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', transition: 'color 0.2s ease', position: 'relative', flex: 1, color: activeTab === dept ? '#fff' : 'rgba(255,255,255,0.45)' }}
          >
            {activeTab === dept && (
              <motion.div
                layoutId="okrTabIndicator"
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '2px', background: '#f0c040', boxShadow: '0 0 8px #f0c040' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 10 }}>{dept}</span>
          </button>
        ))}
      </GlassCard>

      {/* OKR Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence mode="wait">
          <motion.div
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
             style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
             {okrs[activeTab].map((objective) => (
               <motion.div key={objective.id} whileTap={{ scale: 0.98 }}>
                 <GlassCard style={{ padding: '20px', borderColor: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
                   <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', background: 'rgba(240,192,64,0.05)', filter: 'blur(48px)', opacity: 0.6 }} />
                    
                    {/* Header OKR */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#fff', fontSize: '20px', width: '75%', lineHeight: 1.25, margin: 0 }}>
                        {objective.title}
                      </h3>
                      <div style={{ background: 'rgba(240,192,64,0.1)', border: '1px solid rgba(240,192,64,0.3)', padding: '4px 12px', borderRadius: '999px', color: '#f0c040', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', fontSize: '14px' }}>
                        {objective.completion}%
                      </div>
                    </div>

                    {/* Key Results */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {objective.keyResults.map((kr) => {
                        const progress = Math.min((kr.currentValue / kr.targetValue) * 100, 100);
                        
                        return (
                          <div key={kr.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '14px' }}>
                              <div style={{ flex: 1, paddingRight: '16px' }}>
                                <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500, margin: 0 }}>{kr.description}</p>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                                <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', border: '1px solid', ...getStatusColor(kr.status) }}>
                                  {kr.status}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.55)', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px' }}>
                                  {kr.currentValue} / {kr.targetValue} {kr.unit}
                                </span>
                              </div>
                            </div>
                            
                            <div style={{ width: '100%', height: '6px', background: 'rgba(8,15,35,0.9)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                style={{ height: '100%', borderRadius: '999px', background: '#f0c040', boxShadow: '0 0 10px rgba(240,192,64,0.5)' }}
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
