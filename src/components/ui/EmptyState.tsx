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
  icon = <HelpCircle size={40} style={{ color: 'rgba(193,96,58,0.5)' }} />, 
  title = "Nada por acá todavía", 
  subtitle = "Empezá a registrar hoy →",
  onAction,
  className = ""
}) => {
  return (
    <GlassCard className={className} style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.02)' }}>
       <div style={{ marginBottom: '16px', width: '56px', height: '56px', borderRadius: '16px', border: '1px solid rgba(193,96,58,0.2)', background: 'rgba(193,96,58,0.1)', color: 'rgba(193,96,58,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         {icon}
       </div>
       <h3 style={{ fontSize: '20px', fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#2d1a0e', marginBottom: '4px' }}>{title}</h3>
       <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b08878', marginBottom: '12px' }}>Sin registros por ahora</p>
        
       {onAction && (
          <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={onAction}
             style={{ fontSize: '12px', fontWeight: 700, color: '#c1603a', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'transparent', border: 'none', cursor: 'pointer' }}
           >
             {subtitle}
           </motion.button>
        )}
    </GlassCard>
  );
};
