import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ExpenseCategory } from '../../../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, color: _color }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [note, setNote] = useState('');
  const [isShortScreen, setIsShortScreen] = useState(window.innerHeight < 700);

  const categories: ExpenseCategory[] = ['Comida', 'Transporte', 'Salud', 'Ocio', 'Ropa', 'Otro'];

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
    setAmount('');
    setCategory(null);
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
              Registrar gasto
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#b08878',
              marginBottom: '24px',
              fontWeight: 400,
            }}>
              ¿En qué gastaste?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '1px solid #e8d5c8',
              }}>
                <span style={{ fontSize: '28px', color: '#b08878', marginRight: '8px', fontWeight: 300 }}>$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  style={{
                    background: 'transparent',
                    fontSize: '32px',
                    fontFamily: '"Outfit", sans-serif',
                    textAlign: 'center',
                    color: '#2d1a0e',
                    outline: 'none',
                    width: '100%',
                    fontWeight: 800,
                  }}
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
                  Categoría
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categories.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setCategory(opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: `1.5px solid ${category === opt ? '#c1603a' : '#e8d5c8'}`,
                        background: category === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                        color: category === opt ? '#c1603a' : '#7a4a36',
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '13px',
                        fontWeight: category === opt ? 700 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
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
                  Nota (opcional)
                </p>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="ej. Almuerzo de negocios"
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
                disabled={!amount || !category}
                style={{ opacity: !amount || !category ? 0.45 : 1, cursor: !amount || !category ? 'not-allowed' : 'pointer' }}
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
