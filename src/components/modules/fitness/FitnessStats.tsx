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
    <GlassCard style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(193,96,58,0.15)' }}>
        <div
          style={{
            width: '40px', height: '40px', borderRadius: '999px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '14px',
            border: '1px solid rgba(193,96,58,0.15)',
            backgroundColor: `${profile.color}22`,
            color: profile.color
          }}
        >
          {profile.initials}
        </div>
        <div>
          <h2 style={{ fontSize: '34px', lineHeight: 1, fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#2d1a0e' }}>
            Actividad
          </h2>
          <p style={{ fontSize: '11px', color: '#b08878', fontFamily: '"Outfit", sans-serif', marginTop: '4px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Estadisticas semanales
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <MetricPill
          icon={<Trophy size={16} />}
          label="Sesiones"
          value={`${metrics.trainingDays}/5`}
          highlightColor={profile.color}
        />
        <MetricPill
          icon={<Footprints size={16} />}
          label="Pasos Hoy"
          value={stepsFormatted}
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
});
