import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Type } from 'lucide-react';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const MealModal: React.FC<MealModalProps> = ({ isOpen, onClose, color: _color }) => {
  const [mealName, setMealName] = useState('');

  const handleClose = () => {
    setMealName('');
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
              <h2 className="modal-title">Registrar Comida</h2>
              <p className="modal-subtitle">Anadir nueva ingesta</p>
            </header>
            
            <div className="flex flex-col gap-6">
              {/* Write Meal */}
              <div className="space-y-3">
                <label className="modal-field-label flex items-center gap-2">
                  <Type size={16} /> Escribir comida
                </label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="Ej. Tostadas con huevo y café"
                  className="modal-input"
                />
              </div>

               {/* Snapshot (Coming Soon) */}
               <div className="relative group overflow-hidden rounded-xl">
                 <button 
                   disabled
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-white/5 text-gray-500 border border-white/10 border-dashed cursor-not-allowed"
                   >
                   <Camera size={20} />
                   <span>Foto de comida</span>
                 </button>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900/80 backdrop-blur-sm">
                   <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">Próximamente</span>
                 </div>
               </div>

              {/* Actions */}
                <button
                 onClick={handleClose}
                 disabled={!mealName}
                 className="modal-primary-btn active:scale-95"
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
