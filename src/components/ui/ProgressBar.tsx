import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  color: string;
  showValue?: boolean;
}

export const ProgressBar = React.memo(({
  label,
  current,
  max,
  color,
  showValue = true
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#7a4a36',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {label}
        </span>
        {showValue && (
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            fontFamily: '"Outfit", sans-serif',
            color: '#2d1a0e'
          }}>
            {current} <span style={{ color: '#b08878', fontWeight: 400 }}>/ {max}g</span>
          </span>
        )}
      </div>

      <div style={{
        height: '10px',
        width: '100%',
        background: 'rgba(193,96,58,0.1)',
        borderRadius: '999px',
        overflow: 'hidden',
        border: '1px solid rgba(193,96,58,0.15)',
        boxShadow: 'inset 0 1px 2px rgba(180, 100, 60, 0.08)',
      }}>
        <div
          style={{
            height: '100%',
            borderRadius: '999px',
            backgroundColor: color,
            width: `${percentage}%`,
            transition: 'width 0.8s ease-out',
          }}
        />
      </div>
      <span style={{
        fontSize: '10px',
        fontWeight: 500,
        color: '#b08878',
        textAlign: 'right'
      }}>
        {Math.round(percentage)}% completado
      </span>
    </div>
  );
});
