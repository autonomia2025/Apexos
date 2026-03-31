import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { MetricPill } from '../../ui/MetricPill';
import { UserData } from '../../../types';
import { ShieldAlert, Trophy, Zap, Footprints } from 'lucide-react';

interface FitnessStatsProps {
  user: UserData;
}

export const FitnessStats: React.FC<FitnessStatsProps> = ({ user }) => {
  const { metrics, user: profile, recentWorkouts } = user;
  const lastWorkout = recentWorkouts.length > 0 ? recentWorkouts[0] : null;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 w-full mb-6 pb-6 border-b border-white/5">
         <div 
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-white/10"
          style={{ backgroundColor: `${profile.color}22`, color: profile.color }}
        >
          {profile.initials}
        </div>
        <div>
          <h2 className="text-xl font-display font-semibold text-white">
            Actividad
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">ESTADÍSTICAS SEMANALES</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricPill
          icon={<Trophy size={16} />}
          label="Sesiones"
          value={`${metrics.trainingDays}/5`}
          highlightColor={profile.color}
        />
        <MetricPill
          icon={<Footprints size={16} />}
          label="Pasos Hoy"
          value={metrics.steps.toLocaleString('es-ES')}
          highlightColor={profile.color}
        />
        <MetricPill
          icon={<Zap size={16} />}
          label="Racha Activa"
          value={`${metrics.streak} días`}
          highlightColor={profile.color}
        />
        <MetricPill
          icon={<ShieldAlert size={16} />}
          label="Último"
          value={lastWorkout ? lastWorkout.type : 'Ninguno'}
          highlightColor={profile.color}
        />
      </div>
    </GlassCard>
  );
};
