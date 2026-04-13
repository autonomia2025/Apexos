import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCouple } from '../../../hooks/useCouple';
import { addFinanceLog, getFinanceLogs, autoUpdateGoals } from '../../../lib/db';
import { ExpenseCategory } from '../../../types';
import { formatCLP } from '../../../lib/utils';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, color: _color }) => {
  const { activeUserId, users } = useCouple();
  const activeRole = activeUserId === users.jose?.user?.id ? 'jose' : 'anto';
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories: ExpenseCategory[] = ['Comida', 'Transporte', 'Salud', 'Ocio', 'Ropa', 'Otro'];

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
    if (!amount || !category || !activeUserId) return;
    
    setSaving(true);
    setError('');
    try {
      await addFinanceLog({
        user_id: activeUserId,
        amount: parseFloat(amount) || 0,
        category: category,
        note: note,
        type: 'gasto'
      });
      
      const logs = await getFinanceLogs(activeUserId, 30);
      const totalSpent = logs.filter((l: any) => l.type === 'gasto').reduce((sum: number, l: any) => sum + l.amount, 0);
      await autoUpdateGoals(activeUserId, activeRole, 'finance', totalSpent);

      setAmount('');
      setCategory(null);
      setNote('');
      onClose();
    } catch (err: any) {
      setError('No se pudo guardar el gasto');
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
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(45,26,14,0.5)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              maxHeight: '80vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e8d5c8',
              boxShadow: '0 24px 60px rgba(45,26,14,0.2)',
              padding: '28px 20px 24px',
              position: 'relative',
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(193,96,58,0.08)',
                border: '1px solid rgba(193,96,58,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#c1603a',
              }}
            >
              <X size={15} />
            </button>

            <h2 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '26px', color: '#2d1a0e', marginBottom: '4px', paddingRight: '44px' }}>
              Registrar gasto
            </h2>
            <p style={{ fontSize: '13px', color: '#b08878', marginBottom: '24px', fontWeight: 400 }}>
              ¿En qué gastaste?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, 
                  color: '#b08878', textTransform: 'uppercase',
                  letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Monto en CLP
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '24px', fontWeight: 800, color: '#b08878',
                    fontFamily: '"Outfit", sans-serif',
                  }}>
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100%', padding: '16px 16px 16px 40px',
                      borderRadius: '14px', border: '1.5px solid #e8d5c8',
                      background: '#fdf6f0', fontFamily: '"Outfit", sans-serif',
                      fontSize: '32px', fontWeight: 800, color: '#2d1a0e',
                      outline: 'none', textAlign: 'right',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#c1603a')}
                    onBlur={e => (e.target.style.borderColor = '#e8d5c8')}
                  />
                </div>
                {amount && (
                  <p style={{ fontSize: '13px', color: '#b08878', 
                    marginTop: '6px', textAlign: 'right' }}>
                    {formatCLP(parseFloat(amount) || 0)}
                  </p>
                )}
              </div>

              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Categoría
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categories.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setCategory(opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: `1.5px solid ${category === opt ? '#c1603a' : '#e8d5c8'}`,
                        background: category === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                        color: category === opt ? '#c1603a' : '#7a4a36',
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '13px',
                        fontWeight: category === opt ? 700 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Nota (opcional)
                </p>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="ej. Almuerzo de negocios"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e8d5c8', background: '#fdf6f0', fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: 500, color: '#2d1a0e', outline: 'none' }}
                />
              </div>
            </div>

            {error && (
              <p style={{ color: '#c1603a', fontSize: '13px', textAlign: 'center', marginTop: '16px', marginBottom: 0 }}>
                {error}
              </p>
            )}

            <div style={{ position: 'sticky', bottom: 0, background: '#ffffff', paddingTop: '12px', paddingBottom: '4px', marginTop: '16px' }}>
              <button
                className="btn-gold"
                onClick={handleSave}
                disabled={!amount || !category || saving}
                style={{ opacity: !amount || !category || saving ? 0.45 : 1, cursor: !amount || !category || saving ? 'not-allowed' : 'pointer', width: '100%' }}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
