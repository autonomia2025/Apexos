import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { UserData } from '../../../types';
import { formatCLP } from '../../../lib/utils';
interface FinanceStatsProps {
  user: UserData;
}

export const FinanceStats: React.FC<FinanceStatsProps> = React.memo(({ user }) => {
  const { metrics, user: profile } = user;
  const budget = profile?.monthlyBudgetCLP || metrics.finance.budget || 500000;
  const { spent, topCategory } = metrics.finance;

  return (
    <GlassCard style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', color: '#b08878', 
          fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', margin: '0 0 4px' }}>
          Gastos este mes
        </p>
        <p style={{ fontSize: '36px', fontWeight: 800,
          color: '#2d1a0e', margin: 0, 
          fontFamily: '"Outfit", sans-serif' }}>
          {formatCLP(spent)}
        </p>
        <p style={{ fontSize: '13px', color: '#b08878', margin: '4px 0 0' }}>
          de {formatCLP(budget)} presupuesto
        </p>
      </div>
      
      {/* Progress bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: '#b08878' }}>
            {Math.round((spent/budget)*100)}% usado
          </span>
          <span style={{ fontSize: '12px', 
            color: spent > budget ? '#c94040' : '#4a9068',
            fontWeight: 700 }}>
            {spent > budget ? 'Sobre presupuesto' : 
              `${formatCLP(budget - spent)} disponible`}
          </span>
        </div>
        <div style={{ height: '8px', background: 'rgba(193,96,58,0.1)',
          borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '4px',
            width: `${Math.min((spent/budget)*100, 100)}%`,
            background: spent > budget ? '#c94040' : profile.color,
            transition: 'width 0.8s ease-out',
          }}/>
        </div>
      </div>
      
      {/* Top category */}
      {topCategory && (
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '12px',
          background: 'rgba(193,96,58,0.05)', borderRadius: '10px' }}>
          <span style={{ fontSize: '13px', color: '#7a4a36' }}>
            Mayor gasto: {topCategory.name}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, 
            color: '#c1603a' }}>
            {formatCLP(topCategory.amount)}
          </span>
        </div>
      )}
    </GlassCard>
  );
});
