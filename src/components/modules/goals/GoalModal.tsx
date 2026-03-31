import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoalType, GoalModule } from '../../../types/goals';
import { Target, Users, User } from 'lucide-react';

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
            className="modal-backdrop"
          />
           
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 230 }}
            className="modal-sheet"
            style={{ maxHeight: '85vh' }}
          >
            <div className="modal-handle" />
            
            <header className="modal-header">
              <h2 className="modal-title flex items-center justify-center gap-2">
                 <Target size={20} className="text-gold-400" /> Nueva Meta
              </h2>
            </header>
            
            <div className="flex flex-col gap-6">
              
              {/* Type Toggle */}
               <div className="bg-white/5 p-1 flex rounded-xl border border-white/10">
                 <button
                   onClick={() => setType('personal')}
                   className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                     type === 'personal' ? 'bg-gold-400/20 text-gold-300 shadow-md' : 'text-gray-400 hover:text-white'
                   }`}
                 >
                   <User size={16} /> Personal
                 </button>
                 <button
                   onClick={() => setType('shared')}
                   className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                     type === 'shared' ? 'bg-white/10 text-white shadow-md' : 'text-gray-400 hover:text-white'
                   }`}
                 >
                   <Users size={16} /> De pareja
                 </button>
              </div>

              {/* Module */}
              <div className="space-y-3">
                 <label className="modal-field-label">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {modules.map((m) => (
                    <motion.button
                      key={m.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setModule(m.id)}
                      className={`modal-chip transition-colors ${
                        module === m.id 
                          ? `bg-white/10 text-white shadow-[0_0_10px_var(--color-gold-400)_inset]`
                          : 'hover:border-white/20'
                      }`}
                      style={{ 
                         borderColor: module === m.id ? color : undefined,
                         color: module === m.id ? color : undefined
                      }}
                    >
                      {m.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-3">
                <label className="modal-field-label">Titulo</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Leer 5 libros"
                  className="modal-input"
                />
              </div>

              {/* Targets */}
              <div className="flex gap-4">
                 <div className="space-y-3 flex-1">
                   <label className="modal-field-label">Meta</label>
                   <input
                     type="number"
                     value={value}
                     onChange={(e) => setValue(e.target.value)}
                     placeholder="Objetivo final"
                      className="modal-input"
                    />
                  </div>
                  <div className="space-y-3 flex-1">
                    <label className="modal-field-label">Unidad</label>
                    <input
                     type="text"
                     value={unit}
                     onChange={(e) => setUnit(e.target.value)}
                     placeholder="Ej. Kcal, $, Pag..."
                      className="modal-input"
                    />
                  </div>
               </div>
               
               <div className="space-y-3">
                 <label className="modal-field-label">Fecha limite</label>
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
                className="modal-primary-btn active:scale-95 mt-2"
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
