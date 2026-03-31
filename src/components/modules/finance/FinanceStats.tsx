import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { DonutChart } from '../../ui/DonutChart';
import { UserData } from '../../../types';
import { TrendingUp, TrendingDown, Tag } from 'lucide-react';

interface FinanceStatsProps {
  user: UserData;
}

export const FinanceStats: React.FC<FinanceStatsProps> = ({ user }) => {
  const { metrics, user: profile } = user;
  const { spent, budget, savingsRate, topCategory } = metrics.finance;

  // Compliance badge calculation
  const budgetCompliance = (spent / budget) * 100;
  let complianceStyle = { color: '#34d399', background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)' };
  if (budgetCompliance > 80) complianceStyle = { color: '#f87171', background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)' };
  else if (budgetCompliance > 50) complianceStyle = { color: '#facc15', background: 'rgba(250,204,21,0.1)', borderColor: 'rgba(250,204,21,0.3)' };

  return (
    <GlassCard style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div 
              style={{ width: '40px', height: '40px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: `${profile.color}22`, color: profile.color }}
            >
              {profile.initials}
            </div>
            <h2 style={{ fontSize: '34px', lineHeight: 1, fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#fff' }}>
              Presupuesto
            </h2>
          </div>
          <div style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, border: '1px solid', ...complianceStyle }}>
            {budgetCompliance.toFixed(0)}% Utilizado
          </div>
        </div>
        
        <DonutChart 
          current={spent} 
          max={budget} 
          color={profile.color} 
          label="Gastado (Mensual)"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
         <div style={{ background: 'rgba(15,23,42,0.8)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>Tasa Ahorro</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#fff', fontFamily: '"Playfair Display", serif' }}>{savingsRate}%</span>
              {savingsRate > 20 ? (
                <TrendingUp size={18} color="#34d399" />
              ) : (
                <TrendingDown size={18} color="#f87171" />
              )}
            </div>
         </div>
         
         <div style={{ background: 'rgba(15,23,42,0.8)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>Top Gasto</span>
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginTop: '4px' }}>
               <Tag size={12} color="#f7d97a" />
               <span style={{ fontSize: '10px', fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{topCategory.name} {topCategory.percentage}%</span>
              </div>
          </div>
      </div>
    </GlassCard>
  );
};
