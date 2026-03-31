import React, { useMemo } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { ProgressBar } from '../../ui/ProgressBar';
import { MetricPill } from '../../ui/MetricPill';
import { UserData } from '../../../types';
import { Flame, Library, Target } from 'lucide-react';

interface LearnStatsProps {
  user: UserData;
}

export const LearnStats: React.FC<LearnStatsProps> = React.memo(({ user }) => {
  const { metrics, user: profile } = user;
  const { studyHours, studyStreak, learning } = metrics;
  const { activeTopics, inProgressCount } = learning;

  const visibleTopics = useMemo(
    () => activeTopics.slice(0, 3),
    [activeTopics]
  );

  return (
    <GlassCard style={{ padding: '20px' }}>
      {/* Header */}
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
            Progreso de Estudio
          </h2>
          <p style={{ fontSize: '10px', color: '#b08878', fontFamily: '"Outfit", sans-serif', marginTop: '2px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
            Metas semanales
          </p>
        </div>
      </div>

      {/* Study hours progress */}
      <div style={{ marginBottom: '16px' }}>
        <ProgressBar
          label="Horas de Estudio"
          current={studyHours}
          max={10}
          color={profile.color}
          unit="h"
        />
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <MetricPill
          icon={<Flame size={15} />}
          label="Racha"
          value={`${studyStreak} días`}
          highlightColor={profile.color}
        />
        <MetricPill
          icon={<Library size={15} />}
          label="En Curso"
          value={`${inProgressCount} rec.`}
          highlightColor={profile.color}
        />
      </div>

      {/* Active topics */}
      <div style={{ background: '#fdf6f0', borderRadius: '12px', padding: '14px', border: '1px solid rgba(193,96,58,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Target size={14} color="#b08878" />
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Foco Actual
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {visibleTopics.map((topic, index) => (
            <span
              key={index}
              style={{
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                borderRadius: '6px',
                border: '1px solid',
                color: profile.color,
                backgroundColor: `${profile.color}11`,
                borderColor: `${profile.color}33`,
              }}
            >
              {topic}
            </span>
          ))}
          {activeTopics.length > 3 && (
            <span style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 700, color: '#b08878', background: 'rgba(193,96,58,0.08)', borderRadius: '6px', border: '1px solid rgba(193,96,58,0.15)' }}>
              +{activeTopics.length - 3} MÁS
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
});
