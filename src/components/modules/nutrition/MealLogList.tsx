import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { EmptyState } from '../../ui/EmptyState';
import { MealLog } from '../../../types';
import { Plus, Coffee } from 'lucide-react';

interface MealLogListProps {
  logs: MealLog[];
  color: string;
  onOpenAdd: () => void;
}

export const MealLogList: React.FC<MealLogListProps> = ({ logs, color, onOpenAdd }) => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '28px', lineHeight: 1, color: '#2d1a0e', letterSpacing: '0.01em', fontFamily: '"Outfit", sans-serif' }}>
          Historial de Hoy
        </h3>
        
        <button
          onClick={onOpenAdd}
          className="lux-add-btn"
          style={{ transform: 'scale(1)' }}
        >
          <Plus size={14} /> Registrar
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {logs.length > 0 ? (
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ width: '100%' }}
              >
                <GlassCard className="lux-item" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', position: 'relative', overflow: 'hidden', borderColor: 'rgba(255,255,255,0.12)' }}>
                  <div 
                    style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', opacity: 0.6, backgroundColor: color }}
                  />
                  
                  <div style={{ flex: 1, marginLeft: '8px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '4px' }}>
                      <h4 style={{ color: '#2d1a0e', fontWeight: 600, fontSize: '20px', fontFamily: '"Outfit", sans-serif' }}>{log.name}</h4>
                      <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '12px', background: 'rgba(193,96,58,0.08)', border: '1px solid rgba(193,96,58,0.15)', padding: '2px 8px', borderRadius: '6px' }}>{log.time}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                       <span 
                        style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', backgroundColor: `${color}22`, color: color }}
                       >
                         {log.calories} KCAL
                       </span>
                        <span style={{ fontSize: '11px', color: '#b08878', fontWeight: 600 }}>
                          P: <span style={{ color: '#7a4a36' }}>{log.macros?.protein ?? 0}g</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#b08878', fontWeight: 600 }}>
                          C: <span style={{ color: '#7a4a36' }}>{log.macros?.carbs ?? 0}g</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#b08878', fontWeight: 600 }}>
                          G: <span style={{ color: '#7a4a36' }}>{log.macros?.fat ?? 0}g</span>
                        </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState 
            icon={<Coffee size={32} />} 
            title="Nada registrado aún" 
            onAction={onOpenAdd} 
          />
        )}
      </div>
    </div>
  );
};
