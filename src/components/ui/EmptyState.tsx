import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = <HelpCircle size={40} className="text-gold-400/50" />, 
  title = "Nada por acá todavía", 
  subtitle = "Empezá a registrar hoy →",
  onAction,
  className = ""
}) => {
  return (
    <GlassCard className={`p-8 flex flex-col items-center justify-center text-center border-dashed border-white/20 bg-white/[0.02] group ${className}`}>
       <div className="mb-4 w-14 h-14 rounded-2xl border border-gold-400/20 bg-gold-400/10 text-gold-400/70 group-hover:text-gold-300 transition-colors duration-300 flex items-center justify-center">
         {icon}
       </div>
       <h3 className="text-xl font-display font-semibold text-gray-200 mb-1">{title}</h3>
       <p className="text-xs uppercase tracking-[0.12em] text-gray-500 mb-3">Sin registros por ahora</p>
        
       {onAction && (
          <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={onAction}
            className="text-xs font-bold text-gold-300 hover:text-gold-200 tracking-[0.12em] uppercase transition-colors"
          >
            {subtitle}
          </motion.button>
        )}
    </GlassCard>
  );
};
