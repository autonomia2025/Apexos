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
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '28px', lineHeight: 1, color: '#2d1a0e', letterSpacing: '0.01em', fontFamily: '"Outfit", sans-serif' }}>
          Historial Financiero
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
                    style={{ width: '40px', height: '40px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: `1px solid ${color}40`, color }}
                  >
                    {getIcon(log.category)}
                  </div>
                  
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <h4 style={{ color: '#2d1a0e', fontWeight: 600, fontSize: '20px', fontFamily: '"Outfit", sans-serif', lineHeight: 1.2 }}>{log.description}</h4>
                     <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '10px', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{log.date}</span>
                   </div>
                   
                   <div style={{ textAlign: 'right' }}>
                     <span style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '14px', padding: '4px 8px', borderRadius: '6px', border: '1px solid', color: log.amount < 0 ? '#c94040' : '#4a9068', borderColor: log.amount < 0 ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)', background: log.amount < 0 ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)' }}>
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
