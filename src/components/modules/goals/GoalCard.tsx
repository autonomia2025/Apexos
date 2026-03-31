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
  nutrition: '#4ade80', // green-400
  fitness: '#60a5fa',   // blue-400
  finance: '#f0c040',   // gold-400
  learning: '#c084fc',  // purple-400
  general: '#9ca3af',   // gray-400
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
      <GlassCard className="p-5 flex flex-col gap-4 relative overflow-hidden group border-white/12">
      {/* Background glow if completed */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gold-400/5 z-0 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex justify-between items-start z-10 w-full">
        <div className="flex flex-col gap-1.5 min-w-0 pr-4" style={{ maxWidth: 'calc(100% - 112px)' }}>
           {/* Module Chip */}
           <div 
             className="w-fit px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border border-white/12"
             style={{ color: moduleColor, backgroundColor: `${moduleColor}15` }}
           >
             {MODULE_LABELS[goal.module]}
           </div>
           <h3 className="font-display font-bold text-white break-words leading-[0.95]" style={{ fontSize: 'clamp(28px, 7vw, 38px)' }}>
             {goal.title}
           </h3>
           <span className="text-gray-400 font-mono text-xs flex items-center gap-1 uppercase tracking-[0.08em]">
             <Flag size={10} /> {goal.deadline}
           </span>
        </div>
        
        {/* Status Badge / % complete */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div 
             className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
               isCompleted ? 'bg-gold-400/20 text-gold-300 border-gold-400/50' :
               goal.status === 'active' ? 'bg-white/5 text-gray-300 border-white/10' :
               'bg-red-400/10 text-red-300 border-red-400/30'
             }`}
          >
            {isCompleted ? 'Logrado' : goal.status === 'active' ? 'En Curso' : 'En Pausa'}
          </div>
          {!isCompleted && (
             <span className="text-3xl font-display font-bold text-white leading-none">
               {isShared ? Math.round(totalSharedProgress) : Math.round(personalProgress)}%
             </span>
          )}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="z-10 w-full mt-2">
        {isShared ? (
          <div className="space-y-3">
             {/* Jose's Bar */}
             <div className="space-y-1">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-medium text-gray-300 flex items-center gap-1">
                    Jose {joseProgress > antoProgress && <Trophy size={12} className="text-gold-400" />}
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">
                    {goal.currentValueJose} / {goal.targetValue} {goal.unit}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-navy-800 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${joseProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: users.jose.user.color }}
                  />
                </div>
             </div>
             {/* Anto's Bar */}
             <div className="space-y-1">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-medium text-gray-300 flex items-center gap-1">
                    Anto {antoProgress > joseProgress && <Trophy size={12} className="text-gold-400" />}
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">
                    {goal.currentValueAnto} / {goal.targetValue} {goal.unit}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-navy-800 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${antoProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: users.anto.user.color }}
                  />
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-1">
             <div className="flex justify-between items-end mb-1.5">
               <span className="text-gray-300 text-xs">{goal.description}</span>
               <span className="text-gray-400 font-mono text-[10px] whitespace-nowrap ml-2">
                 {activeUserId === 'jose' ? goal.currentValueJose : goal.currentValueAnto} / {goal.targetValue} {goal.unit}
               </span>
             </div>
             <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${personalProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r"
                  style={{ 
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
