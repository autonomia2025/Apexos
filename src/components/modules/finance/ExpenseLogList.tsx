import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { EmptyState } from '../../ui/EmptyState';
import { ExpenseLog } from '../../../types';
import { Plus, Coffee, Bus, HeartPulse, Gamepad2, Shirt, MoreHorizontal, Wallet } from 'lucide-react';

interface ExpenseLogListProps {
  logs: ExpenseLog[];
  color: string;
  onOpenAdd: () => void;
}

export const ExpenseLogList: React.FC<ExpenseLogListProps> = ({ logs, color, onOpenAdd }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Comida': return <Coffee size={16} />;
      case 'Transporte': return <Bus size={16} />;
      case 'Salud': return <HeartPulse size={16} />;
      case 'Ocio': return <Gamepad2 size={16} />;
      case 'Ropa': return <Shirt size={16} />;
      default: return <MoreHorizontal size={16} />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-display font-semibold text-gold-300 uppercase tracking-widest">
          Historial Financiero
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
                <GlassCard className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors relative overflow-hidden group">
                  <div 
                    className="absolute left-0 top-0 w-1 h-full opacity-60 transition-opacity group-hover:opacity-100" 
                    style={{ backgroundColor: color }}
                  />
                  
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-navy-800 border"
                    style={{ borderColor: `${color}40`, color: color }}
                  >
                    {getIcon(log.category)}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-white font-medium text-sm sm:text-base leading-snug">{log.description}</h4>
                    <span className="text-gray-500 font-mono text-[10px] mt-0.5">{log.date}</span>
                  </div>
                  
                  <div className="text-right">
                    <span className={`font-mono font-bold text-sm sm:text-base ${log.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {log.amount < 0 ? '-' : '+'}${Math.abs(log.amount).toFixed(2)}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState 
            icon={<Wallet size={32} />} 
            title="Nada registrado aún" 
            onAction={onOpenAdd} 
          />
        )}
      </div>
    </div>
  );
};
