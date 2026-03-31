import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const MealModal: React.FC<MealModalProps> = ({ isOpen, onClose, color: _color }) => {
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState<string | null>(null);
  const [isShortScreen, setIsShortScreen] = useState(window.innerHeight < 700);

  const mealTypes = ['Desayuno', 'Almuerzo', 'Cena', 'Snack'];

  useEffect(() => {
    const handleResize = () => setIsShortScreen(window.innerHeight < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setMealName('');
    setCalories('');
    setMealType(null);
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
              top: isShortScreen ? '44%' : '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 101,
              width: '92%',
              maxWidth: '440px',
              maxHeight: '80vh',
              height: 'auto',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e8d5c8',
              boxShadow: '0 24px 60px rgba(45,26,14,0.18)',
              padding: '28px 24px 32px',
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
                zIndex: 1,
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
              Registrar comida
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#b08878',
              marginBottom: '24px',
              fontWeight: 400,
            }}>
              ¿Qué comiste?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#b08878',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}>
                  Nombre del alimento
                </p>
                <input
                  type="text"
                  value={mealName}
                  onChange={e => setMealName(e.target.value)}
                  placeholder="ej. Pollo con arroz"
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

              <div>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#b08878',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}>
                  Calorías estimadas
                </p>
                <input
                  type="number"
                  value={calories}
                  onChange={e => setCalories(e.target.value)}
                  placeholder="ej. 450"
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

              <div>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#b08878',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}>
                  Tipo de comida
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {mealTypes.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setMealType(opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: `1.5px solid ${mealType === opt ? '#c1603a' : '#e8d5c8'}`,
                        background: mealType === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                        color: mealType === opt ? '#c1603a' : '#7a4a36',
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '13px',
                        fontWeight: mealType === opt ? 700 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              position: 'sticky',
              bottom: 0,
              background: '#ffffff',
              paddingTop: '12px',
              paddingBottom: '4px',
              marginTop: '16px',
            }}>
              <button
                className="btn-gold"
                onClick={handleClose}
                disabled={!mealName || !mealType}
                style={{ opacity: !mealName || !mealType ? 0.45 : 1, cursor: !mealName || !mealType ? 'not-allowed' : 'pointer' }}
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
