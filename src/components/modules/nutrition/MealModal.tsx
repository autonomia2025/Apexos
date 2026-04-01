import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCouple } from '../../../hooks/useCouple';
import { addNutritionLog, analyzeMeal } from '../../../lib/db';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

interface NutritionResult {
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  breakdown: { item: string; amount: string; calories: number }[];
}

export const MealModal: React.FC<MealModalProps> = ({ isOpen, onClose, color: _color }) => {
  const { activeUserId } = useCouple();
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  
  // Form fields
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [mealType, setMealType] = useState('Almuerzo');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const mealTypes = ['Desayuno', 'Almuerzo', 'Cena', 'Snack'];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset states
      setMode('ai');
      setDescription('');
      setResult(null);
      setMealName('');
      setCalories('');
      setProtein('');
      setError('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setAnalyzing(true);
    setError('');
    setResult(null);
    try {
      const nutrition = await analyzeMeal(description);
      setResult(nutrition);
      // Pre-fill fields
      setMealName(nutrition.meal_name);
      setCalories(String(nutrition.calories));
      setProtein(String(nutrition.protein_g));
    } catch (e) {
      console.error(e);
      setError('No se pudo analizar. Intentá de nuevo o usá el modo manual.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!activeUserId) return;
    if (mode === 'manual' && (!mealName || !calories)) return;
    if (mode === 'ai' && !result && !mealName) return;

    setSaving(true);
    setError('');
    try {
      await addNutritionLog({
        user_id: activeUserId,
        meal_name: mealName || result?.meal_name || description,
        calories: parseInt(calories) || result?.calories || 0,
        protein_g: parseFloat(protein) || result?.protein_g || 0,
        carbs_g: result?.carbs_g || 0,
        fat_g: result?.fat_g || 0,
        meal_type: mealType,
      });
      onClose();
    } catch (e) {
      console.error(e);
      setError('No se pudo guardar la comida.');
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
            background: 'rgba(45,26,14,0.5)',
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '440px', maxHeight: '85vh',
              overflowY: 'auto', background: '#ffffff',
              borderRadius: '24px', border: '1px solid #e8d5c8',
              boxShadow: '0 24px 60px rgba(45,26,14,0.2)',
              padding: '28px 24px', position: 'relative',
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(193,96,58,0.08)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#c1603a',
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{
              fontFamily: '"Outfit", sans-serif', fontWeight: 800,
              fontSize: '24px', color: '#2d1a0e', marginBottom: '4px',
            }}>
              Registrar comida
            </h2>
            <p style={{ fontSize: '13px', color: '#b08878', marginBottom: '20px' }}>
              ¿Qué comiste hoy?
            </p>

            {/* Mode Switch */}
            <div style={{
              display: 'flex', background: 'rgba(193,96,58,0.08)',
              borderRadius: '100px', padding: '3px', marginBottom: '20px', gap: '2px',
            }}>
              {(['ai', 'manual'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); }}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '100px',
                    border: 'none', cursor: 'pointer',
                    fontFamily: '"Outfit", sans-serif', fontSize: '12px',
                    fontWeight: 700, background: mode === m ? '#c1603a' : 'transparent',
                    color: mode === m ? '#ffffff' : '#7a4a36',
                    transition: 'all 0.2s',
                  }}
                >
                  {m === 'ai' ? '✦ Describir con IA' : 'Ingreso manual'}
                </button>
              ))}
            </div>

            {mode === 'ai' ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <textarea
                  placeholder="ej: una taza de arroz blanco, dos filetes de pollo a la plancha y ensalada mixta"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '14px',
                    border: '1.5px solid #e8d5c8', background: '#fdf6f0',
                    fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                    color: '#2d1a0e', outline: 'none', resize: 'none',
                    lineHeight: 1.6, marginBottom: '12px',
                  }}
                />
                
                <button
                  onClick={handleAnalyze}
                  disabled={!description.trim() || analyzing}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px',
                    border: '1.5px solid #c1603a',
                    background: analyzing ? 'rgba(193,96,58,0.08)' : 'rgba(193,96,58,0.1)',
                    color: '#c1603a', fontFamily: '"Outfit", sans-serif',
                    fontSize: '14px', fontWeight: 700,
                    cursor: description.trim() && !analyzing ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', marginBottom: '16px', transition: 'all 0.2s',
                  }}
                >
                  {analyzing ? 'Analizando...' : '✦ Analizar con IA'}
                </button>

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: '#fff8f5', border: '1.5px solid rgba(193,96,58,0.25)',
                      borderRadius: '16px', padding: '16px', marginBottom: '16px',
                    }}
                  >
                    <p style={{ fontWeight: 800, fontSize: '16px', color: '#2d1a0e', marginBottom: '12px' }}>
                      {result.meal_name}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      {[
                        { label: 'Calorías', value: result.calories, unit: 'kcal' },
                        { label: 'Proteína', value: result.protein_g, unit: 'g' },
                        { label: 'Carbos', value: result.carbs_g, unit: 'g' },
                      ].map(m => (
                        <div key={m.label} style={{
                          background: '#ffffff', border: '1px solid #e8d5c8',
                          borderRadius: '10px', padding: '8px', textAlign: 'center',
                        }}>
                          <p style={{ fontSize: '9px', color: '#b08878', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>{m.label}</p>
                          <p style={{ fontSize: '18px', fontWeight: 800, color: '#c1603a', margin: 0 }}>{Math.round(m.value)}</p>
                          <p style={{ fontSize: '9px', color: '#b08878', margin: 0 }}>{m.unit}</p>
                        </div>
                      ))}
                    </div>

                    {result.breakdown && result.breakdown.length > 0 && (
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '6px' }}>Desglose</p>
                        {result.breakdown.map((item, i) => (
                          <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '4px 0', borderBottom: i < result.breakdown.length - 1 ? '1px solid #f0e4da' : 'none',
                          }}>
                            <span style={{ fontSize: '12px', color: '#2d1a0e' }}>{item.item}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#c1603a' }}>{item.calories} kcal</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button
                      onClick={() => setMode('manual')}
                      style={{
                        marginTop: '12px', background: 'transparent', border: 'none',
                        color: '#b08878', fontSize: '11px', cursor: 'pointer',
                        textDecoration: 'underline', width: '100%', textAlign: 'left',
                      }}
                    >
                      Editar valores manualmente
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Nombre del alimento</label>
                  <input
                    type="text" value={mealName} onChange={e => setMealName(e.target.value)}
                    placeholder="ej. Pollo con ensalada"
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '1.5px solid #e8d5c8', background: '#fdf6f0',
                      fontFamily: '"Outfit", sans-serif', fontSize: '14px', outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Calorías</label>
                    <input
                      type="number" value={calories} onChange={e => setCalories(e.target.value)}
                      placeholder="kcal"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                        border: '1.5px solid #e8d5c8', background: '#fdf6f0',
                        fontFamily: '"Outfit", sans-serif', fontSize: '14px', outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Proteína (g)</label>
                    <input
                      type="number" value={protein} onChange={e => setProtein(e.target.value)}
                      placeholder="g"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                        border: '1.5px solid #e8d5c8', background: '#fdf6f0',
                        fontFamily: '"Outfit", sans-serif', fontSize: '14px', outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Tipo de comida</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {mealTypes.map(opt => (
                  <button
                    key={opt} onClick={() => setMealType(opt)}
                    style={{
                      padding: '8px 16px', borderRadius: '100px',
                      border: `1.5px solid ${mealType === opt ? '#c1603a' : '#e8d5c8'}`,
                      background: mealType === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                      color: mealType === opt ? '#c1603a' : '#7a4a36',
                      fontFamily: '"Outfit", sans-serif', fontSize: '12px',
                      fontWeight: mealType === opt ? 700 : 400, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ color: '#c1603a', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>{error}</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving || (mode === 'ai' && !result && !mealName) || (mode === 'manual' && (!mealName || !calories))}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px',
                background: '#c1603a', color: '#ffffff', border: 'none',
                fontFamily: '"Outfit", sans-serif', fontSize: '16px', fontWeight: 700,
                marginTop: '24px', cursor: 'pointer',
                opacity: (saving || (mode === 'ai' && !result && !mealName) || (mode === 'manual' && (!mealName || !calories))) ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Guardando...' : (mode === 'ai' && !result ? 'Analizá primero' : 'Guardar comida')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
