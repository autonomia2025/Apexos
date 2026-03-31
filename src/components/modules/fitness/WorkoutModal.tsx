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
            className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4"
          />
          
          {/* Action Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:w-full sm:max-w-md bg-navy-900 border border-gold-400/20 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col glass-panel border-b-0 sm:border-b z-50 p-6 space-y-6"
          >
            {/* Drag Handle */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-600 rounded-full" />
            
            <header className="pt-4 text-center">
              <h2 className="text-xl font-display font-bold text-white mb-1">Registrar Entreno</h2>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Añadir nueva sesión</p>
            </header>
            
            <div className="flex flex-col gap-6">
              {/* Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400">Tipo de Entreno</label>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setWorkoutType(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                        workoutType === t 
                          ? `bg-white/10 text-white shadow-[0_0_10px_var(--color-gold-400)_inset]`
                          : 'bg-navy-800 border-white/5 text-gray-400 hover:border-white/20'
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
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ej. 60"
                  className="w-full bg-navy-800 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              {/* Note */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400">Nota (Opcional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej. Día de pecho y tríceps"
                  className="w-full bg-navy-800 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors resize-none h-20"
                />
              </div>

              {/* Actions */}
              <button 
                onClick={handleClose}
                disabled={!duration || !workoutType}
                className="w-full px-6 py-4 rounded-xl font-bold text-center bg-gold-400 text-navy-900 hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
