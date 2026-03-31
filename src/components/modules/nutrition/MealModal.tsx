import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Type } from 'lucide-react';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const MealModal: React.FC<MealModalProps> = ({ isOpen, onClose, color }) => {
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
              <h2 className="text-xl font-display font-bold text-white mb-1">Registrar Comida</h2>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Añadir nueva ingesta</p>
            </header>
            
            <div className="flex flex-col gap-6">
              {/* Write Meal */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Type size={16} /> Escribir comida
                </label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="Ej. Tostadas con huevo y café"
                  className="w-full bg-navy-800 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

               {/* Snapshot (Coming Soon) */}
               <div className="relative group overflow-hidden rounded-xl">
                 <button 
                   disabled
                   className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-navy-800 text-gray-500 border border-white/5 border-dashed cursor-not-allowed"
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
                className="w-full px-6 py-4 rounded-xl font-bold text-center bg-gold-400 text-navy-900 hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
