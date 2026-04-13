import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { EmptyState } from '../../ui/EmptyState';
import { Plus, Dumbbell, Trash2 } from 'lucide-react';

interface WorkoutLogListProps {
  logs: any[];
  color: string;
  onOpenAdd: () => void;
  onDelete: (id: string) => void;
}

export const WorkoutLogList: React.FC<WorkoutLogListProps> = ({ logs, color, onOpenAdd, onDelete }) => {
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
                  <div style={{ flex: 1, marginLeft: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '100px',
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                        color: color, fontSize: '12px', fontWeight: 700,
                      }}>
                        {log.type}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#b08878' }}>
                          {log.date}
                        </span>
                        <button
                          onClick={() => onDelete(log.id)}
                          style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            padding: '4px', color: 'rgba(193,96,58,0.4)',
                            display: 'flex', alignItems: 'center', transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#c94040')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(193,96,58,0.4)')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {log.duration > 0 && (
                      <p style={{ fontSize: '13px', color: '#7a4a36', margin: '4px 0' }}>
                        {log.duration} minutos
                      </p>
                    )}
                    {log.notes && !log.notes.startsWith('pasos:') && (
                      <p style={{ fontSize: '12px', color: '#b08878', margin: 0,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {log.notes}
                      </p>
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
