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
        style={{
          fontSize: '18px',
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          transform: index + 1 === mood ? 'scale(1.25)' : 'scale(0.9)',
          opacity: index + 1 === mood ? 1 : 0.4,
          filter: index + 1 === mood ? `drop-shadow(0 0 8px ${profile.color}66)` : 'grayscale(1)'
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
      style={{ width: '100%', position: 'relative', height: '100%', display: 'flex' }}
    >
      <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', overflow: 'hidden', position: 'relative', width: '100%', flex: 1 }}>
        {/* Subtle Animated Background Pattern */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            opacity: 0.05,
            pointerEvents: 'none',
            backgroundImage: `radial-gradient(${profile.color} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            animation: 'pan-background 60s linear infinite',
          }}
        />

        {/* Subtle Background glow */}
        <div 
          style={{ position: 'absolute', top: '-96px', right: '-96px', width: '256px', height: '256px', borderRadius: '999px', mixBlendMode: 'screen', filter: 'blur(80px)', opacity: 0.2, pointerEvents: 'none', zIndex: 0, backgroundColor: profile.color }}
        />
        
        {/* Profile Section */}
        <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 10 }}>
          <AvatarRing 
            initials={profile.initials} 
            color={profile.color} 
            progress={metrics.compliance} 
            size={100}
          />
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '30px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', letterSpacing: '0.02em', margin: 0 }}>
              {profile.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px', background: 'rgba(193,96,58,0.08)', padding: '4px 12px', borderRadius: '999px', border: '1px solid rgba(193,96,58,0.15)' }}>
              <Flame size={14} color="#f97316" />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#7a4a36' }}>
                Día {metrics.streak} de racha
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', background: 'rgba(255,255,255,1)', padding: '8px 16px', borderRadius: '16px', border: '1px solid rgba(193,96,58,0.08)', boxShadow: 'inset 0 2px 8px rgba(180, 100, 60, 0.08)' }}>
            {getMoodEmojis(metrics.mood)}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', width: '100%', zIndex: 10, alignContent: 'start' }}>
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
