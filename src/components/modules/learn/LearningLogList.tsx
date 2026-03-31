import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { EmptyState } from '../../ui/EmptyState';
import { LearningLog } from '../../../types';
import { Plus, Book, MonitorPlay, Mic, Code, FileText, MoreHorizontal } from 'lucide-react';

interface LearningLogListProps {
  logs: LearningLog[];
  color: string;
  onOpenAdd: () => void;
}

export const LearningLogList: React.FC<LearningLogListProps> = ({ logs, color, onOpenAdd }) => {
  const getIcon = (resource: string) => {
    switch (resource) {
      case 'Libro': return <Book size={16} />;
      case 'Curso': return <MonitorPlay size={16} />;
      case 'Podcast': return <Mic size={16} />;
      case 'Video': return <MonitorPlay size={16} />;
      case 'Práctica': return <Code size={16} />;
      default: return <MoreHorizontal size={16} />;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '28px', lineHeight: 1, color: '#fff', letterSpacing: '0.01em', fontFamily: '"Playfair Display", serif' }}>
          Historial de Estudio
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
                <GlassCard className="lux-item" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', overflow: 'hidden', borderColor: 'rgba(255,255,255,0.12)' }}>
                  <div 
                    style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', opacity: 0.6, backgroundColor: color }}
                  />
                  
                  <div 
                    style={{ width: '40px', height: '40px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', border: `1px solid ${color}40`, color }}
                  >
                    {getIcon(log.resource)}
                  </div>
                  
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '20px', fontFamily: '"Playfair Display", serif', lineHeight: 1.2 }}>{log.topic}</h4>
                     <span style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '10px', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{log.date} · {log.resource}</span>
                     {log.notes && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: '#6b7280', fontSize: '12px', fontStyle: 'italic', marginTop: '6px' }}>
                         <FileText size={12} style={{ marginTop: '3px', opacity: 0.6 }} />
                         {log.notes}
                       </div>
                     )}
                   </div>
                   
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '14px', color: '#f0c040', background: 'rgba(240,192,64,0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(240,192,64,0.2)' }}>
                      {log.duration}m
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState 
            icon={<Book size={32} />} 
            title="Nada registrado aún" 
            onAction={onOpenAdd} 
          />
        )}
      </div>
    </div>
  );
};
