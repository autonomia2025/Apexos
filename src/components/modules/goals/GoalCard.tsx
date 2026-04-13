import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Trophy } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { useCouple } from '../../../hooks/useCouple';
import { supabase } from '../../../lib/supabase';
import { updateGoalProgress } from '../../../lib/db';

interface GoalCardProps {
  goal: any;
  activeRole: 'jose' | 'anto';
  onRefresh?: () => void;
}

const MODULE_COLORS: any = {
  nutrition: '#4a9068',
  fitness: '#c1603a',
  finance: '#c1603a',
  learning: '#d4849e',
  general: '#b08878',
};

const MODULE_LABELS: any = {
  nutrition: 'Nutrición',
  fitness: 'Fitness',
  finance: 'Finanzas',
  learning: 'Aprendizaje',
  general: 'General',
};

export const GoalCard: React.FC<GoalCardProps> = ({ goal, activeRole, onRefresh }) => {
  const { users } = useCouple();
  const [insight, setInsight] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [manualValue, setManualValue] = useState('');
  
  const isShared = goal.couple_goal;
  const moduleColor = MODULE_COLORS[goal.module] || '#c1603a';
  const target = goal.target_value || 100;
  
  const joseProgressRaw = goal.current_value_jose || 0;
  const antoProgressRaw = goal.current_value_anto || 0;

  const josePercent = target > 0 ? Math.min(Math.round((joseProgressRaw / target) * 100), 100) : 0;
  const antoPercent = target > 0 ? Math.min(Math.round((antoProgressRaw / target) * 100), 100) : 0;
  const joseWinning = joseProgressRaw >= antoProgressRaw;
  
  const personalPercent = activeRole === 'jose' ? josePercent : antoPercent;
  const personalProgressRaw = activeRole === 'jose' ? joseProgressRaw : antoProgressRaw;

  const isCompleted = goal.status === 'completed';
  const userColor = activeRole === 'jose' ? users.jose?.user?.color : users.anto?.user?.color;

  const evaluateGoalWithAI = async () => {
    setEvaluating(true);
    const activeUser = activeRole === 'jose' ? users.jose?.user : users.anto?.user;
    
    try {
      const { data } = await supabase.functions.invoke('agent', {
        body: {
          agentType: 'planner',
          userName: activeUser.name,
          contextData: {
            userName: activeUser.name,
            goalTitle: goal.title,
            currentValue: personalProgressRaw,
            targetValue: goal.target_value,
            unit: goal.unit,
            deadline: goal.deadline,
            module: goal.module,
          }
        }
      });
      setInsight(data?.message || 'No se pudo evaluar.');
    } catch {
      setInsight('Error al conectarse a la IA.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleManualUpdate = async () => {
    if (!manualValue) return;
    try {
      await updateGoalProgress(goal.id, activeRole, parseFloat(manualValue));
      setManualValue('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', borderColor: 'rgba(255,255,255,0.12)' }}>
      {isCompleted && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(193,96,58,0.05)', zIndex: 0, pointerEvents: 'none' }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10, width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingRight: '16px', maxWidth: 'calc(100% - 112px)' }}>
           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
             <div style={{ padding: '2px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', border: '1px solid rgba(255,255,255,0.12)', color: moduleColor, backgroundColor: `${moduleColor}15` }}>
               {MODULE_LABELS[goal.module]}
             </div>
             {goal.auto_track && goal.track_metric !== 'custom' && (
               <span style={{ fontSize: '9px', color: '#c1603a', background: 'rgba(193,96,58,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                 ⚡ Auto
               </span>
             )}
           </div>
           <h3 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', wordBreak: 'break-word', lineHeight: 1.1, fontSize: '20px' }}>
             {goal.title}
           </h3>
           <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
             <Flag size={10} /> {goal.deadline}
           </span>
         </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
          <div style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', border: `1px solid ${isCompleted ? 'rgba(74,222,128,0.5)' : 'rgba(193,96,58,0.15)'}`, background: isCompleted ? 'rgba(74,222,128,0.1)' : 'rgba(193,96,58,0.08)', color: isCompleted ? '#4a9068' : '#7a4a36' }}>
            {isCompleted ? 'Logrado' : 'En Curso'}
          </div>
        </div>
      </div>

      <div style={{ zIndex: 10, width: '100%', marginTop: '4px' }}>
        {isShared ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
             {[
               { name: users.jose?.user?.name || 'Jose', value: joseProgressRaw, percent: josePercent, color: '#c1603a', ahead: joseWinning },
               { name: users.anto?.user?.name || 'Anto', value: antoProgressRaw, percent: antoPercent, color: '#d4849e', ahead: !joseWinning },
             ].map(u => (
               <div key={u.name}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px', marginBottom: '6px' }}>
                   <span style={{ fontWeight: 700, color: u.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {u.ahead && <Trophy size={12} />} {u.name}
                   </span>
                   <span style={{ color: '#b08878' }}>
                     {u.value} <span style={{ fontSize: '10px' }}>/ {target} {goal.unit}</span>
                     <span style={{ marginLeft: '8px', fontWeight: 800, color: u.color }}>{u.percent}%</span>
                   </span>
                 </div>
                 <div style={{ width: '100%', height: '6px', background: `${u.color}15`, borderRadius: '999px', overflow: 'hidden' }}>
                   <div style={{ height: '100%', width: `${u.percent}%`, backgroundColor: u.color, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                 </div>
               </div>
             ))}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '12px', color: '#b08878' }}>
                {personalProgressRaw} / {target} {goal.unit}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: userColor }}>
                {personalPercent}%
              </span>
            </div>
            <div style={{ height: '8px', background: 'rgba(45,26,14,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${personalPercent}%`, backgroundColor: userColor, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
          </div>
        )}
      </div>

      {!isCompleted && !goal.auto_track && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', zIndex: 10 }}>
          <input
            type="number"
            placeholder="Nuevo valor..."
            value={manualValue}
            onChange={e => setManualValue(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', border: '1px solid #e8d5c8', background: '#fdf6f0', fontSize: '14px', outline: 'none' }}
          />
          <button
            onClick={handleManualUpdate}
            style={{ padding: '8px 16px', borderRadius: '10px', background: '#c1603a', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            Actualizar
          </button>
        </div>
      )}

      <div style={{ marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap', zIndex: 10 }}>
        {!isCompleted && (
          <button 
            onClick={evaluateGoalWithAI}
            disabled={evaluating}
            style={{ fontSize: '11px', padding: '6px 12px', background: 'transparent', color: '#c1603a', border: '1px solid #c1603a', borderRadius: '100px', cursor: evaluating ? 'not-allowed' : 'pointer' }}
          >
            {evaluating ? 'Evaluando...' : '✦ Analítica IA'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {insight && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <p style={{ fontSize: '12px', color: '#c1603a', margin: '4px 0 0', lineHeight: 1.4, background: 'rgba(193,96,58,0.05)', padding: '10px', borderRadius: '8px' }}>
              {insight}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
};

