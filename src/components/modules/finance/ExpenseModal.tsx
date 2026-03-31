import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseCategory } from '../../../types';
import { X } from 'lucide-react';

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
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(45,26,14,0.4)', backdropFilter: 'blur(4px)' }}
          />
          
          {/* Action Sheet Container */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 230 }}
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="modal-handle" />
            <button
              onClick={handleClose}
              style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(193,96,58,0.1)', border: '1px solid rgba(193,96,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c1603a' }}
            >
              <X size={16} />
            </button>
            
            <header style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontSize: '30px', color: '#c1603a', fontWeight: 700 }}>Registrar Gasto</h2>
              <p style={{ marginTop: '6px', color: '#b08878', fontSize: '13px' }}>Ingresa el monto</p>
            </header>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Amount */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(193,96,58,0.15)' }}>
                <span style={{ fontSize: '30px', color: 'rgba(255,255,255,0.38)', marginRight: '8px' }}>$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  style={{ background: 'transparent', fontSize: '48px', fontFamily: '"Outfit", sans-serif', textAlign: 'center', color: '#2d1a0e', outline: 'none', width: '100%', fontWeight: 700 }}
                />
              </div>

              {/* Category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Categoria</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categories.map((c) => (
                    <motion.button
                      key={c}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCategory(c)}
                      className="modal-chip"
                      style={{ 
                         transition: 'all 0.25s ease',
                         borderColor: category === c ? color : 'rgba(255,255,255,0.14)',
                         color: category === c ? color : 'rgba(255,255,255,0.7)',
                         background: category === c ? 'rgba(193,96,58,0.15)' : 'rgba(255,255,255,0.03)',
                         boxShadow: category === c ? 'inset 0 0 10px rgba(193,96,58,0.45)' : 'none'
                      }}
                    >
                      {c}
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
                  placeholder="Ej. Almuerzo de negocios"
                  className="modal-input"
                  style={{ resize: 'none', minHeight: '80px' }}
                />
              </div>

              {/* Actions */}
              <button
                onClick={handleClose}
                disabled={!amount || !category}
                style={{ marginTop: '4px', border: '1px solid rgba(193,96,58,0.5)', borderRadius: '14px', padding: '14px 16px', background: 'linear-gradient(135deg, #c1603a, #d4724a)', color: '#ffffff', fontWeight: 800, letterSpacing: '0.03em', cursor: 'pointer', opacity: !amount || !category ? 0.45 : 1 }}
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
