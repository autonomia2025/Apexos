import React from 'react';

interface AvatarRingProps {
  initials: string;
  color: string;
  progress: number;
  size?: number;
}

export const AvatarRing = React.memo(({
  initials,
  color,
  progress,
  size = 64
}: AvatarRingProps) => {
  const strokeWidth = 4;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(progress, 100) / 100) * circ;

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
    }}>
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(193,96,58,0.12)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>

      <div
        style={{
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 700,
          color: color,
          width: size - strokeWidth * 3,
          height: size - strokeWidth * 3,
          backgroundColor: '#ffffff',
          border: `1px solid ${color}33`,
          boxShadow: `inset 0 0 10px ${color}22`,
          fontSize: size * 0.35,
        }}
      >
        {initials}
      </div>
    </div>
  );
});
