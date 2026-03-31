/**
 * PURE CSS PROGRESS BAR
 * 0-100 value implementation with inline width transitions.
 */
export const ProgressBar = ({ 
  value, 
  color, 
  height = 6 
}: { 
  value: number; 
  color: string; 
  height?: number 
}) => (
  <div className="progress-track" style={{ height }}>
    <div
      className="progress-fill"
      style={{ 
        width: `${Math.min(value, 100)}%`, 
        background: color,
        boxShadow: `0 0 10px ${color}33`
      }}
    />
  </div>
);

/**
 * SVG-BASED AVATAR RING
 * Premium circular progress avatar for metric overviews.
 */
export const AvatarRing = ({ 
  initials, 
  color, 
  size = 64, 
  progress = 0 
}: { 
  initials: string; 
  color: string; 
  size?: number; 
  progress?: number 
}) => {
  const r = (size / 2) - 3;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(progress, 100) / 100) * circ;
  
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Circle Track */}
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5"/>
        <circle 
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" 
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      {/* Avatar Center */}
      <div style={{
        position: 'absolute', inset: '5px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(193,96,58,0.08)',
        boxShadow: '0 4px 12px rgba(180, 100, 60, 0.08)'
      }}>
        <span style={{ 
          color, 
          fontSize: Math.round(size * 0.28), 
          fontWeight: 700, 
          fontFamily: '"Outfit", sans-serif',
          letterSpacing: '0.05em'
        }}>
          {initials}
        </span>
      </div>
    </div>
  );
};
