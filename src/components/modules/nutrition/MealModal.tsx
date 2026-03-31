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
            
            <header style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontSize: '30px', color: '#f0c040', fontWeight: 700 }}>Registrar Comida</h2>
              <p style={{ marginTop: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Anadir nueva ingesta</p>
            </header>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Write Meal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
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
               <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                 <button 
                   disabled
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 24px', borderRadius: '12px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px dashed rgba(255,255,255,0.2)', cursor: 'not-allowed' }}
                    >
                   <Camera size={20} />
                   <span>Foto de comida</span>
                 </button>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,13,31,0.82)', backdropFilter: 'blur(6px)' }}>
                    <span style={{ fontSize: '12px', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, color: '#f0c040', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Proximamente</span>
                  </div>
                </div>

              {/* Actions */}
                <button
                 onClick={handleClose}
                 disabled={!mealName}
                  style={{ border: '1px solid rgba(240,192,64,0.5)', borderRadius: '14px', padding: '14px 16px', background: 'linear-gradient(135deg, #f0c040, #f7d97a)', color: '#0b1328', fontWeight: 800, letterSpacing: '0.03em', cursor: 'pointer', opacity: !mealName ? 0.45 : 1 }}
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
