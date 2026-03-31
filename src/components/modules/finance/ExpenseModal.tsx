import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseCategory } from '../../../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, color }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [note, setNote] = useState('');

  const categories: ExpenseCategory[] = ['Comida', 'Transporte', 'Salud', 'Ocio', 'Ropa', 'Otro'];

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
              <h2 className="text-xl font-display font-bold text-white mb-1">Registrar Gasto</h2>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Ingresa el monto</p>
            </header>
            
            <div className="flex flex-col gap-6">
              {/* Amount */}
              <div className="flex justify-center items-center pb-4 border-b border-white/10">
                <span className="text-3xl text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-5xl font-mono text-center text-white focus:outline-none w-full font-bold placeholder-white/20"
                />
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <motion.button
                      key={c}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                        category === c 
                          ? `bg-white/10 text-white shadow-[0_0_10px_var(--color-gold-400)_inset]`
                          : 'bg-navy-800 border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                      style={{ 
                         borderColor: category === c ? color : undefined,
                         color: category === c ? color : undefined
                      }}
                    >
                      {c}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400">Nota (Opcional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej. Almuerzo de negocios"
                  className="w-full bg-navy-800 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors resize-none h-20"
                />
              </div>

              {/* Actions */}
              <button 
                onClick={handleClose}
                disabled={!amount || !category}
                className="w-full px-6 py-4 rounded-xl font-bold text-center bg-gold-400 text-navy-900 hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar Gasto
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
