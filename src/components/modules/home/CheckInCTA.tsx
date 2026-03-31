import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

export const CheckInCTA: React.FC = () => {
  return (
    <div id="checkin-cta-root" style={{ display: 'block', width: '100%', position: 'fixed', bottom: 0, left: '72px', right: 0, padding: '24px', pointerEvents: 'none', zIndex: 40, background: 'linear-gradient(to top, rgba(6,13,31,1), rgba(6,13,31,0.8), rgba(6,13,31,0))' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
        <GlassCard 
          style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderColor: 'rgba(240,192,64,0.35)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ color: '#fff', fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px', margin: 0 }}>Check-in Diario</h4>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>Registra el progreso de tu dia</p>
          </div>
          
          <motion.div 
            style={{ width: '40px', height: '40px', borderRadius: '999px', background: '#f0c040', color: '#060d1f', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}
            animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(240,192,64,0)", "0 0 15px rgba(240,192,64,0.5)", "0 0 0px rgba(240,192,64,0)"] }}
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
