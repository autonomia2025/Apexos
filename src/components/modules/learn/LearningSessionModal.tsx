import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LearningResource } from '../../../types';

interface LearningSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const LearningSessionModal: React.FC<LearningSessionModalProps> = ({ isOpen, onClose, color }) => {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(60); // Default 60 mins
  const [resource, setResource] = useState<LearningResource | null>(null);
  const [note, setNote] = useState('');

  const resources: LearningResource[] = ['Libro', 'Curso', 'Podcast', 'Video', 'Práctica'];

  const handleClose = () => {
    setTopic('');
    setDuration(60);
    setResource(null);
    setNote('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="modal-backdrop"
          />
          
          {/* Action Sheet Container */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 230 }}
            className="modal-sheet"
          >
            {/* Drag Handle */}
            <div className="modal-handle" />
            
            <header style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontSize: '30px', color: '#c1603a', fontWeight: 700 }}>Registrar Estudio</h2>
              <p style={{ marginTop: '6px', color: '#b08878', fontSize: '13px' }}>Nueva sesion</p>
            </header>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Topic */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Tema</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej. React Componentes"
                  className="modal-input"
                />
              </div>

              {/* Duration Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Duracion</label>
                   <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#c1603a' }}>{duration} min</span>
                 </div>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  style={{ width: '100%', height: '8px', borderRadius: '999px', appearance: 'none', cursor: 'pointer', background: 'rgba(193,96,58,0.1)', accentColor: '#c1603a' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: '"Outfit", sans-serif', color: '#b08878' }}>
                  <span>15m</span>
                  <span>180m</span>
                </div>
              </div>

              {/* Resource Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Recurso</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {resources.map((r) => (
                    <motion.button
                      key={r}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setResource(r)}
                      className="modal-chip"
                      style={{ 
                         transition: 'all 0.25s ease',
                         borderColor: resource === r ? color : 'rgba(255,255,255,0.14)',
                         color: resource === r ? color : 'rgba(255,255,255,0.7)',
                         background: resource === r ? 'rgba(193,96,58,0.15)' : 'rgba(255,255,255,0.03)',
                         boxShadow: resource === r ? 'inset 0 0 10px rgba(193,96,58,0.45)' : 'none'
                      }}
                    >
                      {r}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Nota (Opcional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Resumen o puntos clave..."
                  className="modal-input"
                  style={{ resize: 'none', minHeight: '80px' }}
                />
              </div>

              {/* Actions */}
              <button
                onClick={handleClose}
                disabled={!topic || !resource}
                style={{ marginTop: '4px', border: '1px solid rgba(193,96,58,0.5)', borderRadius: '14px', padding: '14px 16px', background: 'linear-gradient(135deg, #c1603a, #d4724a)', color: '#ffffff', fontWeight: 800, letterSpacing: '0.03em', transition: 'transform 0.2s ease, opacity 0.2s ease', cursor: 'pointer', opacity: !topic || !resource ? 0.45 : 1 }}
              >
                Guardar Sesión
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
