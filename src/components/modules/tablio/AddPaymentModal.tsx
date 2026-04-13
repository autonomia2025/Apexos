import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { addTablioPayment } from '../../../lib/db';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clients: any[];
  prefilledClient?: any;
}

const CLP_RATE = 950;

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, onSuccess, clients, prefilledClient }) => {
  const [clientId, setClientId] = useState('');
  const [amountUsd, setAmountUsd] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [status, setStatus] = useState('pagado');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setPaymentDate(today);
      setStatus('pagado');
      setNotes('');
      
      if (prefilledClient) {
        setClientId(prefilledClient.id);
        setAmountUsd(String(prefilledClient.mrr_usd));
      } else {
        setClientId('');
        setAmountUsd('');
      }
    }
  }, [isOpen, prefilledClient]);

  const handleClientChange = (id: string) => {
    setClientId(id);
    const client = clients.find(c => c.id === id);
    if (client) {
      setAmountUsd(String(client.mrr_usd));
    }
  };

  const handleSave = async () => {
    if (!clientId || !amountUsd || !paymentDate) return;
    setSaving(true);
    try {
      const dateObj = new Date(paymentDate);
      const usd = parseFloat(amountUsd) || 0;
      await addTablioPayment({
        client_id: clientId,
        amount_usd: usd,
        amount_clp: usd * CLP_RATE,
        payment_date: paymentDate,
        month: dateObj.toLocaleString('es-ES', { month: 'short' }),
        year: dateObj.getFullYear(),
        status,
        notes: notes || undefined
      });
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Error guardando pago');
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
             <h2 style={{ fontSize: '22px', fontFamily: '"Outfit", sans-serif', fontWeight: 800, margin: '0 0 16px 0', color: '#2d1a0e' }}>Registrar Pago</h2>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                   <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Cliente</label>
                   <select value={clientId} onChange={e => handleClientChange(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e8d5c8', background: '#fdf6f0', outline: 'none', fontFamily: '"Outfit", sans-serif' }}>
                     <option value="" disabled>Selecciona un cliente</option>
                     {clients.filter(c => c.status !== 'cancelado').map(c => (
                       <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                   </select>
                </div>

                <div>
                   <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Monto USD</label>
                   <input type="number" value={amountUsd} onChange={e => setAmountUsd(e.target.value)} placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e8d5c8', background: '#fdf6f0', outline: 'none', fontFamily: '"Outfit", sans-serif' }} />
                </div>
                
                <div>
                   <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Fecha de pago</label>
                   <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e8d5c8', background: '#fdf6f0', outline: 'none', fontFamily: '"Outfit", sans-serif', color: '#2d1a0e' }} />
                </div>

                <div>
                   <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Estado</label>
                   <div style={{ display: 'flex', gap: '8px' }}>
                     {['pagado', 'pendiente', 'atrasado'].map(s => (
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

             <button onClick={handleSave} disabled={saving || !clientId || !amountUsd || !paymentDate} style={{ width: '100%', marginTop: '24px', padding: '14px', background: '#c1603a', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: 700, cursor: saving || !clientId || !amountUsd ? 'not-allowed' : 'pointer', opacity: saving || !clientId || !amountUsd ? 0.5 : 1 }}>
               {saving ? 'Guardando...' : 'Registrar pago'}
             </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
