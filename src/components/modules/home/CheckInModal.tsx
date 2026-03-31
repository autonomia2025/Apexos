import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Target, Droplets, CheckCircle } from 'lucide-react';
import { useActiveUser } from '../../../hooks/useActiveUser';
import { GlassCard } from '../../ui/GlassCard';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const activeUserData = useActiveUser();
  const profile = activeUserData.user;
  
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [water, setWater] = useState<number>(0);
  const [goalMet, setGoalMet] = useState<boolean | null>(null);

  const moods = [
    { value: 1, emoji: '😫' },
    { value: 2, emoji: '🙁' },
    { value: 3, emoji: '😐' },
    { value: 4, emoji: '🙂' },
    { value: 5, emoji: '🔥' },
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  
  const handleClose = () => {
    setStep(1);
    setMood(null);
    setWeight('');
    setWater(0);
    setGoalMet(null);
    onClose();
  };

  const getAiMessage = () => {
    if (mood && mood >= 4 && goalMet) {
      return `¡Increíble día, ${profile.name}! Cumpliste tu objetivo y tu energía está a tope. Racha aumentada en +1 🔥.`;
    } else if (mood && mood <= 2) {
      return `Día difícil hoy, ${profile.name}. Recuerda que el descanso también es parte del proceso. Mañana será mejor.`;
    }
    return `Buen trabajo haciendo check-in, ${profile.name}. Mantener el registro es clave para la consistencia.`;
  };

  // Prevent scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(45,26,14,0.4)', backdropFilter: 'blur(4px)' }}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 230 }}
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '500px' }}
          >
            {/* Drag Handle (Mobile) */}
            <div className="modal-handle" />
            <button
              onClick={handleClose}
              style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(193,96,58,0.1)', border: '1px solid rgba(193,96,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c1603a' }}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <header style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    style={{ width: '8px', height: '8px', borderRadius: '999px', transition: 'background-color 0.3s ease',
                      backgroundColor: i === step ? profile.color : i < step ? 'var(--gold-400)' : 'rgba(255,255,255,0.2)' 
                    }}
                  />
                ))}
              </div>
            </header>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', position: 'relative' }}>
              
              {/* --- STEP 1: MOOD --- */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                     key="step1"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                   >
                    <h2 style={{ fontSize: '30px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, textAlign: 'center', marginBottom: '40px', color: '#2d1a0e' }}>
                      ¿Cómo te sentís hoy, {profile.name}?
                    </h2>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
                      {moods.map((m) => (
                        <motion.button
                          key={m.value}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setMood(m.value); setTimeout(handleNext, 300); }}
                          style={{
                            fontSize: '44px',
                            transition: 'all 0.3s ease',
                            transform: mood === m.value ? 'scale(1.25)' : mood ? 'scale(0.9)' : 'scale(1)',
                            opacity: mood && mood !== m.value ? 0.3 : 1,
                            filter: mood === m.value ? `saturate(1.5) drop-shadow(0 0 15px ${profile.color}66)` : mood ? 'grayscale(1)' : 'none'
                          }}
                        >
                          {m.emoji}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* --- STEP 2: QUICK STATS --- */}
                {step === 2 && (
                  <motion.div
                     key="step2"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                   >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 600, color: '#d4724a' }}>Peso de hoy (kg)</label>
                      <input 
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Ej. 75.4"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(193,96,58,0.15)', borderRadius: '12px', padding: '12px 16px', color: '#2d1a0e', fontFamily: '"Outfit", sans-serif', fontSize: '18px', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 600, color: '#d4724a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Droplets size={16} color="#c1603a" /> Agua (vasos)
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.92)', borderRadius: '12px', border: '1px solid rgba(193,96,58,0.15)', overflow: 'hidden' }}>
                         <button 
                           onClick={() => setWater(Math.max(0, water - 1))}
                           style={{ padding: '16px 24px', background: 'rgba(193,96,58,0.08)', color: '#2d1a0e', fontSize: '22px' }}
                         >-</button>
                         <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: '28px', fontWeight: 700 }}>{water}</span>
                         <button 
                           onClick={() => setWater(water + 1)}
                           style={{ padding: '16px 24px', background: 'rgba(193,96,58,0.08)', color: '#2d1a0e', fontSize: '22px' }}
                         >+</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 600, color: '#d4724a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Target size={16} color="#c94040" /> ¿Cumpliste tu objetivo principal hoy?
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                         <button
                           onClick={() => setGoalMet(true)}
                           style={{ padding: '12px 0', borderRadius: '12px', border: `1px solid ${goalMet === true ? '#c1603a' : 'rgba(193,96,58,0.15)'}`, fontWeight: 700, transition: 'all 0.2s ease', background: goalMet === true ? 'rgba(193,96,58,0.2)' : 'rgba(255,255,255,0.92)', color: goalMet === true ? '#d4724a' : '#7a4a36' }}
                         >
                           Sí
                         </button>
                         <button
                           onClick={() => setGoalMet(false)}
                           style={{ padding: '12px 0', borderRadius: '12px', border: `1px solid ${goalMet === false ? '#c94040' : 'rgba(193,96,58,0.15)'}`, fontWeight: 700, transition: 'all 0.2s ease', background: goalMet === false ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.92)', color: goalMet === false ? '#fca5a5' : '#7a4a36' }}
                         >
                           No
                         </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* --- STEP 3: AI SUMMARY --- */}
                {step === 3 && (
                  <motion.div
                     key="step3"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '32px' }}
                   >
                     <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                        style={{ width: '80px', height: '80px', borderRadius: '999px', background: 'rgba(193,96,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #c1603a', boxShadow: '0 0 30px rgba(193,96,58,0.3)' }}
                     >
                       <CheckCircle size={40} color="#c1603a" />
                     </motion.div>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                       <h3 style={{ fontSize: '30px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', margin: 0 }}>¡Check-in Completo!</h3>
                        <GlassCard style={{ padding: '16px', background: '#fff8f4', borderColor: 'rgba(193,96,58,0.3)' }}>
                         <p style={{ color: '#7a4a36', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                           "{getAiMessage()}"
                         </p>
                       </GlassCard>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

             {/* Footer Actions */}
             <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              {step > 1 && step < 3 && (
                 <button 
                  onClick={handleBack}
                  style={{ padding: '12px 16px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#b08878', background: 'transparent' }}
                 >
                   <ArrowLeft size={18} /> Atrás
                 </button>
              )}
              
              <div style={{ flex: 1 }} />

              {step === 2 && (
                <button 
                  onClick={handleNext}
                  style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', background: '#c1603a', color: '#fdf6f0', boxShadow: '0 10px 24px rgba(180, 100, 60, 0.08)' }}
                >
                  Siguiente <ArrowRight size={18} />
                </button>
              )}

              {step === 3 && (
                <button 
                  onClick={handleClose}
                  style={{ width: '100%', padding: '16px 24px', borderRadius: '12px', fontWeight: 700, textAlign: 'center', background: '#c1603a', color: '#fdf6f0', boxShadow: '0 10px 24px rgba(193,96,58,0.2)' }}
                >
                  Cerrar
                </button>
              )}
            </div>
            
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
