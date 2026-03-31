import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({ isOpen, onClose, color }) => {
  const [duration, setDuration] = useState('');
  const [workoutType, setWorkoutType] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const types = ['Fuerza', 'Cardio', 'Deporte', 'Movilidad', 'Otro'];

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
              <h2 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontSize: '30px', color: '#c1603a', fontWeight: 700 }}>Registrar Entreno</h2>
              <p style={{ marginTop: '6px', color: '#b08878', fontSize: '13px' }}>Anadir nueva sesion</p>
            </header>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Tipo de Entreno</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {types.map((t) => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setWorkoutType(t)}
                      className="modal-chip"
                      style={{ 
                         transition: 'all 0.25s ease',
                         borderColor: workoutType === t ? color : 'rgba(255,255,255,0.14)',
                         color: workoutType === t ? color : 'rgba(255,255,255,0.7)',
                         background: workoutType === t ? 'rgba(193,96,58,0.15)' : 'rgba(255,255,255,0.03)',
                         boxShadow: workoutType === t ? 'inset 0 0 10px rgba(193,96,58,0.45)' : 'none'
                      }}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>

               {/* Duration */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ej. 60"
                  className="modal-input"
                />
              </div>

              {/* Note */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Nota (Opcional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej. Día de pecho y tríceps"
                  className="modal-input"
                  style={{ resize: 'none', minHeight: '80px' }}
                />
              </div>

              {/* Actions */}
              <button
                onClick={handleClose}
                disabled={!duration || !workoutType}
                style={{ marginTop: '4px', border: '1px solid rgba(193,96,58,0.5)', borderRadius: '14px', padding: '14px 16px', background: 'linear-gradient(135deg, #c1603a, #d4724a)', color: '#ffffff', fontWeight: 800, letterSpacing: '0.03em', cursor: 'pointer', opacity: !duration || !workoutType ? 0.45 : 1 }}
              >
                Guardar Entreno
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
