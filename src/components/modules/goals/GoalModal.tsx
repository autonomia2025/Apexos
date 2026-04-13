import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import { GoalType, GoalModule } from '../../../types/goals';
import { addGoal } from '../../../lib/db';
import { useCouple } from '../../../hooks/useCouple';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}

const MODULE_EMOJIS: Record<string, string> = {
  nutrition: '🥗',
  fitness: '💪',
  finance: '💰',
  learning: '📚',
  general: '⭐',
};

const MODULE_LABELS: Record<string, string> = {
  nutrition: 'Nutrición',
  fitness: 'Fitness',
  finance: 'Finanzas',
  learning: 'Aprendizaje',
  general: 'General',
};

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const { activeUserId, users } = useCouple();
  const activeUser = users.jose?.user?.id === activeUserId ? users.jose?.user : users.anto?.user;

  const [step, setStep] = useState(1);
  const [goalType, setGoalType] = useState<GoalType>('personal');
  const [module, setModule] = useState<GoalModule | ''>('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [targetValue, setTargetValue] = useState('');
  const [extraValue, setExtraValue] = useState('');
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [unit, setUnit] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const resetForm = () => {
    setStep(1);
    setGoalType('personal');
    setModule('');
    setSelectedTemplate(null);
    setTargetValue('');
    setExtraValue('');
    setTitle('');
    setDeadline('');
    setUnit('');
    setError('');
  };

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
    } else {
      resetForm();
    }
  }, [isOpen]);

  // Auto-generate title from template
  useEffect(() => {
    if (selectedTemplate?.titleTemplate) {
      let newTitle = selectedTemplate.titleTemplate.replace('{target}', targetValue || '...');
      if (selectedTemplate.extraField) {
        newTitle = newTitle.replace(`{${selectedTemplate.extraField}}`, extraValue || '...');
      }
      setTitle(newTitle);
    }
  }, [selectedTemplate, targetValue, extraValue]);

  const handleSave = async () => {
    if (!activeUserId || !title || !module) return;
    setSaving(true);
    try {
      await addGoal({
        user_id: activeUserId,
        couple_goal: goalType === 'shared',
        module,
        title,
        target_value: parseFloat(targetValue) || 0,
        unit: selectedTemplate?.unit || unit || '',
        deadline: deadline || undefined,
        auto_track: selectedTemplate ? selectedTemplate.track !== 'custom' : false,
        track_metric: selectedTemplate?.track || 'custom',
      });
      resetForm();
      onClose();
    } catch (e) {
      console.error(e);
      setError('No se pudo crear la meta.');
    } finally {
      setSaving(false);
    }
  };

  const labelStyle = { 
    fontSize: '11px', fontWeight: 700, color: '#b08878', 
    textTransform: 'uppercase' as const, letterSpacing: '0.08em', 
    marginBottom: '8px', display: 'block' 
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid #e8d5c8', background: '#fdf6f0',
    fontFamily: '"Outfit", sans-serif', fontSize: '15px',
    color: '#2d1a0e', outline: 'none'
  };

  const templates: Record<string, any[]> = {
    nutrition: [
      { id: 'calorie_goal', label: 'Meta de calorías diarias', desc: 'Consumo diario estable', track: 'calories_daily', unit: 'kcal', targetPlaceholder: '2000', titleTemplate: 'Consumir {target} kcal por día' },
      { id: 'protein_goal', label: 'Meta de proteína diaria', desc: 'Asegurar macros', track: 'protein_daily', unit: 'g', targetPlaceholder: '150', titleTemplate: 'Consumir {target}g de proteína diaria' },
      { id: 'custom_nutrition', label: 'Meta personalizada', desc: 'Definí tu propio objetivo', track: 'custom', unit: '', targetPlaceholder: '', titleTemplate: '' },
    ],
    fitness: [
      { id: 'weekly_workouts', label: 'Entrenar X veces por semana', desc: 'Constancia semanal', track: 'workouts_weekly', unit: 'entrenos', targetPlaceholder: '5', titleTemplate: 'Entrenar {target} veces por semana', targetLabel: '¿Cuántas veces por semana?' },
      { id: 'workout_minutes', label: 'X minutos de entrenamiento', desc: 'Suma de minutos semanal', track: 'workout_minutes', unit: 'minutos', targetPlaceholder: '150', titleTemplate: 'Entrenar {target} minutos por semana', targetLabel: '¿Cuántos minutos semanales?' },
      { id: 'custom_fitness', label: 'Meta personalizada', desc: 'Objetivo específico', track: 'custom', unit: '', targetPlaceholder: '', titleTemplate: '' },
    ],
    finance: [
      { id: 'savings_goal', label: 'Ahorrar X pesos este mes', desc: 'Calculado: ingresos - gastos', track: 'savings_monthly', unit: 'CLP', targetPlaceholder: '200000', titleTemplate: 'Ahorrar {target} este mes', targetLabel: '¿Cuánto querés ahorrar? (CLP)' },
      { id: 'spending_limit', label: 'No gastar más de X', desc: 'Límite máximo de gasto', track: 'spending_monthly', unit: 'CLP', targetPlaceholder: '500000', titleTemplate: 'Gastar máximo {target} este mes', targetLabel: '¿Cuál es tu límite? (CLP)' },
      { id: 'savings_travel', label: 'Ahorrar para un objetivo', desc: 'Ej: para un viaje', track: 'savings_monthly', unit: 'CLP', targetPlaceholder: '1000000', titleTemplate: 'Ahorrar para {objetivo}', targetLabel: '¿Cuánto necesitás?', extraField: 'objetivo' },
      { id: 'custom_finance', label: 'Meta personalizada', desc: 'Otro objetivo financiero', track: 'custom', unit: '', targetPlaceholder: '', titleTemplate: '' },
    ],
    learning: [
      { id: 'study_hours', label: 'Estudiar X horas semanales', desc: 'Tiempo total de estudio', track: 'study_hours_weekly', unit: 'horas', targetPlaceholder: '10', titleTemplate: 'Estudiar {target} horas por semana', targetLabel: '¿Cuántas horas?' },
      { id: 'study_sessions', label: 'X sesiones por semana', desc: 'Frecuencia de estudio', track: 'study_sessions', unit: 'sesiones', targetPlaceholder: '5', titleTemplate: 'Completar {target} sesiones de estudio', targetLabel: '¿Cuántas sesiones?' },
      { id: 'learn_topic', label: 'Completar un curso o libro', desc: 'Avance por tema', track: 'custom', unit: '%', targetPlaceholder: '100', titleTemplate: 'Completar {tema}', extraField: 'tema', targetLabel: 'Valor objetivo' },
      { id: 'custom_learning', label: 'Meta personalizada', desc: 'Otro objetivo de aprendizaje', track: 'custom', unit: '', targetPlaceholder: '', titleTemplate: '' },
    ],
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2d1a0e', marginBottom: '8px' }}>¿Para quién es esta meta?</h3>
            <button onClick={() => { setGoalType('personal'); nextStep(); }}
              style={{ width:'100%', padding:'20px', borderRadius:'16px', border:'1.5px solid #e8d5c8', background:'#fff', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:'16px', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#c1603a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e8d5c8'}
            >
              <div style={{ fontSize:'32px' }}>🎯</div>
              <div>
                <p style={{ fontWeight:800, fontSize:'16px', color:'#2d1a0e', margin:'0 0 4px' }}>Meta personal</p>
                <p style={{ fontSize:'13px', color:'#b08878', margin:0 }}>Solo {activeUser?.name || 'tú'} la trackea</p>
              </div>
            </button>
            <button onClick={() => { setGoalType('shared'); nextStep(); }}
              style={{ width:'100%', padding:'20px', borderRadius:'16px', border:'1.5px solid #e8d5c8', background:'#fff', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:'16px', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#d4849e'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e8d5c8'}
            >
              <div style={{ fontSize:'32px' }}>👫</div>
              <div>
                <p style={{ fontWeight:800, fontSize:'16px', color:'#2d1a0e', margin:'0 0 4px' }}>Meta de pareja</p>
                <p style={{ fontSize:'13px', color:'#b08878', margin:0 }}>Jose y Anto trackean por separado</p>
              </div>
            </button>
          </div>
        );
      case 2:
        const modulesList = [
          { value:'nutrition', emoji:'🥗', label:'Nutrición', desc:'Calorías, proteína...' },
          { value:'fitness', emoji:'💪', label:'Fitness', desc:'Entrenos, minutos...' },
          { value:'finance', emoji:'💰', label:'Finanzas', desc:'Ahorro, presupuesto...' },
          { value:'learning', emoji:'📚', label:'Aprendizaje', desc:'Estudio, sesiones...' },
          { value:'general', emoji:'⭐', label:'General', desc:'Otras metas...' },
        ];
        return (
          <div style={{ display:'flex', flexDirection:'column' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2d1a0e', marginBottom: '16px' }}>¿En qué área de tu vida?</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              {modulesList.map(m => (
                <button key={m.value}
                  onClick={() => { setModule(m.value as GoalModule); if(m.value === 'general') { setStep(3); } else { nextStep(); } }}
                  style={{ padding:'16px', borderRadius:'14px', border:'1.5px solid #e8d5c8', background:'#fff', cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#c1603a'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e8d5c8'}
                >
                  <div style={{ fontSize:'24px', marginBottom:'8px' }}>{m.emoji}</div>
                  <p style={{ fontWeight:700, fontSize:'14px', color:'#2d1a0e', margin:'0 0 2px' }}>{m.label}</p>
                  <p style={{ fontSize:'11px', color:'#b08878', margin:0 }}>{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        if (module === 'general') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2d1a0e' }}>¿Qué querés lograr?</h3>
              <div>
                <label style={labelStyle}>Título de la meta</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Leer 5 libros" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Valor objetivo</label>
                  <input type="number" value={targetValue} onChange={e => setTargetValue(e.target.value)} placeholder="Ej: 5" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Unidad</label>
                  <input type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="Libros" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Fecha límite (opcional)</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} />
              </div>
              <button className="btn-gold" onClick={nextStep} style={{ marginTop: '8px' }}>Siguiente</button>
            </div>
          );
        }
        
        const moduleTemplates = templates[module as string] || [];
        
        if (!selectedTemplate) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2d1a0e', marginBottom: '4px' }}>
                ¿Qué querés lograr en {MODULE_LABELS[module]}?
              </h3>
              {moduleTemplates.map(t => (
                <button key={t.id} onClick={() => setSelectedTemplate(t)}
                  style={{ width:'100%', padding:'16px', borderRadius:'14px', border:'1.5px solid #e8d5c8', background:'#fff', cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#c1603a'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e8d5c8'}
                >
                  <p style={{ fontWeight:700, fontSize:'14px', color:'#2d1a0e', margin:'0 0 4px' }}>{t.label}</p>
                  <p style={{ fontSize:'12px', color:'#b08878', margin:0 }}>{t.desc}</p>
                </button>
              ))}
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button onClick={() => setSelectedTemplate(null)} style={{ background: 'transparent', border: 'none', color: '#b08878', fontSize: '12px', cursor: 'pointer', textAlign: 'left', marginBottom: '-8px' }}>
              ← Cambiar plantilla
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2d1a0e' }}>Configurar meta</h3>
            
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={labelStyle}>{selectedTemplate.targetLabel || 'Valor objetivo'}</label>
                <div style={{ position:'relative' }}>
                  <input type="number" value={targetValue} onChange={e => setTargetValue(e.target.value)} placeholder={selectedTemplate.targetPlaceholder} style={{ ...inputStyle, paddingRight: '60px' }} />
                  <span style={{ position:'absolute', right:'16px', top:'50%', transform:'translateY(-50%)', color:'#b08878', fontWeight:700, fontSize:'13px' }}>
                    {selectedTemplate.unit}
                  </span>
                </div>
              </div>

              {selectedTemplate.extraField && (
                <div>
                  <label style={labelStyle}>¿Cuál es el {selectedTemplate.extraField}?</label>
                  <input type="text" value={extraValue} onChange={e => setExtraValue(e.target.value)} placeholder="Ej: Viaje a Japón" style={inputStyle} />
                </div>
              )}

              <div>
                <label style={labelStyle}>Fecha límite (opcional)</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} min={new Date().toISOString().split('T')[0]} />
              </div>

              <div>
                <label style={labelStyle}>Título (auto-generado)</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
              </div>

              {title && targetValue && (
                <div style={{ padding:'14px', borderRadius:'12px', background:'rgba(193,96,58,0.05)', border:'1px solid rgba(193,96,58,0.15)' }}>
                  <p style={{ fontSize:'11px', color:'#b08878', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 4px' }}>Vista previa</p>
                  <p style={{ fontWeight:800, fontSize:'15px', color:'#2d1a0e', margin:'0 0 4px' }}>{title}</p>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <span style={{ fontSize:'12px', color:'#c1603a', fontWeight:600 }}>Meta: {targetValue} {selectedTemplate.unit}</span>
                    {selectedTemplate.track !== 'custom' && (
                      <span style={{ fontSize:'12px', color:'#4a9068', fontWeight:600 }}>⚡ Auto</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="btn-gold" 
              onClick={nextStep} 
              disabled={!targetValue || !title}
              style={{ opacity: (!targetValue || !title) ? 0.5 : 1 }}
            >
              Siguiente
            </button>
          </div>
        );
      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2d1a0e', marginBottom: '16px' }}>Todo listo</h3>
            <div style={{ padding:'20px', borderRadius:'16px', background:'#fff8f5', border:'1.5px solid rgba(193,96,58,0.2)', marginBottom:'24px' }}>
              <div style={{ fontSize:'32px', marginBottom:'12px', textAlign:'center' }}>{MODULE_EMOJIS[module as string] || '🎯'}</div>
              <table style={{ width:'100%', fontSize:'13px' }}>
                <tbody>
                  {[
                    ['Meta', title],
                    ['Tipo', goalType === 'personal' ? 'Personal 🎯' : 'De pareja 👫'],
                    ['Área', MODULE_LABELS[module as string]],
                    ['Objetivo', `${targetValue} ${selectedTemplate?.unit || unit || ''}`],
                    ['Tracking', (selectedTemplate?.track !== 'custom' && module !== 'general') ? '⚡ Automático' : '✏️ Manual'],
                    deadline && ['Deadline', new Date(deadline + 'T12:00:00').toLocaleDateString('es-CL', { day:'numeric', month:'long', year:'numeric' })],
                  ].filter(Boolean).map(([label, value]) => (
                    <tr key={label as string}>
                      <td style={{ color:'#b08878', padding:'4px 0', fontWeight:600, width:'40%' }}>{label}</td>
                      <td style={{ color:'#2d1a0e', padding:'4px 0', fontWeight:500 }}>{value as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {error && <p style={{ color: '#c1603a', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{error}</p>}

            <button className="btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? 'Creando...' : 'Crear meta ✓'}
            </button>
          </div>
        );
      default:
        return null;
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
           style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(45,26,14,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', borderRadius: '24px', border: '1px solid #e8d5c8', boxShadow: '0 24px 60px rgba(45,26,14,0.2)', padding: '24px', position: 'relative' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(193,96,58,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c1603a' }}>
              <X size={18} />
            </button>

            {/* Stepper Indicator */}
            <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'24px' }}>
              {[1,2,3,4].map(s => (
                <div key={s} style={{ width: s === step ? '24px' : '8px', height:'8px', borderRadius:'100px', background: s <= step ? '#c1603a' : '#e8d5c8', transition:'all 0.3s ease' }} />
              ))}
            </div>

            {step > 1 && (
              <button onClick={prevStep} style={{ background:'transparent', border:'none', color:'#b08878', fontSize:'13px', cursor:'pointer', padding:'0', fontFamily:'"Outfit",sans-serif', marginBottom:'16px', display:'flex', alignItems:'center', gap:'4px' }}>
                <ChevronLeft size={16} /> Volver
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
