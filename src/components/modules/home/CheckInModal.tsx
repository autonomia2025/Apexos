import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const getAiMessage = () => {
    if (mood && mood >= 4 && goalMet) {
      return `¡Increíble día, ${profile.name}! Cumpliste tu objetivo y tu energía está a tope. Racha aumentada en +1 🔥.`;
    } else if (mood && mood <= 2) {
      return `Día difícil hoy, ${profile.name}. Recuerda que el descanso también es parte del proceso. Mañana será mejor.`;
    }
    return `Buen trabajo haciendo check-in, ${profile.name}. Mantener el registro es clave para la consistencia.`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(45, 26, 14, 0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 101,
              width: '92%',
              maxWidth: '440px',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e8d5c8',
              boxShadow: '0 24px 60px rgba(45,26,14,0.18)',
              padding: '28px 24px 24px',
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(193,96,58,0.08)',
                border: '1px solid rgba(193,96,58,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#c1603a',
              }}
            >
              <X size={15} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '999px',
                    transition: 'background-color 0.3s ease',
                    backgroundColor: i === step ? '#c1603a' : i < step ? profile.color : 'transparent',
                    border: i > step ? '1.5px solid #e8d5c8' : 'none',
                  }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <h2 style={{ fontSize: '26px', fontFamily: '"Outfit", sans-serif', fontWeight: 800, textAlign: 'center', marginBottom: '32px', color: '#2d1a0e' }}>
                    ¿Cómo te sentís hoy, {profile.name}?
                  </h2>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', width: '100%' }}>
                    {moods.map(m => (
                      <motion.button
                        key={m.value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setMood(m.value); setTimeout(handleNext, 300); }}
                        style={{
                          fontSize: '40px',
                          transition: 'all 0.3s ease',
                          transform: mood === m.value ? 'scale(1.25)' : mood ? 'scale(0.9)' : 'scale(1)',
                          opacity: mood && mood !== m.value ? 0.3 : 1,
                          filter: mood === m.value ? `saturate(1.5) drop-shadow(0 0 15px ${profile.color}66)` : mood ? 'grayscale(1)' : 'none',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {m.emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Peso de hoy (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="ej. 75.4"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #e8d5c8',
                        background: '#fdf6f0',
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#2d1a0e',
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = '#c1603a'}
                      onBlur={e => e.target.style.borderColor = '#e8d5c8'}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Droplets size={14} color="#c1603a" /> Agua (vasos)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fdf6f0', borderRadius: '12px', border: '1.5px solid #e8d5c8', padding: '4px' }}>
                      <button
                        onClick={() => setWater(Math.max(0, water - 1))}
                        style={{ padding: '12px 20px', background: 'rgba(193,96,58,0.08)', color: '#2d1a0e', fontSize: '20px', border: 'none', cursor: 'pointer', borderRadius: '10px' }}
                      >-</button>
                      <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: '24px', fontWeight: 700, color: '#2d1a0e' }}>{water}</span>
                      <button
                        onClick={() => setWater(water + 1)}
                        style={{ padding: '12px 20px', background: 'rgba(193,96,58,0.08)', color: '#2d1a0e', fontSize: '20px', border: 'none', cursor: 'pointer', borderRadius: '10px' }}
                      >+</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target size={14} color="#c1603a" /> ¿Cumpliste tu objetivo?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        onClick={() => setGoalMet(true)}
                        style={{
                          padding: '12px 0',
                          borderRadius: '12px',
                          border: `1.5px solid ${goalMet === true ? '#c1603a' : '#e8d5c8'}`,
                          fontWeight: 700,
                          transition: 'all 0.2s ease',
                          background: goalMet === true ? 'rgba(193,96,58,0.08)' : '#ffffff',
                          color: goalMet === true ? '#c1603a' : '#7a4a36',
                          cursor: 'pointer',
                        }}
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setGoalMet(false)}
                        style={{
                          padding: '12px 0',
                          borderRadius: '12px',
                          border: `1.5px solid ${goalMet === false ? '#c94040' : '#e8d5c8'}`,
                          fontWeight: 700,
                          transition: 'all 0.2s ease',
                          background: goalMet === false ? 'rgba(201,64,64,0.08)' : '#ffffff',
                          color: goalMet === false ? '#c94040' : '#7a4a36',
                          cursor: 'pointer',
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '8px' }}>
                    <button
                      onClick={handleBack}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#b08878',
                        background: 'transparent',
                        border: '1.5px solid #e8d5c8',
                        cursor: 'pointer',
                      }}
                    >
                      <ArrowLeft size={16} /> Atrás
                    </button>
                    <button
                      onClick={handleNext}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#c1603a',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Siguiente <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '999px',
                      background: 'rgba(193,96,58,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #c1603a',
                      boxShadow: '0 0 24px rgba(193,96,58,0.2)',
                    }}
                  >
                    <CheckCircle size={36} color="#c1603a" />
                  </motion.div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '24px', fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#2d1a0e', margin: 0 }}>
                      ¡Check-in Completo!
                    </h3>
                    <GlassCard style={{ padding: '16px', background: '#fff8f4', borderColor: 'rgba(193,96,58,0.3)', textAlign: 'left' }}>
                      <p style={{ color: '#7a4a36', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                        "{getAiMessage()}"
                      </p>
                    </GlassCard>
                  </div>

                  <button
                    onClick={handleClose}
                    className="btn-gold"
                    style={{ width: '100%' }}
                  >
                    Cerrar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
