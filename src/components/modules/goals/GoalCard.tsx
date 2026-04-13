import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { useCouple } from '../../../hooks/useCouple';
import { supabase } from '../../../lib/supabase';

interface GoalCardProps {
  goal: any;
  activeUserId: string;
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

export const GoalCard: React.FC<GoalCardProps> = ({ goal, activeUserId }) => {
  const { users } = useCouple();
  const [insight, setInsight] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  
  const isShared = goal.couple_goal;
  const moduleColor = MODULE_COLORS[goal.module] || '#c1603a';
  const target = goal.target_value || 100;
  
  const joseProgressRaw = goal.current_value_jose || 0;
  const antoProgressRaw = goal.current_value_anto || 0;

  const josePercent = target > 0 ? Math.min((joseProgressRaw / target) * 100, 100) : 0;
  const antoPercent = target > 0 ? Math.min((antoProgressRaw / target) * 100, 100) : 0;
  const joseWinning = joseProgressRaw >= antoProgressRaw;
  
  const personalPercent = activeUserId === users.jose?.user?.id ? josePercent : antoPercent;
  const personalProgressRaw = activeUserId === users.jose?.user?.id ? joseProgressRaw : antoProgressRaw;
  const totalSharedProgressRaw = (joseProgressRaw + antoProgressRaw) / 2;

  const isCompleted = goal.status === 'completed';

  const userColor = users.jose?.user?.id === activeUserId ? users.jose?.user?.color : users.anto?.user?.color;

  const evaluateGoalWithAI = async () => {
    setEvaluating(true);
    const activeUser = activeUserId === users.jose?.user?.id ? users.jose?.user : users.anto?.user;
    const role = activeUserId === users.jose?.user?.id ? 'jose' : 'anto';
    
    try {
      const { data } = await supabase.functions.invoke('agent', {
        body: {
          agentType: 'planner',
          userName: activeUser.name,
          contextData: {
            userName: activeUser.name,
            goalTitle: goal.title,
            currentValue: role === 'jose' 
              ? goal.current_value_jose 
              : goal.current_value_anto,
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

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', borderColor: 'rgba(255,255,255,0.12)' }}>
      {isCompleted && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(193,96,58,0.05)', zIndex: 0, pointerEvents: 'none' }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10, width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingRight: '16px', maxWidth: 'calc(100% - 112px)' }}>
           <div style={{ width: 'fit-content', padding: '2px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', border: '1px solid rgba(255,255,255,0.12)', color: moduleColor, backgroundColor: `${moduleColor}15` }}>
             {MODULE_LABELS[goal.module]}
           </div>
           <h3 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', wordBreak: 'break-word', lineHeight: 0.95, fontSize: 'clamp(24px, 6vw, 32px)' }}>
             {goal.title}
           </h3>
           <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
             <Flag size={10} /> {goal.deadline}
           </span>
         </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
          <div style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', border: `1px solid ${isCompleted ? 'rgba(74,222,128,0.5)' : 'rgba(193,96,58,0.15)'}`, background: isCompleted ? 'rgba(74,222,128,0.1)' : 'rgba(193,96,58,0.08)', color: isCompleted ? '#4a9068' : '#7a4a36' }}>
            {isCompleted ? 'Logrado' : 'En Curso'}
          </div>
          {!isCompleted && (
             <span style={{ fontSize: '24px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', lineHeight: 1 }}>
               {isShared ? Math.round(totalSharedProgressRaw) : Math.round(personalProgressRaw)}
               <span style={{ fontSize: '16px', color: '#b08878' }}>/{target}</span>
             </span>
          )}
        </div>
      </div>

      <div style={{ zIndex: 10, width: '100%', marginTop: '8px' }}>
        {isShared ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                  <span style={{ fontWeight: 500, color: '#7a4a36' }}>Jose {joseWinning && '🏆'}</span>
                  <span style={{ color: '#b08878', fontSize: '10px' }}>{josePercent.toFixed(0)}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(45,26,14,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${josePercent}%`, backgroundColor: '#c1603a' }} />
                </div>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                  <span style={{ fontWeight: 500, color: '#7a4a36' }}>Anto {!joseWinning && '🏆'}</span>
                  <span style={{ color: '#b08878', fontSize: '10px' }}>{antoPercent.toFixed(0)}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(45,26,14,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${antoPercent}%`, backgroundColor: '#d4849e' }} />
                </div>
             </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
               <span style={{ color: '#7a4a36', fontSize: '12px' }}>{goal.description || 'Objetivo personal'}</span>
               <span style={{ color: '#b08878', fontSize: '10px' }}>{personalPercent.toFixed(0)}%</span>
             </div>
             <div style={{ width: '100%', height: '8px', background: 'rgba(45,26,14,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${personalPercent}%`, backgroundColor: userColor }} />
             </div>
          </div>
        )}
      </div>

      {!isCompleted && (
        <div style={{ marginTop: '12px', zIndex: 10 }}>
          <button 
            onClick={evaluateGoalWithAI}
            disabled={evaluating}
            style={{ fontSize: '11px', padding: '6px 12px', background: 'transparent', color: '#c1603a', border: '1px solid #c1603a', borderRadius: '100px', cursor: evaluating ? 'not-allowed' : 'pointer' }}
          >
            {evaluating ? 'Evaluando...' : '✦ Evaluar con IA'}
          </button>
          {insight && (
            <p style={{ fontSize: '12px', color: '#c1603a', marginTop: '8px', lineHeight: 1.4, background: 'rgba(193,96,58,0.05)', padding: '10px', borderRadius: '8px' }}>
              {insight}
            </p>
          )}
        </div>
      )}
      </GlassCard>
    </motion.div>
  );
};
