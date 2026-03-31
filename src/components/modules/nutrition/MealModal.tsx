import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Type, X } from 'lucide-react';

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
              <h2 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontSize: '30px', color: '#c1603a', fontWeight: 700 }}>Registrar Comida</h2>
              <p style={{ marginTop: '6px', color: '#b08878', fontSize: '13px' }}>Anadir nueva ingesta</p>
            </header>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Write Meal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
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
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 24px', borderRadius: '12px', fontWeight: 700, background: 'rgba(193,96,58,0.08)', color: '#b08878', border: '1px dashed rgba(255,255,255,0.2)', cursor: 'not-allowed' }}
                    >
                   <Camera size={20} />
                   <span>Foto de comida</span>
                 </button>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(193,96,58,0.08)', backdropFilter: 'blur(6px)' }}>
                    <span style={{ fontSize: '12px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#c1603a', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Proximamente</span>
                  </div>
                </div>

              {/* Actions */}
                <button
                 onClick={handleClose}
                 disabled={!mealName}
                  style={{ border: '1px solid rgba(193,96,58,0.5)', borderRadius: '14px', padding: '14px 16px', background: 'linear-gradient(135deg, #c1603a, #d4724a)', color: '#ffffff', fontWeight: 800, letterSpacing: '0.03em', cursor: 'pointer', opacity: !mealName ? 0.45 : 1 }}
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
