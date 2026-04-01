import React, { useMemo } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { DonutChart } from '../../ui/DonutChart';
import { UserData } from '../../../types';
import { TrendingUp, TrendingDown, Tag } from 'lucide-react';

interface FinanceStatsProps {
  user: UserData;
}

export const FinanceStats: React.FC<FinanceStatsProps> = React.memo(({ user }) => {
  const { metrics, user: profile } = user;
  const { spent, budget, savingsRate, topCategory } = metrics.finance;

  const budgetCompliance = useMemo(
    () => (spent / budget) * 100,
    [spent, budget]
  );

  const complianceStyle = useMemo(() => {
    if (budgetCompliance > 80) return { color: '#c94040', background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)' };
    if (budgetCompliance > 50) return { color: '#d4922a', background: 'rgba(250,204,21,0.1)', borderColor: 'rgba(250,204,21,0.3)' };
    return { color: '#4a9068', background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)' };
  }, [budgetCompliance]);

  return (
    <GlassCard style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(193,96,58,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          <h2 style={{ fontSize: '22px', lineHeight: 1.1, fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', margin: 0 }}>
            Presupuesto
          </h2>
        </div>
        <div style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, border: '1px solid', ...complianceStyle }}>
          {budgetCompliance.toFixed(0)}% Utilizado
        </div>
      </div>

      {/* Donut */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <DonutChart
          value={spent}
          max={budget}
          color={profile.color}
          label="Gastado"
          size={130}
        />
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(193,96,58,0.08)' }}>
        <div style={{ background: '#fdf6f0', borderRadius: '12px', padding: '12px', border: '1px solid rgba(193,96,58,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#b08878', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Tasa Ahorro
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#2d1a0e', fontFamily: '"Outfit", sans-serif' }}>{savingsRate}%</span>
            {savingsRate > 20
              ? <TrendingUp size={16} color="#4a9068" />
              : <TrendingDown size={16} color="#c94040" />
            }
          </div>
        </div>

        <div style={{ background: '#fdf6f0', borderRadius: '12px', padding: '12px', border: '1px solid rgba(193,96,58,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: '#b08878', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Top Gasto
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(193,96,58,0.08)', border: '1px solid rgba(193,96,58,0.12)' }}>
            <Tag size={11} color="#d4724a" />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {topCategory.name} {topCategory.amount ? `$${topCategory.amount}` : `${topCategory.percentage}%`}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
});
