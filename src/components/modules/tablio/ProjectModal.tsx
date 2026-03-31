import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Target } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, color: _color }) => {
  const [name, setName] = useState('');
  const [venture, setVenture] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Activo');
  const [progress, setProgress] = useState(0);
  const ventures = ['RecepcionistaAI', 'AutonomIA', 'BotFactory', 'ROMO OS', 'Otro'];
  const priorities = ['Alta', 'Media', 'Baja'];
  const statuses = ['Activo', 'En pausa'];

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
    setName('');
    setVenture(null);
    setPriority(null);
    setStatus('Activo');
    setProgress(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="dialog-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(45,26,14,0.5)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              maxHeight: '80vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e8d5c8',
              boxShadow: '0 24px 60px rgba(45,26,14,0.2)',
              padding: '28px 20px 24px',
              position: 'relative',
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
              paddingRight: '44px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Target size={20} color="#c1603a" />
              Nuevo proyecto
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#b08878',
              marginBottom: '24px',
              fontWeight: 400,
            }}>
              Registra tu nuevo proyecto
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
                  Nombre
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ej. Diseño Landing Page"
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
                  Venture
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ventures.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setVenture(opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: `1.5px solid ${venture === opt ? '#c1603a' : '#e8d5c8'}`,
                        background: venture === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                        color: venture === opt ? '#c1603a' : '#7a4a36',
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '13px',
                        fontWeight: venture === opt ? 700 : 400,
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
                  Prioridad
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {priorities.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setPriority(opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: `1.5px solid ${priority === opt ? '#c1603a' : '#e8d5c8'}`,
                        background: priority === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                        color: priority === opt ? '#c1603a' : '#7a4a36',
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '13px',
                        fontWeight: priority === opt ? 700 : 400,
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
                  Progreso ({progress}%)
                </p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={progress}
                  onChange={e => setProgress(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#c1603a' }}
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
                  Estado
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {statuses.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setStatus(opt)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '12px',
                        border: `1.5px solid ${status === opt ? '#c1603a' : '#e8d5c8'}`,
                        background: status === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                        color: status === opt ? '#c1603a' : '#7a4a36',
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '14px',
                        fontWeight: status === opt ? 700 : 400,
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
                disabled={!name || !venture || !priority}
                style={{ opacity: !name || !venture || !priority ? 0.45 : 1, cursor: !name || !venture || !priority ? 'not-allowed' : 'pointer' }}
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
