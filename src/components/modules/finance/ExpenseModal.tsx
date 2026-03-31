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
              <h2 className="modal-title">Registrar Gasto</h2>
              <p className="modal-subtitle">Ingresa el monto</p>
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
                <label className="modal-field-label">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <motion.button
                      key={c}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCategory(c)}
                      className={`modal-chip transition-colors ${
                        category === c 
                          ? `bg-white/10 text-white shadow-[0_0_10px_var(--color-gold-400)_inset]`
                          : 'hover:border-white/20'
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
                <label className="modal-field-label">Nota (Opcional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej. Almuerzo de negocios"
                  className="modal-input resize-none h-20"
                />
              </div>

              {/* Actions */}
              <button
                onClick={handleClose}
                disabled={!amount || !category}
                className="modal-primary-btn active:scale-95"
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
