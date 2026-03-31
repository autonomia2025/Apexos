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
    <GlassCard style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(193,96,58,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <h2 style={{ fontSize: '34px', lineHeight: 1, fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#2d1a0e' }}>
              Presupuesto
            </h2>
          </div>
          <div style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, border: '1px solid', ...complianceStyle }}>
            {budgetCompliance.toFixed(0)}% Utilizado
          </div>
        </div>

        <DonutChart
          value={spent}
          max={budget}
          color={profile.color}
          label="Gastado"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(193,96,58,0.08)' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e8d5c8', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#b08878', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Tasa Ahorro
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#2d1a0e', fontFamily: '"Outfit", sans-serif' }}>{savingsRate}%</span>
            {savingsRate > 20
              ? <TrendingUp size={18} color="#4a9068" />
              : <TrendingDown size={18} color="#c94040" />
            }
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e8d5c8', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#b08878', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Top Gasto
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(193,96,58,0.08)', border: '1px solid rgba(193,96,58,0.15)', marginTop: '4px' }}>
            <Tag size={12} color="#d4724a" />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {topCategory.name} {topCategory.percentage}%
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
});
