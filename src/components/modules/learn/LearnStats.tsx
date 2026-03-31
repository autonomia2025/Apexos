import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { ProgressBar } from '../../ui/ProgressBar';
import { MetricPill } from '../../ui/MetricPill';
import { UserData } from '../../../types';
import { BookOpen, Flame, Library, Target } from 'lucide-react';

interface LearnStatsProps {
  user: UserData;
}

export const LearnStats: React.FC<LearnStatsProps> = ({ user }) => {
  const { metrics, user: profile } = user;
  const { studyHours, studyStreak, learning } = metrics;
  const { activeTopics, inProgressCount } = learning;

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
            Progreso de Estudio
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">METAS SEMANALES</p>
        </div>
      </div>

      <div className="mb-6">
        <ProgressBar 
          label="Horas de Estudio" 
          current={studyHours} 
          max={10} // Mock target
          color={profile.color} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
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

      <div className="bg-navy-800/80 rounded-xl p-4 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Foco Actual</span>
        </div>
        <div className="flex flex-wrap gap-2">
           {activeTopics.slice(0, 3).map((topic, index) => (
             <span 
              key={index} 
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border"
              style={{
                color: profile.color,
                backgroundColor: `${profile.color}11`,
                borderColor: `${profile.color}33`
              }}
             >
               {topic}
             </span>
           ))}
           {activeTopics.length > 3 && (
             <span className="px-2.5 py-1 text-[10px] font-bold text-gray-400 bg-white/5 rounded-md border border-white/10">
               +{activeTopics.length - 3} MÁS
             </span>
           )}
        </div>
      </div>
    </GlassCard>
  );
};
