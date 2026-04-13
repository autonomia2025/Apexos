import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCouple } from '../../../hooks/useCouple';
import { addFitnessLog, analyzeWorkout, getFitnessLogs, autoUpdateGoals } from '../../../lib/db';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

interface WorkoutResult {
  workout_type: string;
  duration_min: number;
  calories_burned: number;
  summary: string;
  intensity: 'baja' | 'media' | 'alta';
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({ isOpen, onClose, color: _color }) => {
  const { activeUserId, users } = useCouple();
  const activeRole = activeUserId === users.jose?.user?.id ? 'jose' : 'anto';
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<WorkoutResult | null>(null);

  // Form fields
  const [duration, setDuration] = useState('');
  const [workoutType, setWorkoutType] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const types = ['Fuerza', 'Cardio', 'Deporte', 'Movilidad', 'Otro'];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset
      setMode('ai');
      setDescription('');
      setResult(null);
      setDuration('');
      setWorkoutType(null);
      setNote('');
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
      const data = await analyzeWorkout(description);
      setResult(data);
      // Pre-fill
      setWorkoutType(data.workout_type);
      setDuration(String(data.duration_min));
      setNote(data.summary);
    } catch (e) {
      console.error(e);
      setError('No se pudo analizar. Intentá de nuevo o usá el modo manual.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!activeUserId) return;
    if (mode === 'manual' && (!duration || !workoutType)) return;
    if (mode === 'ai' && !result && !workoutType) return;

    setSaving(true);
    setError('');
    try {
      await addFitnessLog({
        user_id: activeUserId,
        workout_type: workoutType || result?.workout_type || 'Otro',
        duration_min: parseInt(duration) || result?.duration_min || 0,
        notes: note || result?.summary || description
      });

      const dataLogs = await getFitnessLogs(activeUserId, 7);
      const weeklyCount = new Set(dataLogs.logs.map((l: any) => l.logged_at.split('T')[0])).size;
      await autoUpdateGoals(activeUserId, activeRole, 'fitness', weeklyCount);

      setWorkoutType(null);
      setDuration('');
      setNote('');
      setResult(null);
      setDescription('');
      onClose();
    } catch (err: any) {
      setError('No se pudo guardar el entrenamiento');
      console.error(err);
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
              Registrar entreno
            </h2>
            <p style={{ fontSize: '13px', color: '#b08878', marginBottom: '20px' }}>
              ¿Qué hiciste hoy?
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
                  placeholder="ej: hice 4 series de sentadillas con 80kg y 20 minutos de cinta"
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
                    <p style={{ fontWeight: 800, fontSize: '16px', color: '#2d1a0e', marginBottom: '4px' }}>
                      {result.workout_type}
                    </p>
                    <p style={{ fontSize: '13px', color: '#7a4a36', marginBottom: '12px' }}>
                      {result.summary}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div style={{
                        background: '#ffffff', border: '1px solid #e8d5c8',
                        borderRadius: '10px', padding: '8px', textAlign: 'center',
                      }}>
                        <p style={{ fontSize: '9px', color: '#b08878', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Duración</p>
                        <p style={{ fontSize: '18px', fontWeight: 800, color: '#c1603a', margin: 0 }}>{result.duration_min}</p>
                        <p style={{ fontSize: '9px', color: '#b08878', margin: 0 }}>min</p>
                      </div>
                      <div style={{
                        background: '#ffffff', border: '1px solid #e8d5c8',
                        borderRadius: '10px', padding: '8px', textAlign: 'center',
                      }}>
                        <p style={{ fontSize: '9px', color: '#b08878', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Calorías</p>
                        <p style={{ fontSize: '18px', fontWeight: 800, color: '#c1603a', margin: 0 }}>{result.calories_burned}</p>
                        <p style={{ fontSize: '9px', color: '#b08878', margin: 0 }}>kcal est.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Intensidad:</span>
                      <span style={{ 
                        fontSize: '11px', fontWeight: 700, color: '#c1603a', 
                        textTransform: 'capitalize', background: 'rgba(193,96,58,0.08)',
                        padding: '2px 8px', borderRadius: '4px'
                      }}>{result.intensity}</span>
                    </div>

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
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Tipo</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {types.map(opt => (
                      <button
                        key={opt} onClick={() => setWorkoutType(opt)}
                        style={{
                          padding: '8px 16px', borderRadius: '100px',
                          border: `1.5px solid ${workoutType === opt ? '#c1603a' : '#e8d5c8'}`,
                          background: workoutType === opt ? 'rgba(193,96,58,0.08)' : '#ffffff',
                          color: workoutType === opt ? '#c1603a' : '#7a4a36',
                          fontFamily: '"Outfit", sans-serif', fontSize: '12px',
                          fontWeight: workoutType === opt ? 700 : 400, cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Duración (minutos)</label>
                  <input
                    type="number" value={duration} onChange={e => setDuration(e.target.value)}
                    placeholder="ej. 60"
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '1.5px solid #e8d5c8', background: '#fdf6f0',
                      fontFamily: '"Outfit", sans-serif', fontSize: '14px', outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Notas</label>
                  <textarea
                    value={note} onChange={e => setNote(e.target.value)}
                    placeholder="ej. Entrenamiento intenso de piernas"
                    rows={3}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '1.5px solid #e8d5c8', background: '#fdf6f0',
                      fontFamily: '"Outfit", sans-serif', fontSize: '14px', outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            {error && (
              <p style={{ color: '#c1603a', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>{error}</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving || (mode === 'ai' && !result && !workoutType) || (mode === 'manual' && (!duration || !workoutType))}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px',
                background: '#c1603a', color: '#ffffff', border: 'none',
                fontFamily: '"Outfit", sans-serif', fontSize: '16px', fontWeight: 700,
                marginTop: '24px', cursor: 'pointer',
                opacity: (saving || (mode === 'ai' && !result && !workoutType) || (mode === 'manual' && (!duration || !workoutType))) ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Guardando...' : (mode === 'ai' && !result ? 'Analizá primero' : 'Guardar entreno')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
