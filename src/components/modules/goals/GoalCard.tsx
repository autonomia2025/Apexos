import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flag } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { Goal } from '../../../types/goals';
import { useCouple } from '../../../hooks/useCouple';

interface GoalCardProps {
  goal: Goal;
  activeUserId: 'jose' | 'anto'; // Needed for personal goals styling
}

const MODULE_COLORS = {
  nutrition: '#4a9068', // green-400
  fitness: '#c1603a',   // blue-400
  finance: '#c1603a',   // gold-400
  learning: '#d4849e',  // purple-400
  general: '#b08878',   // gray-400
};

const MODULE_LABELS = {
  nutrition: 'Nutrición',
  fitness: 'Fitness',
  finance: 'Finanzas',
  learning: 'Aprendizaje',
  general: 'General',
};

export const GoalCard: React.FC<GoalCardProps> = ({ goal, activeUserId }) => {
  const { users } = useCouple();
  
  const isShared = goal.type === 'shared';
  const moduleColor = MODULE_COLORS[goal.module];

  // Personal Progress calculation
  const personalProgress = 
    activeUserId === 'jose' 
      ? Math.min((goal.currentValueJose / goal.targetValue) * 100, 100)
      : Math.min((goal.currentValueAnto / goal.targetValue) * 100, 100);

  // Shared Progress calculation
  const joseProgress = Math.min((goal.currentValueJose / goal.targetValue) * 100, 100);
  const antoProgress = Math.min((goal.currentValueAnto / goal.targetValue) * 100, 100);
  
  const totalSharedProgress = (joseProgress + antoProgress) / 2;
  const isCompleted = isShared ? totalSharedProgress === 100 : personalProgress === 100;

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', borderColor: 'rgba(255,255,255,0.12)' }}>
      {/* Background glow if completed */}
      {isCompleted && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(193,96,58,0.05)', zIndex: 0, pointerEvents: 'none' }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10, width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingRight: '16px', maxWidth: 'calc(100% - 112px)' }}>
           {/* Module Chip */}
           <div 
             style={{ width: 'fit-content', padding: '2px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', border: '1px solid rgba(255,255,255,0.12)', color: moduleColor, backgroundColor: `${moduleColor}15` }}
            >
             {MODULE_LABELS[goal.module]}
           </div>
           <h3 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', wordBreak: 'break-word', lineHeight: 0.95, fontSize: 'clamp(28px, 7vw, 38px)' }}>
             {goal.title}
           </h3>
           <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
             <Flag size={10} /> {goal.deadline}
           </span>
         </div>
        
        {/* Status Badge / % complete */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
          <div 
             style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', border: `1px solid ${isCompleted ? 'rgba(193,96,58,0.5)' : goal.status === 'active' ? 'rgba(193,96,58,0.15)' : 'rgba(248,113,113,0.3)'}`, background: isCompleted ? 'rgba(193,96,58,0.2)' : goal.status === 'active' ? 'rgba(193,96,58,0.08)' : 'rgba(248,113,113,0.1)', color: isCompleted ? '#d4724a' : goal.status === 'active' ? '#7a4a36' : '#fca5a5' }}
          >
            {isCompleted ? 'Logrado' : goal.status === 'active' ? 'En Curso' : 'En Pausa'}
          </div>
          {!isCompleted && (
             <span style={{ fontSize: '30px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', lineHeight: 1 }}>
               {isShared ? Math.round(totalSharedProgress) : Math.round(personalProgress)}%
             </span>
          )}
        </div>
      </div>

      {/* Progress Bars */}
      <div style={{ zIndex: 10, width: '100%', marginTop: '8px' }}>
        {isShared ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             {/* Jose's Bar */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                  <span style={{ fontWeight: 500, color: '#7a4a36', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Jose {joseProgress > antoProgress && <Trophy size={12} color="#c1603a" />}
                  </span>
                  <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '10px' }}>
                    {goal.currentValueJose} / {goal.targetValue} {goal.unit}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(193,96,58,0.1)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(193,96,58,0.08)' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${joseProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: '999px', backgroundColor: users.jose.user.color }}
                  />
                </div>
             </div>
             {/* Anto's Bar */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                  <span style={{ fontWeight: 500, color: '#7a4a36', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Anto {antoProgress > joseProgress && <Trophy size={12} color="#c1603a" />}
                  </span>
                  <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '10px' }}>
                    {goal.currentValueAnto} / {goal.targetValue} {goal.unit}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(193,96,58,0.1)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(193,96,58,0.08)' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${antoProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    style={{ height: '100%', borderRadius: '999px', backgroundColor: users.anto.user.color }}
                  />
                </div>
             </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
               <span style={{ color: '#7a4a36', fontSize: '12px' }}>{goal.description}</span>
               <span style={{ color: '#b08878', fontFamily: '"Outfit", sans-serif', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                 {activeUserId === 'jose' ? goal.currentValueJose : goal.currentValueAnto} / {goal.targetValue} {goal.unit}
               </span>
             </div>
             <div style={{ width: '100%', height: '8px', background: 'rgba(193,96,58,0.1)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(193,96,58,0.08)' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${personalProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ 
                     height: '100%',
                     borderRadius: '999px',
                     backgroundImage: `linear-gradient(90deg, ${users[activeUserId].user.color}88, ${users[activeUserId].user.color})`
                   }}
                 />
             </div>
          </div>
        )}
      </div>

      </GlassCard>
    </motion.div>
  );
};
