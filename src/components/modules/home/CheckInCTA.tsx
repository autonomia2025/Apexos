import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

export const CheckInCTA: React.FC = () => {
  return (
    <div id="checkin-cta-root" style={{ display: 'block', width: '100%', position: 'fixed', bottom: 0, left: '72px', right: 0, padding: '24px', pointerEvents: 'none', zIndex: 40, background: 'linear-gradient(to top, #fdf6f0, rgba(253,246,240,0.85), rgba(253,246,240,0))' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
        <GlassCard 
          style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderColor: 'rgba(193,96,58,0.35)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ color: '#2d1a0e', fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '20px', margin: 0 }}>Check-in Diario</h4>
            <p style={{ color: '#b08878', fontSize: '14px', margin: 0 }}>Registra el progreso de tu dia</p>
          </div>
          
          <motion.div 
            style={{ width: '40px', height: '40px', borderRadius: '999px', background: '#c1603a', color: '#fdf6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}
            animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(193,96,58,0)", "0 0 15px rgba(193,96,58,0.5)", "0 0 0px rgba(193,96,58,0)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={20} />
          </motion.div>
        </GlassCard>
      </div>
      <style>{`@media (max-width: 767px) { #checkin-cta-root { display: none !important; } }`}</style>
    </div>
  );
};
