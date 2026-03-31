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
            
            <header className="modal-header">
              <h2 className="modal-title">Registrar Estudio</h2>
              <p className="modal-subtitle">Nueva sesion</p>
            </header>
            
            <div className="flex flex-col gap-6">
              {/* Topic */}
              <div className="space-y-3">
                <label className="modal-field-label">Tema</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej. React Componentes"
                  className="modal-input"
                />
              </div>

              {/* Duration Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="modal-field-label">Duracion</label>
                   <span className="text-lg font-bold font-mono text-gold-400">{duration} min</span>
                 </div>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
                />
                <div className="flex justify-between text-xs font-mono text-gray-500">
                  <span>15m</span>
                  <span>180m</span>
                </div>
              </div>

              {/* Resource Type */}
              <div className="space-y-3">
                <label className="modal-field-label">Recurso</label>
                <div className="flex flex-wrap gap-2">
                  {resources.map((r) => (
                    <motion.button
                      key={r}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setResource(r)}
                      className={`modal-chip transition-colors ${
                        resource === r 
                          ? `bg-white/10 text-white shadow-[0_0_10px_var(--color-gold-400)_inset]`
                          : 'hover:border-white/20'
                      }`}
                      style={{ 
                         borderColor: resource === r ? color : undefined,
                         color: resource === r ? color : undefined
                      }}
                    >
                      {r}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-3">
                <label className="modal-field-label">Nota (Opcional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Resumen o puntos clave..."
                  className="modal-input resize-none h-20"
                />
              </div>

              {/* Actions */}
              <button
                onClick={handleClose}
                disabled={!topic || !resource}
                className="modal-primary-btn active:scale-95"
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
