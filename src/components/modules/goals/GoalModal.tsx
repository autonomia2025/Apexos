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
            className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:w-full sm:max-w-md bg-navy-900 border border-gold-400/20 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col glass-panel border-b-0 sm:border-b z-50 p-6 space-y-6 h-[85vh] sm:h-auto overflow-y-auto"
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-600 rounded-full" />
            
            <header className="pt-4 text-center">
              <h2 className="text-xl font-display font-bold text-white mb-1 flex items-center justify-center gap-2">
                 <Target size={20} className="text-gold-400" /> Nueva Meta
              </h2>
            </header>
            
            <div className="flex flex-col gap-6">
              
              {/* Type Toggle */}
              <div className="bg-navy-800 p-1 flex rounded-xl border border-white/5">
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
                <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {modules.map((m) => (
                    <motion.button
                      key={m.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setModule(m.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                        module === m.id 
                          ? `bg-white/10 text-white shadow-[0_0_10px_var(--color-gold-400)_inset]`
                          : 'bg-navy-800 border-white/5 text-gray-400 hover:border-white/20'
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
                <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Leer 5 libros"
                  className="w-full bg-navy-800 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              {/* Targets */}
              <div className="flex gap-4">
                 <div className="space-y-3 flex-1">
                   <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Meta</label>
                   <input
                     type="number"
                     value={value}
                     onChange={(e) => setValue(e.target.value)}
                     placeholder="Objetivo final"
                     className="w-full bg-navy-800 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                   />
                 </div>
                 <div className="space-y-3 flex-1">
                   <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Unidad</label>
                   <input
                     type="text"
                     value={unit}
                     onChange={(e) => setUnit(e.target.value)}
                     placeholder="Ej. Kcal, $, Pag..."
                     className="w-full bg-navy-800 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                   />
                 </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Fecha Límite</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-navy-800 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              {/* Actions */}
              <button 
                onClick={handleClose}
                disabled={!title || !value || !deadline || !module}
                className="w-full px-6 py-4 rounded-xl font-bold text-center bg-gold-400 text-navy-900 hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
