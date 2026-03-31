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
    <div className="w-full">
      <div className="lux-list-header">
        <h3 className="lux-list-title">
          Historial de Estudio
        </h3>
        
        <button 
          onClick={onOpenAdd}
          className="lux-add-btn active:scale-95"
        >
          <Plus size={14} /> Registrar
        </button>
      </div>

      <div className="space-y-4">
        {logs.length > 0 ? (
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full"
              >
                <GlassCard className="lux-item p-4 flex items-center gap-4 transition-colors relative overflow-hidden group border-white/12">
                  <div 
                    className="absolute left-0 top-0 w-1 h-full opacity-60 transition-opacity group-hover:opacity-100" 
                    style={{ backgroundColor: color }}
                  />
                  
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-navy-800 border"
                    style={{ borderColor: `${color}40`, color: color }}
                  >
                    {getIcon(log.resource)}
                  </div>
                  
                   <div className="flex-1 flex flex-col justify-center">
                     <h4 className="text-white font-semibold text-lg sm:text-xl font-display leading-snug">{log.topic}</h4>
                     <span className="text-gray-400 font-mono text-[10px] mt-0.5 uppercase tracking-[0.1em]">{log.date} · {log.resource}</span>
                     {log.notes && (
                        <div className="flex items-start gap-1.5 text-gray-500 text-xs italic mt-1.5">
                         <FileText size={12} className="mt-[3px] opacity-60" />
                         {log.notes}
                       </div>
                    )}
                  </div>
                  
                  <div className="text-right flex items-center">
                    <span className="font-mono font-bold text-sm text-gold-300 bg-gold-400/10 px-2 py-1 rounded-md border border-gold-400/20">
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
