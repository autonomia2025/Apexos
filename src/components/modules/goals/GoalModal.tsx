import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoalType, GoalModule } from '../../../types/goals';
import { Target, Users, User, X } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, color }) => {
  const [type, setType] = useState<GoalType>('personal');
  const [module, setModule] = useState<GoalModule | null>(null);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [deadline, setDeadline] = useState('');

  const modules: { id: GoalModule; label: string }[] = [
    { id: 'nutrition', label: 'Nutrición' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'finance', label: 'Finanzas' },
    { id: 'learning', label: 'Aprendizaje' },
    { id: 'general', label: 'General' },
  ];

  const handleClose = () => {
    setType('personal');
    setModule(null);
    setTitle('');
    setValue('');
    setUnit('');
    setDeadline('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(45,26,14,0.4)', backdropFilter: 'blur(4px)' }}
          />
           
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 230 }}
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '85vh' }}
          >
            <div className="modal-handle" />
            <button
              onClick={handleClose}
              style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(193,96,58,0.1)', border: '1px solid rgba(193,96,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c1603a' }}
            >
              <X size={16} />
            </button>
            
            <header style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: '"Outfit", sans-serif', fontSize: '30px', color: '#c1603a', fontWeight: 700 }}>
                 <Target size={20} color="#c1603a" /> Nueva Meta
              </h2>
            </header>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Type Toggle */}
               <div style={{ background: 'rgba(193,96,58,0.08)', padding: '4px', display: 'flex', borderRadius: '12px', border: '1px solid rgba(193,96,58,0.15)' }}>
                 <button
                   onClick={() => setType('personal')}
                   style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px 0', borderRadius: '10px', fontSize: '14px', fontWeight: 700, transition: 'all 0.25s ease', color: type === 'personal' ? '#d4724a' : '#b08878', background: type === 'personal' ? 'rgba(193,96,58,0.2)' : 'transparent', boxShadow: type === 'personal' ? '0 6px 18px rgba(180, 100, 60, 0.08)' : 'none' }}
                 >
                   <User size={16} /> Personal
                 </button>
                 <button
                   onClick={() => setType('shared')}
                   style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px 0', borderRadius: '10px', fontSize: '14px', fontWeight: 700, transition: 'all 0.25s ease', color: type === 'shared' ? '#2d1a0e' : '#b08878', background: type === 'shared' ? 'rgba(193,96,58,0.15)' : 'transparent', boxShadow: type === 'shared' ? '0 6px 18px rgba(180, 100, 60, 0.08)' : 'none' }}
                 >
                   <Users size={16} /> De pareja
                 </button>
              </div>

              {/* Module */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Categoria</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {modules.map((m) => (
                    <motion.button
                      key={m.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setModule(m.id)}
                      className="modal-chip"
                      style={{ 
                         transition: 'all 0.25s ease',
                         borderColor: module === m.id ? color : 'rgba(255,255,255,0.14)',
                         color: module === m.id ? color : 'rgba(255,255,255,0.7)',
                         background: module === m.id ? 'rgba(193,96,58,0.15)' : 'rgba(255,255,255,0.03)',
                         boxShadow: module === m.id ? 'inset 0 0 10px rgba(193,96,58,0.45)' : 'none'
                      }}
                    >
                      {m.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Titulo</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Leer 5 libros"
                  className="modal-input"
                />
              </div>

              {/* Targets */}
              <div style={{ display: 'flex', gap: '16px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                   <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Meta</label>
                   <input
                     type="number"
                     value={value}
                     onChange={(e) => setValue(e.target.value)}
                     placeholder="Objetivo final"
                      className="modal-input"
                    />
                  </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                     <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Unidad</label>
                    <input
                     type="text"
                     value={unit}
                     onChange={(e) => setUnit(e.target.value)}
                     placeholder="Ej. Kcal, $, Pag..."
                      className="modal-input"
                    />
                  </div>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <label style={{ fontSize: '12px', color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Fecha limite</label>
                 <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                   className="modal-input"
                 />
               </div>

              {/* Actions */}
              <button
                onClick={handleClose}
                disabled={!title || !value || !deadline || !module}
                style={{ marginTop: '8px', border: '1px solid rgba(193,96,58,0.5)', borderRadius: '14px', padding: '14px 16px', background: 'linear-gradient(135deg, #c1603a, #d4724a)', color: '#ffffff', fontWeight: 800, letterSpacing: '0.03em', cursor: 'pointer', opacity: !title || !value || !deadline || !module ? 0.45 : 1 }}
              >
                Crear Meta
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
