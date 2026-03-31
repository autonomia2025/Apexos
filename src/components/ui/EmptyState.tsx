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
    <GlassCard className={`p-8 flex flex-col items-center justify-center text-center border-dashed border-white/10 group ${className}`}>
       <div className="mb-4 text-gold-400/50 group-hover:text-gold-400/70 transition-colors duration-300">
         {icon}
       </div>
       <h3 className="text-lg font-display font-medium text-gray-400 mb-2">{title}</h3>
       
       {onAction && (
         <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={onAction}
           className="text-sm font-bold text-gold-400 hover:text-gold-300 tracking-wide uppercase transition-colors"
         >
           {subtitle}
         </motion.button>
       )}
    </GlassCard>
  );
};
