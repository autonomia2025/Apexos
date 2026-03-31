import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, color }) => {
  const [name, setName] = useState('');
  const [venture, setVenture] = useState('RecepcionistaAI');
  const [priority, setPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [departments, setDepartments] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const ventures = ['RecepcionistaAI', 'AutonomIA', 'BotFactory', 'ROMO OS', 'Otro'];
  const depts = ['Informática', 'Desarrollo IA', 'Ventas', 'Marketing'];

  const toggleDept = (d: string) => {
    setDepartments(prev => prev.includes(d) ? prev.filter(p => p !== d) : [...prev, d]);
  };

  const handleClose = () => {
    setName('');
    setVenture('RecepcionistaAI');
    setPriority('Media');
    setDepartments([]);
    setProgress(0);
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
            
            <header className="pt-4 text-center relative">
              <h2 className="text-xl font-display font-bold text-white mb-1 flex items-center justify-center gap-2">
                 <Target size={20} className="text-gold-400" /> Nuevo Proyecto
              </h2>
            </header>
            
            <div className="flex flex-col gap-6">
              
              {/* Name Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Diseño Landing Page"
                  className="w-full bg-navy-800 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              {/* Venture */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Venture</label>
                <div className="flex flex-wrap gap-2">
                  {ventures.map((v) => (
                    <motion.button
                      key={v}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVenture(v)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                        venture === v 
                          ? `bg-white/10 text-white shadow-[0_0_10px_var(--color-gold-400)_inset]`
                          : 'bg-navy-800 border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                      style={{ 
                         borderColor: venture === v ? color : undefined,
                         color: venture === v ? color : undefined
                      }}
                    >
                      {v}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Departments (Multi) */}
               <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Owner(s)</label>
                <div className="flex flex-wrap gap-2">
                  {depts.map((d) => {
                     const isSel = departments.includes(d);
                     return (
                      <motion.button
                        key={d}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleDept(d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                          isSel 
                            ? `bg-white/10 text-white border-gold-400 shadow-[0_0_10px_rgba(240,192,64,0.3)_inset]`
                            : 'bg-navy-800 border-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {d}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Prioridad</label>
                <div className="flex bg-navy-800 p-1 rounded-xl border border-white/5">
                   {(['Baja', 'Media', 'Alta'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 flex justify-center items-center py-2.5 rounded-lg text-sm font-bold transition-all ${
                          priority === p 
                             ? p === 'Alta' ? 'bg-red-400/20 text-red-300' : p === 'Media' ? 'bg-yellow-400/20 text-yellow-300' : 'bg-green-400/20 text-green-300'
                             : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                   ))}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <label className="text-sm font-medium text-gray-400 font-mono tracking-widest uppercase text-[10px]">Progreso ({progress}%)</label>
                 </div>
                 <input 
                   type="range"
                   min="0" max="100" step="10"
                   value={progress}
                   onChange={(e) => setProgress(Number(e.target.value))}
                   className="w-full accent-gold-400"
                 />
              </div>

              {/* Actions */}
              <button 
                onClick={handleClose}
                disabled={!name || departments.length === 0}
                className="w-full px-6 py-4 rounded-xl font-bold text-center bg-gold-400 text-navy-900 hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Guardar Proyecto
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
