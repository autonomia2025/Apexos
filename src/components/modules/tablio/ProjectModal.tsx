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
            
            <header style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: '"Playfair Display", serif', fontSize: '30px', color: '#f0c040', fontWeight: 700 }}>
                 <Target size={20} color="#f0c040" /> Nuevo Proyecto
              </h2>
            </header>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Name Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Diseño Landing Page"
                  className="modal-input"
                />
              </div>

              {/* Venture */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Venture</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ventures.map((v) => (
                    <motion.button
                      key={v}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVenture(v)}
                      className="modal-chip"
                      style={{ 
                         transition: 'all 0.25s ease',
                         borderColor: venture === v ? color : 'rgba(255,255,255,0.14)',
                         color: venture === v ? color : 'rgba(255,255,255,0.7)',
                         background: venture === v ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                         boxShadow: venture === v ? 'inset 0 0 10px rgba(240,192,64,0.45)' : 'none'
                      }}
                    >
                      {v}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Departments (Multi) */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Owner(s)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {depts.map((d) => {
                     const isSel = departments.includes(d);
                     return (
                      <motion.button
                        key={d}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleDept(d)}
                        className="modal-chip"
                        style={{
                          transition: 'all 0.25s ease',
                          borderColor: isSel ? '#f0c040' : 'rgba(255,255,255,0.14)',
                          color: isSel ? '#f0c040' : 'rgba(255,255,255,0.7)',
                          background: isSel ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                          boxShadow: isSel ? 'inset 0 0 10px rgba(240,192,64,0.35)' : 'none'
                        }}
                      >
                        {d}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Priority */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Prioridad</label>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                   {(['Baja', 'Media', 'Alta'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0', borderRadius: '10px', fontSize: '14px', fontWeight: 700, transition: 'all 0.25s ease', color: priority === p ? (p === 'Alta' ? '#fca5a5' : p === 'Media' ? '#fde047' : '#86efac') : 'rgba(255,255,255,0.5)', background: priority === p ? (p === 'Alta' ? 'rgba(248,113,113,0.18)' : p === 'Media' ? 'rgba(250,204,21,0.18)' : 'rgba(74,222,128,0.18)') : 'transparent' }}
                      >
                        {p}
                      </button>
                   ))}
                </div>
              </div>

              {/* Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Progreso ({progress}%)</label>
                 </div>
                 <input 
                   type="range"
                   min="0" max="100" step="10"
                   value={progress}
                   onChange={(e) => setProgress(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#f0c040' }}
                  />
              </div>

              {/* Actions */}
              <button
                onClick={handleClose}
                disabled={!name || departments.length === 0}
                style={{ marginTop: '8px', border: '1px solid rgba(240,192,64,0.5)', borderRadius: '14px', padding: '14px 16px', background: 'linear-gradient(135deg, #f0c040, #f7d97a)', color: '#0b1328', fontWeight: 800, letterSpacing: '0.03em', cursor: 'pointer', opacity: !name || departments.length === 0 ? 0.45 : 1 }}
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
