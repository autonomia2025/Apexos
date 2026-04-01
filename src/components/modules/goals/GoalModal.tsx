import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GoalType, GoalModule } from '../../../types/goals';
import { addGoal } from '../../../lib/db';
import { useCouple } from '../../../hooks/useCouple';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, color: _color }) => {
  const { activeUserId } = useCouple();
  const [type, setType] = useState<GoalType>('personal');
  const [module, setModule] = useState<GoalModule | null>(null);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [deadline, setDeadline] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const modules: { id: GoalModule; label: string }[] = [
    { id: 'nutrition', label: 'Nutrición' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'finance', label: 'Finanzas' },
    { id: 'learning', label: 'Aprendizaje' },
    { id: 'general', label: 'General' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleSave = async () => {
    if (!title || !value || !deadline || !module || !activeUserId) return;
    
    setSaving(true);
    setError('');
    try {
      await addGoal({
        user_id: activeUserId,
        couple_goal: type === 'shared',
        module,
        title,
        target_value: parseFloat(value),
        deadline
      });
      
      setTitle('');
      setValue('');
      setDeadline('');
      setModule(null);
      onClose();
    } catch (err: any) {
      setError('No se pudo guardar la meta');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="dialog-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(45,26,14,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '420px', maxHeight: '80vh', overflowY: 'auto', background: '#ffffff', borderRadius: '24px', border: '1px solid #e8d5c8', boxShadow: '0 24px 60px rgba(45,26,14,0.2)', padding: '28px 20px 24px', position: 'relative' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(193,96,58,0.08)', border: '1px solid rgba(193,96,58,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c1603a' }}>
              <X size={15} />
            </button>

            <h2 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '26px', color: '#2d1a0e', marginBottom: '4px' }}>Nueva meta</h2>
            <p style={{ fontSize: '13px', color: '#b08878', marginBottom: '24px' }}>Define tu objetivo</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Tipo</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['personal', 'shared'] as GoalType[]).map(t => (
                    <button key={t} onClick={() => setType(t)} style={{ flex: 1, padding: '10px 0', borderRadius: '12px', border: `1.5px solid ${type === t ? '#c1603a' : '#e8d5c8'}`, background: type === t ? 'rgba(193,96,58,0.08)' : '#ffffff', color: type === t ? '#c1603a' : '#7a4a36', cursor: 'pointer', fontWeight: type === t ? 700 : 400 }}>{t === 'personal' ? 'Personal' : 'De pareja'}</button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Módulo</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {modules.map(opt => (
                    <button key={opt.id} onClick={() => setModule(opt.id)} style={{ padding: '8px 16px', borderRadius: '100px', border: `1.5px solid ${module === opt.id ? '#c1603a' : '#e8d5c8'}`, background: module === opt.id ? 'rgba(193,96,58,0.08)' : '#ffffff', color: module === opt.id ? '#c1603a' : '#7a4a36', cursor: 'pointer', fontSize: '13px', fontWeight: module === opt.id ? 700 : 400 }}>{opt.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Título</p>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="ej. Leer 5 libros" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e8d5c8', background: '#fdf6f0', outline: 'none' }} />
              </div>

              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Valor objetivo</p>
                <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="ej. 5" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e8d5c8', background: '#fdf6f0', outline: 'none' }} />
              </div>

              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Fecha límite</p>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e8d5c8', background: '#fdf6f0', outline: 'none' }} />
              </div>
            </div>

            {error && <p style={{ color: '#c1603a', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>{error}</p>}

            <div style={{ position: 'sticky', bottom: 0, background: '#ffffff', paddingTop: '12px', marginTop: '16px' }}>
              <button className="btn-gold" onClick={handleSave} disabled={saving || !title || !value || !deadline || !module} style={{ width: '100%', opacity: saving || !title || !value || !deadline || !module ? 0.45 : 1 }}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
