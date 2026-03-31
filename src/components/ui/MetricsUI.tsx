import React from 'react';

/**
 * PURE CSS PROGRESS BAR
 * Memoized to prevent re-renders on parent state changes.
 */
export const ProgressBar = React.memo(({
  value,
  color,
  height = 6
}: {
  value: number;
  color: string;
  height?: number
}) => (
  <div style={{
    height,
    borderRadius: height / 2,
    background: 'rgba(193,96,58,0.1)',
    overflow: 'hidden',
  }}>
    <div style={{
      height: '100%',
      width: `${Math.min(Math.max(value, 0), 100)}%`,
      background: color,
      borderRadius: height / 2,
      transition: 'width 0.6s ease-out',
    }}/>
  </div>
));

/**
 * SVG-BASED AVATAR RING
 * Memoized, no framer-motion — pure CSS transition.
 */
export const AvatarRing = React.memo(({
  initials,
  color,
  size = 72,
  progress = 0
}: {
  initials: string;
  color: string;
  size?: number;
  progress?: number
}) => {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(progress, 100) / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
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
          stroke="rgba(193,96,58,0.12)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: size - 14,
        height: size - 14,
        borderRadius: '50%',
        background: `${color}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: '"Outfit",sans-serif',
          fontWeight: 800,
          fontSize: size * 0.3,
          color,
        }}>
          {initials}
        </span>
      </div>
    </div>
  );
});
