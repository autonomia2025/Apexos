import React, { useMemo } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { MetricPill } from '../../ui/MetricPill';
import { UserData } from '../../../types';
import { ShieldAlert, Trophy, Zap, Footprints } from 'lucide-react';

interface FitnessStatsProps {
  user: UserData;
}

export const FitnessStats: React.FC<FitnessStatsProps> = React.memo(({ user }) => {
  const { metrics, user: profile, recentWorkouts } = user;

  const lastWorkout = useMemo(
    () => recentWorkouts.length > 0 ? recentWorkouts[0] : null,
    [recentWorkouts]
  );

  const stepsFormatted = useMemo(
    () => metrics.steps.toLocaleString('es-ES'),
    [metrics.steps]
  );

  return (
    <GlassCard style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(193,96,58,0.1)' }}>
        <div
          style={{
            width: '36px', height: '36px', borderRadius: '999px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '13px',
            border: '1px solid rgba(193,96,58,0.15)',
            backgroundColor: `${profile.color}22`,
            color: profile.color
          }}
        >
          {profile.initials}
        </div>
        <div>
          <h2 style={{ fontSize: '22px', lineHeight: 1.1, fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', margin: 0 }}>
            Actividad
          </h2>
          <p style={{ fontSize: '10px', color: '#b08878', fontFamily: '"Outfit", sans-serif', marginTop: '2px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
            Estadísticas semanales
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <MetricPill
          icon={<Trophy size={15} />}
          label="Sesiones"
          value={`${metrics.trainingDays}/5`}
          highlightColor={profile.color}
        />
        <MetricPill
          icon={<Footprints size={15} />}
          label="Pasos Hoy"
          value={stepsFormatted}
          highlightColor={profile.color}
        />
        <MetricPill
          icon={<Zap size={15} />}
          label="Racha Activa"
          value={`${metrics.streak} días`}
          highlightColor={profile.color}
        />
        <MetricPill
          icon={<ShieldAlert size={15} />}
          label="Último"
          value={lastWorkout ? lastWorkout.type : 'Ninguno'}
          highlightColor={profile.color}
        />
      </div>
    </GlassCard>
  );
});
