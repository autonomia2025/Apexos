import React from 'react';

interface DonutChartProps {
  value: number;
  max: number;
  color: string;
  size?: number;
  label?: string;
  unit?: string;
}

export const DonutChart = React.memo(({
  value,
  max,
  color,
  size = 120,
  label,
  unit = ''
}: DonutChartProps) => {
  const pct = Math.min((value / max) * 100, 100);
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(193,96,58,0.1)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${offset}`}
          style={{ transition: 'stroke-dashoffset 0.9s ease-out' }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p style={{
          fontFamily: '"Outfit",sans-serif',
          fontWeight: 800,
          fontSize: size * 0.22,
          color: '#2d1a0e',
          lineHeight: 1,
          margin: 0,
        }}>
          {Math.round(value)}
        </p>
        {unit && (
          <p style={{
            fontFamily: '"Outfit",sans-serif',
            fontSize: size * 0.12,
            color: '#b08878',
            fontWeight: 500,
            margin: 0,
            marginTop: '2px',
          }}>
            {unit}
          </p>
        )}
        {label && (
          <p style={{
            fontFamily: '"Outfit",sans-serif',
            fontSize: size * 0.1,
            color: '#b08878',
            fontWeight: 500,
            margin: '4px 0 0',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {label}
          </p>
        )}
      </div>
    </div>
  );
});
