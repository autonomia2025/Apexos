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
            
            <header className="modal-header relative">
              <h2 className="modal-title flex items-center justify-center gap-2">
                 <Target size={20} className="text-gold-400" /> Nuevo Proyecto
              </h2>
            </header>
            
            <div className="flex flex-col gap-6">
              
              {/* Name Input */}
              <div className="space-y-3">
                <label className="modal-field-label">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Diseño Landing Page"
                  className="modal-input"
                />
              </div>

              {/* Venture */}
              <div className="space-y-3">
                <label className="modal-field-label">Venture</label>
                <div className="flex flex-wrap gap-2">
                  {ventures.map((v) => (
                    <motion.button
                      key={v}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVenture(v)}
                      className={`modal-chip transition-colors ${
                        venture === v 
                          ? `bg-white/10 text-white shadow-[0_0_10px_var(--color-gold-400)_inset]`
                          : 'hover:border-white/20'
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
                <label className="modal-field-label">Owner(s)</label>
                <div className="flex flex-wrap gap-2">
                  {depts.map((d) => {
                     const isSel = departments.includes(d);
                     return (
                      <motion.button
                        key={d}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleDept(d)}
                        className={`modal-chip transition-colors ${
                          isSel 
                            ? `bg-white/10 text-white border-gold-400 shadow-[0_0_10px_rgba(240,192,64,0.3)_inset]`
                            : 'hover:border-white/20'
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
                <label className="modal-field-label">Prioridad</label>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
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
                    <label className="modal-field-label">Progreso ({progress}%)</label>
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
                className="modal-primary-btn active:scale-95 mt-2"
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
