import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { ProgressBar } from '../../ui/ProgressBar';
import { MetricPill } from '../../ui/MetricPill';
import { UserData } from '../../../types';
import { Flame, Library, Target } from 'lucide-react';

interface LearnStatsProps {
  user: UserData;
}

export const LearnStats: React.FC<LearnStatsProps> = ({ user }) => {
  const { metrics, user: profile } = user;
  const { studyHours, studyStreak, learning } = metrics;
  const { activeTopics, inProgressCount } = learning;

  return (
    <GlassCard style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(193,96,58,0.15)' }}>
         <div 
          style={{ width: '40px', height: '40px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', border: '1px solid rgba(193,96,58,0.15)', backgroundColor: `${profile.color}22`, color: profile.color }}
        >
          {profile.initials}
        </div>
        <div>
          <h2 style={{ fontSize: '34px', lineHeight: 1, fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#2d1a0e' }}>
            Progreso de Estudio
          </h2>
          <p style={{ fontSize: '11px', color: '#b08878', fontFamily: '"Outfit", sans-serif', marginTop: '4px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Metas semanales</p>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <ProgressBar 
          label="Horas de Estudio" 
          current={studyHours} 
          max={10} // Mock target
          color={profile.color} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <MetricPill
          icon={<Flame size={16} />}
          label="Racha"
          value={`${studyStreak} días`}
          highlightColor={profile.color}
        />
        <MetricPill
          icon={<Library size={16} />}
          label="En Curso"
          value={`${inProgressCount} rec.`}
          highlightColor={profile.color}
        />
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e8d5c8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Target size={16} color="#b08878" />
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Foco Actual</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
           {activeTopics.slice(0, 3).map((topic, index) => (
              <span 
               key={index} 
               style={{
                 padding: '4px 10px',
                 fontSize: '10px',
                 fontWeight: 700,
                 textTransform: 'uppercase',
                 letterSpacing: '0.08em',
                 borderRadius: '6px',
                 border: '1px solid',
                 color: profile.color,
                 backgroundColor: `${profile.color}11`,
                 borderColor: `${profile.color}33`
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
};
