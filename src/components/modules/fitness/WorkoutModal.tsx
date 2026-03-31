import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({ isOpen, onClose, color: _color }) => {
  const [duration, setDuration] = useState('');
  const [workoutType, setWorkoutType] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const types = ['Fuerza', 'Cardio', 'Deporte', 'Movilidad', 'Otro'];

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

  const handleClose = () => {
    setDuration('');
    setWorkoutType(null);
    setNote('');
    onClose();
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

            <h2 style={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              fontSize: '26px',
              color: '#2d1a0e',
              marginBottom: '4px',
              paddingRight: '40px',
            }}>
              Registrar entreno
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#b08878',
              marginBottom: '24px',
              fontWeight: 400,
            }}>
              ¿Qué hiciste hoy?
            </p>

            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#b08878',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
            }}>
              Tipo
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {types.map(opt => (
                <button
                  key={opt}
                  onClick={() => setWorkoutType(opt)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: `1.5px solid ${workoutType === opt ? '#c1603a' : '#e8d5c8'}`,
                    background: workoutType === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                    color: workoutType === opt ? '#c1603a' : '#7a4a36',
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '13px',
                    fontWeight: workoutType === opt ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#b08878',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
            }}>
              Minutos
            </p>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="ej. 60"
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
                marginBottom: '16px',
              }}
              onFocus={e => e.target.style.borderColor = '#c1603a'}
              onBlur={e => e.target.style.borderColor = '#e8d5c8'}
            />

            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#b08878',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
            }}>
              Notas (opcional)
            </p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="ej. Día de pecho y bíceps"
              rows={3}
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
                resize: 'none',
                marginBottom: '24px',
              }}
              onFocus={e => e.target.style.borderColor = '#c1603a'}
              onBlur={e => e.target.style.borderColor = '#e8d5c8'}
            />

            <button
              className="btn-gold"
              onClick={handleClose}
              disabled={!duration || !workoutType}
              style={{ opacity: !duration || !workoutType ? 0.45 : 1, cursor: !duration || !workoutType ? 'not-allowed' : 'pointer' }}
            >
              Guardar
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
