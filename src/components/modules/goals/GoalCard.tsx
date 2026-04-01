import React from 'react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { useCouple } from '../../../hooks/useCouple';

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
  
  const isShared = goal.couple_goal;
  const moduleColor = MODULE_COLORS[goal.module] || '#c1603a';
  const target = goal.target_value || 100;
  
  // Real apps would have separate progress tracking for goals. 
  // For now we'll mock progress based on some logic or leave at 0.
  const joseProgress = 0; 
  const antoProgress = 0;
  
  const personalProgress = joseProgress; // Should depend on role
  const totalSharedProgress = (joseProgress + antoProgress) / 2;
  const isCompleted = goal.status === 'completed';

  const userColor = users.jose?.user?.id === activeUserId ? users.jose?.user?.color : users.anto?.user?.color;

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
               {isShared ? Math.round(totalSharedProgress) : Math.round(personalProgress)}%
             </span>
          )}
        </div>
      </div>

      <div style={{ zIndex: 10, width: '100%', marginTop: '8px' }}>
        {isShared ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                  <span style={{ fontWeight: 500, color: '#7a4a36' }}>Jose</span>
                  <span style={{ color: '#b08878', fontSize: '10px' }}>{joseProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(45,26,14,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${joseProgress}%`, backgroundColor: users.jose?.user?.color }} />
                </div>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                  <span style={{ fontWeight: 500, color: '#7a4a36' }}>Anto</span>
                  <span style={{ color: '#b08878', fontSize: '10px' }}>{antoProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(45,26,14,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${antoProgress}%`, backgroundColor: users.anto?.user?.color }} />
                </div>
             </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
               <span style={{ color: '#7a4a36', fontSize: '12px' }}>{goal.description || 'Objetivo personal'}</span>
               <span style={{ color: '#b08878', fontSize: '10px' }}>{personalProgress}% de {target}</span>
             </div>
             <div style={{ width: '100%', height: '8px', background: 'rgba(45,26,14,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${personalProgress}%`, backgroundColor: userColor }} />
             </div>
          </div>
        )}
      </div>
      </GlassCard>
    </motion.div>
  );
};
