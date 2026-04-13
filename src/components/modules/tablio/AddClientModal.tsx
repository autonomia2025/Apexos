import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { addTablioClient } from '../../../lib/db';
import { formatCLP } from '../../../lib/utils';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CLP_RATE = 950;

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [venture, setVenture] = useState('');
  const [customVenture, setCustomVenture] = useState('');
  const [mrrUsd, setMrrUsd] = useState('');
  const [status, setStatus] = useState('activo');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  
  const ventures = ['Agencia', 'Consultoría', 'Producto', 'Otro'];

  useEffect(() => {
    if (isOpen) {
      setName('');
      setVenture('');
      setCustomVenture('');
      setMrrUsd('');
      setStatus('activo');
      setNotes('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!name || (!venture && !customVenture) || !mrrUsd) return;
    setSaving(true);
    try {
      const finalVenture = venture === 'Otro' ? customVenture : venture;
      const usd = parseFloat(mrrUsd) || 0;
      await addTablioClient({
        name,
        venture: finalVenture,
        mrr_usd: usd,
        mrr_clp: usd * CLP_RATE,
        status,
        notes: notes || undefined
      });
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           style={{
             position: 'fixed', inset: 0, zIndex: 100,
             background: 'rgba(45,26,14,0.5)', backdropFilter: 'blur(6px)',
             display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
           }}
        >
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             onClick={e => e.stopPropagation()}
             style={{
               width: '100%', maxWidth: '420px', background: '#fff',
               borderRadius: '24px', padding: '24px', position: 'relative'
             }}
          >
             <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(193,96,58,0.1)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', color: '#c1603a' }} ><X size={16} /></button>
             <h2 style={{ fontSize: '22px', fontFamily: '"Outfit", sans-serif', fontWeight: 800, margin: '0 0 16px 0', color: '#2d1a0e' }}>Nuevo Cliente</h2>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                   <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Nombre</label>
                   <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="ej. Netflix" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e8d5c8', background: '#fdf6f0', outline: 'none', fontFamily: '"Outfit", sans-serif' }} />
                </div>

                <div>
                   <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Venture</label>
                   <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                     {ventures.map(v => (
                       <button key={v} onClick={() => setVenture(v)} style={{ padding: '6px 12px', borderRadius: '100px', cursor: 'pointer', border: venture === v ? '1.5px solid #c1603a' : '1px solid #e8d5c8', background: venture === v ? 'rgba(193,96,58,0.1)' : '#fff', color: venture === v ? '#c1603a' : '#7a4a36', fontSize: '12px', fontWeight: 700 }}>
                         {v}
                       </button>
                     ))}
                   </div>
                   {venture === 'Otro' && (
                     <input value={customVenture} onChange={e => setCustomVenture(e.target.value)} placeholder="Especificar venture" style={{ marginTop: '8px', width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e8d5c8', background: '#fdf6f0', outline: 'none' }} />
                   )}
                </div>

                <div>
                   <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>MRR USD</label>
                   <input type="number" value={mrrUsd} onChange={e => setMrrUsd(e.target.value)} placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e8d5c8', background: '#fdf6f0', outline: 'none', fontFamily: '"Outfit", sans-serif' }} />
                   {mrrUsd && (
                     <p style={{ fontSize: '11px', color: '#b08878', margin: '4px 0 0 0' }}>~ {formatCLP((parseFloat(mrrUsd) || 0) * CLP_RATE)} CLP</p>
                   )}
                </div>

                <div>
                   <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Estado</label>
                   <div style={{ display: 'flex', gap: '8px' }}>
                     {['activo', 'pausado'].map(s => (
                       <button key={s} onClick={() => setStatus(s)} style={{ padding: '6px 12px', borderRadius: '100px', cursor: 'pointer', border: status === s ? '1.5px solid #c1603a' : '1px solid #e8d5c8', background: status === s ? 'rgba(193,96,58,0.1)' : '#fff', color: status === s ? '#c1603a' : '#7a4a36', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>
                         {s}
                       </button>
                     ))}
                   </div>
                </div>

                <div>
                   <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Notas</label>
                   <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opcional" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e8d5c8', background: '#fdf6f0', outline: 'none', fontFamily: '"Outfit", sans-serif', resize: 'none' }} />
                </div>
             </div>

             <button onClick={handleSave} disabled={saving || !name || !mrrUsd || (!venture && !customVenture)} style={{ width: '100%', marginTop: '24px', padding: '14px', background: '#c1603a', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: 700, cursor: saving || !name || !mrrUsd ? 'not-allowed' : 'pointer', opacity: saving || !name || !mrrUsd ? 0.5 : 1 }}>
               {saving ? 'Guardando...' : 'Crear cliente'}
             </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
