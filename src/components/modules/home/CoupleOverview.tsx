import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Activity, Brain, FlameKindling, Trophy } from 'lucide-react';
import { UserData } from '../../../types';
import { GlassCard } from '../../ui/GlassCard';
import { AvatarRing } from '../../ui/AvatarRing';
import { MetricPill } from '../../ui/MetricPill';

interface CoupleOverviewProps {
  user: UserData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const CoupleOverview: React.FC<CoupleOverviewProps> = ({ user }) => {
  const { user: profile, metrics } = user;

  const getMoodEmojis = (mood: number) => {
    const emojis = ['😫', '🙁', '😐', '🙂', '🤩'];
    return emojis.map((emoji, index) => (
      <span
        key={index}
        className={`text-lg transition-transform ${
          index + 1 === mood
            ? 'scale-125 opacity-100 filter drop-shadow-md'
            : 'scale-90 opacity-40 grayscale'
        }`}
        style={{
          filter: index + 1 === mood ? `drop-shadow(0 0 8px ${profile.color}66)` : undefined
        }}
      >
        {emoji}
      </span>
    ));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full relative h-full flex"
    >
      <GlassCard className="p-6 md:p-8 flex flex-col xl:flex-row gap-8 items-center xl:items-start overflow-hidden relative w-full flex-1">
        {/* Subtle Animated Background Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${profile.color} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            animation: 'pan-background 60s linear infinite',
          }}
        />

        {/* Subtle Background glow */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none z-0"
          style={{ backgroundColor: profile.color }}
        />
        
        {/* Profile Section */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 z-10">
          <AvatarRing 
            initials={profile.initials} 
            color={profile.color} 
            progress={metrics.compliance} 
            size={100}
          />
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-white tracking-wide">
              {profile.name}
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <Flame size={14} className="text-orange-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-300">
                Día {metrics.streak} de racha
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-2 bg-navy-800/80 px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
            {getMoodEmojis(metrics.mood)}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="flex-1 grid grid-cols-2 gap-3 w-full z-10 content-start">
          <motion.div variants={itemVariants}>
            <MetricPill
              icon={<FlameKindling size={16} />}
              label="Kcal / Meta"
              value={`${metrics.calories.consumed} / ${metrics.calories.target}`}
              highlightColor={profile.color}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <MetricPill
              icon={<Activity size={16} />}
              label="Proteína"
              value={`${metrics.macros.protein}g`}
              highlightColor={profile.color}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <MetricPill
              icon={<Trophy size={16} />}
              label="Entrenos"
              value={`${metrics.trainingDays}/5`}
              highlightColor={profile.color}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <MetricPill
              icon={<Brain size={16} />}
              label="Hrs Estudio"
              value={`${metrics.studyHours}h`}
              highlightColor={profile.color}
            />
          </motion.div>
        </div>
      </GlassCard>
      
      <style>{`
        @keyframes pan-background {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}</style>
    </motion.div>
  );
};
