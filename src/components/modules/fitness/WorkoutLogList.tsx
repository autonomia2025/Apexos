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
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-display font-semibold text-gold-300 uppercase tracking-widest">
          Historial de Entrenos
        </h3>
        
        <button 
          onClick={onOpenAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-400 text-navy-900 font-bold text-xs hover:bg-gold-300 transition-colors shadow-lg active:scale-95"
          style={{ boxShadow: `0 0 10px rgba(240,192,64,0.3)` }}
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
                <GlassCard className="p-4 flex flex-col hover:bg-white/5 transition-colors relative overflow-hidden group">
                   <div 
                    className="absolute left-0 top-0 w-1 h-full opacity-60 transition-opacity group-hover:opacity-100" 
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex justify-between items-center w-full mb-3 ml-2">
                    <h4 className="text-white font-medium text-base">{log.type}</h4>
                    <span className="text-gray-500 font-mono text-xs">{log.date}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-2">
                     <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                       <Timer size={14} className="text-gold-300" />
                       {log.duration} minutos
                     </div>
                     {log.notes && (
                       <div className="text-gray-500 text-xs italic">
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
