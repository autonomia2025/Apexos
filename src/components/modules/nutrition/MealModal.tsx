import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCouple } from '../../../hooks/useCouple';
import { addNutritionLog, analyzeMeal, getNutritionLogs, autoUpdateGoals } from '../../../lib/db';

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
  const { activeUserId, activeRole } = useCouple();
  const [mode, setMode] = useState<'ai' | 'barcode' | 'manual'>('ai');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  
  // Barcode fields
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [barcodeError, setBarcodeError] = useState('');

  // Form fields
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [mealType, setMealType] = useState('Almuerzo');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Log for debugging
  useEffect(() => {
    console.log('MealModal activeUserId:', activeUserId);
  }, [activeUserId]);

  const mealTypes = ['Desayuno', 'Almuerzo', 'Cena', 'Snack'];

  const canSave = mode === 'manual' 
    ? (mealName.trim() !== '' && calories !== '')
    : mode === 'barcode'
      ? result !== null
      : result !== null; // AI mode requires result

  const resetForm = () => {
    setMode('ai');
    setDescription('');
    setResult(null);
    setMealName('');
    setCalories('');
    setProtein('');
    setMealType('Almuerzo');
    setError('');
    setBarcode('');
    setBarcodeError('');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset states
      resetForm();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBarcodeSearch = async () => {
    if (!barcode.trim()) return;
    setScanning(true);
    setBarcodeError('');
    setResult(null);
    
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await res.json();
      
      if (data.status === 0 || !data.product) {
        setBarcodeError('Producto no encontrado. Intentá con IA o manual.');
        return;
      }
      
      const product = data.product;
      const nutriments = product.nutriments || {};
      
      // Extract per 100g values, estimate for serving
      const calories100g = nutriments['energy-kcal_100g'] || 
        (nutriments['energy_100g'] ? nutriments['energy_100g'] / 4.184 : 0);
      const protein100g = nutriments['proteins_100g'] || 0;
      const carbs100g = nutriments['carbohydrates_100g'] || 0;
      const fat100g = nutriments['fat_100g'] || 0;
      const servingG = product.serving_quantity || 100;
      
      const factor = servingG / 100;
      
      setResult({
        meal_name: product.product_name || 'Producto escaneado',
        calories: Math.round(calories100g * factor),
        protein_g: Math.round(protein100g * factor * 10) / 10,
        carbs_g: Math.round(carbs100g * factor * 10) / 10,
        fat_g: Math.round(fat100g * factor * 10) / 10,
        breakdown: [{
          item: product.product_name || 'Porción',
          amount: `${servingG}g`,
          calories: Math.round(calories100g * factor),
        }]
      });
      setMealName(product.product_name || '');
      setCalories(String(Math.round(calories100g * factor)));
      setProtein(String(Math.round(protein100g * factor * 10) / 10));
      
    } catch (e) {
      setBarcodeError('Error al buscar. Verificá tu conexión.');
    } finally {
      setScanning(false);
    }
  };

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setAnalyzing(true);
    setError('');
    setResult(null);
    try {
      const nutrition = await analyzeMeal(description);
      
      // Recalculate calories from breakdown (don't trust AI sum)
      const recalculatedCalories = nutrition.breakdown
        ? nutrition.breakdown.reduce((sum: number, item: any) => 
            sum + (item.calories || 0), 0)
        : nutrition.calories;

      // Use recalculated value
      const correctedResult = {
        ...nutrition,
        calories: recalculatedCalories,
      };

      setResult(correctedResult);
      // Pre-fill fields
      setMealName(correctedResult.meal_name);
      setCalories(String(correctedResult.calories));
      setProtein(String(correctedResult.protein_g));
    } catch (e) {
      console.error('analyzeMeal failed:', e);
      setError(
        e instanceof Error 
          ? e.message 
          : 'No se pudo analizar. Intentá de nuevo.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    // Guard: need a valid user
    if (!activeUserId) {
      setError('Error: usuario no identificado. Recargá la página.');
      return;
    }
    
    // Guard: need data to save
    if (mode === 'ai' && !result) {
      setError('Primero analizá la comida con IA.');
      return;
    }
    if (mode === 'manual' && (!mealName.trim() || !calories)) {
      setError('Completá nombre y calorías.');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const logData = {
        user_id: activeUserId,
        meal_name: mealName || result?.meal_name || description || 'Comida',
        calories: parseInt(calories) || result?.calories || 0,
        protein_g: parseFloat(protein) || result?.protein_g || 0,
        carbs_g: result?.carbs_g || 0,
        fat_g: result?.fat_g || 0,
        meal_type: mealType,
      };
      
      console.log('Saving meal:', logData); // debug
      
      await addNutritionLog(logData);
      
      console.log('Meal saved successfully'); // debug
      
      // Update goals
      const logs = await getNutritionLogs(activeUserId, 1);
      const totalCalories = logs.reduce((sum, l) => sum + l.calories, 0);
      await autoUpdateGoals(activeUserId, activeRole, 'nutrition', totalCalories);

      resetForm();
      onClose();
    } catch (e: any) {
      console.error('Save failed:', e); // debug
      setError(
        e?.message || 'No se pudo guardar. Intentá de nuevo.'
      );
    } finally {
      setSaving(false); // ALWAYS reset, even on error
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { resetForm(); onClose(); }}
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
              onClick={() => { resetForm(); onClose(); }}
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
              {(['ai', 'barcode', 'manual'] as const).map(m => (
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
                  {m === 'ai' ? '✦ Describir con IA' : m === 'barcode' ? '⊡ Código de barras' : 'Manual'}
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

              </div>
            ) : mode === 'barcode' ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '13px', color: '#b08878', marginBottom: '12px', lineHeight: 1.5 }}>
                  Ingresá el código de barras del producto
                </p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="number"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    placeholder="ej: 7802810101234"
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: '12px',
                      border: '1.5px solid #e8d5c8', background: '#fdf6f0',
                      fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                      color: '#2d1a0e', outline: 'none',
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleBarcodeSearch()}
                  />
                  <button
                    onClick={handleBarcodeSearch}
                    disabled={!barcode || scanning}
                    style={{
                      padding: '12px 16px', borderRadius: '12px',
                      background: '#c1603a', color: '#fff', border: 'none',
                      fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                      fontFamily: '"Outfit", sans-serif',
                      opacity: barcode && !scanning ? 1 : 0.5,
                    }}
                  >
                    {scanning ? '...' : 'Buscar'}
                  </button>
                </div>
                {barcodeError && (
                  <p style={{ color: '#c94040', fontSize: '13px', margin: '0 0 12px' }}>
                    {barcodeError}
                  </p>
                )}
                <p style={{ fontSize: '11px', color: '#b08878', textAlign: 'center', margin: '0 0 16px' }}>
                  Base de datos: Open Food Facts · Productos globales
                </p>
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

            {(mode === 'ai' || mode === 'barcode') && result && (
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
                      {(() => {
                        const totalCalories = result.breakdown
                          ? result.breakdown.reduce((sum, item) => 
                              sum + (item.calories || 0), 0)
                          : result.calories;
                          
                        return [
                          { label: 'Calorías', value: totalCalories, unit: 'kcal' },
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
                        ));
                      })()}
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
              disabled={saving || !canSave}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px',
                background: '#c1603a', color: '#ffffff', border: 'none',
                fontFamily: '"Outfit", sans-serif', fontSize: '16px', fontWeight: 700,
                marginTop: '24px', cursor: 'pointer',
                opacity: (saving || !canSave) ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Guardando...' 
                : !canSave && mode === 'ai' ? 'Analizá primero'
                : 'Guardar comida'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
