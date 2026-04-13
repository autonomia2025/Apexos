import React, { useMemo } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { DonutChart } from '../../ui/DonutChart';
import { ProgressBar } from '../../ui/ProgressBar';
import { UserData } from '../../../types';

interface NutritionStatsProps {
  user: UserData;
}

export const NutritionStats: React.FC<NutritionStatsProps> = React.memo(({ user }) => {
  if (!user || !user.metrics || !user.metrics.macros) return null;
  const { metrics, user: profile } = user;

  const compliance = useMemo(
    () => Math.round(metrics?.compliance ?? 0),
    [metrics?.compliance]
  );

  return (
    <GlassCard style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(193,96,58,0.1)' }}>
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
            Resumen de Hoy
          </h2>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b08878', marginTop: '2px', fontWeight: 500 }}>
            Nutrición diaria
          </p>
        </div>
      </div>

      {/* Donut Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <DonutChart
          value={metrics?.calories?.consumed ?? 0}
          max={metrics?.calories?.target ?? 2000}
          color={profile.color}
          label="Kcal"
          size={130}
        />
      </div>

      {/* Macros */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
        <h3 style={{ fontSize: '18px', lineHeight: 1, fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', margin: 0 }}>
          Desglose Macros
        </h3>
        <ProgressBar
          label="Proteína"
          current={metrics?.macros?.protein ?? 0}
          max={180}
          color={profile.color}
          unit="g"
        />
        <ProgressBar
          label="Carbos"
          current={metrics?.macros?.carbs ?? 0}
          max={300}
          color={profile.color}
          unit="g"
        />
        <ProgressBar
          label="Grasas"
          current={metrics?.macros?.fat ?? 0}
          max={100}
          color={profile.color}
          unit="g"
        />
      </div>

      {/* Compliance */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(193,96,58,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#7a4a36' }}>
          Cumplimiento Semanal
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#c1603a' }}>{compliance}%</span>
          <span style={{ fontSize: '16px' }}>🔥</span>
        </div>
      </div>
    </GlassCard>
  );
});
