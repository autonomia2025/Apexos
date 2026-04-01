import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCouple } from '../../../hooks/useCouple';
import { addNutritionLog } from '../../../lib/db';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

export const MealModal: React.FC<MealModalProps> = ({ isOpen, onClose, color: _color }) => {
  const { activeUserId } = useCouple();
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const mealTypes = ['Desayuno', 'Almuerzo', 'Cena', 'Snack'];

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
    if (!mealName || !mealType || !activeUserId) return;
    
    setSaving(true);
    setError('');
    try {
      await addNutritionLog({
        user_id: activeUserId,
        meal_name: mealName,
        calories: parseInt(calories) || 0,
        meal_type: mealType as any
      });
      
      setMealName('');
      setCalories('');
      setMealType(null);
      onClose();
    } catch (err: any) {
      setError('No se pudo guardar la comida');
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

            <h2 style={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              fontSize: '26px',
              color: '#2d1a0e',
              marginBottom: '4px',
              paddingRight: '44px',
            }}>
              Registrar comida
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#b08878',
              marginBottom: '24px',
              fontWeight: 400,
            }}>
              ¿Qué comiste?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#b08878',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}>
                  Nombre del alimento
                </p>
                <input
                  type="text"
                  value={mealName}
                  onChange={e => setMealName(e.target.value)}
                  placeholder="ej. Pollo con arroz"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #e8d5c8',
                    background: '#fdf6f0',
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#2d1a0e',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#b08878',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}>
                  Calorías estimadas
                </p>
                <input
                  type="number"
                  value={calories}
                  onChange={e => setCalories(e.target.value)}
                  placeholder="ej. 450"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #e8d5c8',
                    background: '#fdf6f0',
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#2d1a0e',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#b08878',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}>
                  Tipo de comida
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {mealTypes.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setMealType(opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: `1.5px solid ${mealType === opt ? '#c1603a' : '#e8d5c8'}`,
                        background: mealType === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                        color: mealType === opt ? '#c1603a' : '#7a4a36',
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '13px',
                        fontWeight: mealType === opt ? 700 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p style={{ color: '#c1603a', fontSize: '13px', textAlign: 'center', marginTop: '16px', marginBottom: 0 }}>
                {error}
              </p>
            )}

            <div style={{
              position: 'sticky',
              bottom: 0,
              background: '#ffffff',
              paddingTop: '12px',
              paddingBottom: '4px',
              marginTop: '16px',
            }}>
              <button
                className="btn-gold"
                onClick={handleSave}
                disabled={!mealName || !mealType || saving}
                style={{ opacity: !mealName || !mealType || saving ? 0.45 : 1, cursor: !mealName || !mealType || saving ? 'not-allowed' : 'pointer', width: '100%' }}
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
