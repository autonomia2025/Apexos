import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { DonutChart } from '../../ui/DonutChart';
import { ProgressBar } from '../../ui/ProgressBar';
import { UserData } from '../../../types';

interface NutritionStatsProps {
  user: UserData;
}

export const NutritionStats: React.FC<NutritionStatsProps> = ({ user }) => {
  const { metrics, user: profile } = user;

  return (
    <GlassCard style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(193,96,58,0.15)' }}>
          <div 
            style={{ width: '40px', height: '40px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', border: '1px solid rgba(193,96,58,0.15)', backgroundColor: `${profile.color}22`, color: profile.color }}
          >
            {profile.initials}
          </div>
          <div>
            <h2 style={{ fontSize: '34px', lineHeight: 1, fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#2d1a0e' }}>Resumen de Hoy</h2>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#b08878', marginTop: '4px' }}>Nutricion diaria</p>
          </div>
        </div>
        
        <DonutChart 
          current={metrics.calories.consumed} 
          max={metrics.calories.target} 
          color={profile.color} 
          label="Kcal Consumidas"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <h3 style={{ fontSize: '34px', lineHeight: 1, fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#2d1a0e' }}>Desglose Macros</h3>
        <ProgressBar 
          label="Proteína" 
          current={metrics.macros.protein} 
          max={180} 
          color={profile.color} 
        />
        <ProgressBar 
          label="Carbos" 
          current={metrics.macros.carbs} 
          max={300} 
          color={profile.color} 
        />
        <ProgressBar 
          label="Grasas" 
          current={metrics.macros.fat} 
          max={100} 
          color={profile.color} 
        />
      </div>
      
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(193,96,58,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#7a4a36' }}>Cumplimiento Semanal</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#c1603a' }}>{metrics.compliance}%</span>
            <span style={{ fontSize: '18px' }}>🔥</span>
          </div>
      </div>
    </GlassCard>
  );
};
