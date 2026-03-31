import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  color: string;
  showValue?: boolean;
  unit?: string;
}

export const ProgressBar = React.memo(({
  label,
  current,
  max,
  color,
  showValue = true,
  unit,
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  // Smart unit detection: uses provided unit, or infers from context
  const displayUnit = unit ?? '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: '"Outfit", sans-serif',
            color: '#2d1a0e'
          }}>
            {current} <span style={{ color: '#b08878', fontWeight: 400 }}>/ {max}{displayUnit}</span>
          </span>
        )}
      </div>

      <div style={{
        height: '8px',
        width: '100%',
        background: 'rgba(193,96,58,0.08)',
        borderRadius: '999px',
        overflow: 'hidden',
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
    </div>
  );
});
