import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { EmptyState } from '../../ui/EmptyState';
import { WorkoutLog } from '../../../types';
import { Plus, Timer, Dumbbell } from 'lucide-react';

interface WorkoutLogListProps {
  logs: WorkoutLog[];
  color: string;
  onOpenAdd: () => void;
}

export const WorkoutLogList: React.FC<WorkoutLogListProps> = ({ logs, color, onOpenAdd }) => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '28px', lineHeight: 1, color: '#2d1a0e', letterSpacing: '0.01em', fontFamily: '"Outfit", sans-serif' }}>
          Historial de Entrenos
        </h3>
        
        <button 
          onClick={onOpenAdd}
          className="lux-add-btn"
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
                <GlassCard className="lux-item" style={{ padding: '16px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderColor: 'rgba(255,255,255,0.12)' }}>
                   <div 
                    style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', opacity: 0.6, backgroundColor: color }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px', marginLeft: '8px' }}>
                    <h4 style={{ color: '#2d1a0e', fontWeight: 600, fontSize: '20px', fontFamily: '"Outfit", sans-serif' }}>{log.type}</h4>
                    <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '12px', background: 'rgba(193,96,58,0.08)', border: '1px solid rgba(193,96,58,0.15)', padding: '2px 8px', borderRadius: '6px' }}>{log.date}</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '8px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7a4a36', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <Timer size={14} color="#c1603a" />
                        {log.duration} minutos
                      </div>
                     {log.notes && (
                       <div style={{ color: '#b08878', fontSize: '12px', fontStyle: 'italic' }}>
                          {log.notes}
                        </div>
                     )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState 
            icon={<Dumbbell size={32} />} 
            title="No hay entrenamientos recientes" 
            onAction={onOpenAdd} 
          />
        )}
      </div>
    </div>
  );
};
