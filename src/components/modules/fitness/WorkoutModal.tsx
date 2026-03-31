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
            
            <header className="modal-header">
              <h2 className="modal-title">Registrar Entreno</h2>
              <p className="modal-subtitle">Anadir nueva sesion</p>
            </header>
            
            <div className="flex flex-col gap-6">
              {/* Type */}
              <div className="space-y-3">
                <label className="modal-field-label">Tipo de Entreno</label>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setWorkoutType(t)}
                      className={`modal-chip transition-colors ${
                        workoutType === t 
                          ? `bg-white/10 text-white shadow-[0_0_10px_var(--color-gold-400)_inset]`
                          : 'hover:border-white/20'
                      }`}
                      style={{ 
                         borderColor: workoutType === t ? color : undefined,
                         color: workoutType === t ? color : undefined
                      }}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>

               {/* Duration */}
               <div className="space-y-3">
                <label className="modal-field-label flex items-center gap-2">
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
              <div className="space-y-3">
                <label className="modal-field-label">Nota (Opcional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej. Día de pecho y tríceps"
                  className="modal-input resize-none h-20"
                />
              </div>

              {/* Actions */}
              <button
                onClick={handleClose}
                disabled={!duration || !workoutType}
                className="modal-primary-btn active:scale-95"
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
