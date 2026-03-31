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
    <div className="w-full">
      <div className="lux-list-header">
        <h3 className="lux-list-title">
          Historial de Hoy
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
                <GlassCard className="lux-item p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors relative overflow-hidden group border-white/12">
                  <div 
                    className="absolute left-0 top-0 w-1 h-full opacity-60 transition-opacity group-hover:opacity-100" 
                    style={{ backgroundColor: color }}
                  />
                  
                  <div className="flex-1 ml-2">
                    <div className="flex justify-between items-center w-full mb-1">
                      <h4 className="text-white font-semibold text-xl font-display">{log.name}</h4>
                      <span className="text-gray-400 font-mono text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">{log.time}</span>
                    </div>
                    
                    <div className="flex gap-2 items-center flex-wrap mt-2">
                       <span 
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide"
                        style={{ backgroundColor: `${color}22`, color: color }}
                       >
                         {log.calories} KCAL
                       </span>
                        <span className="text-[11px] text-gray-500 font-semibold">
                          P: <span className="text-gray-300">{log.macros.protein}g</span>
                        </span>
                        <span className="text-[11px] text-gray-500 font-semibold">
                          C: <span className="text-gray-300">{log.macros.carbs}g</span>
                        </span>
                        <span className="text-[11px] text-gray-500 font-semibold">
                          G: <span className="text-gray-300">{log.macros.fat}g</span>
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
