import React from 'react';

interface SkeletonProps {
  lines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={className} style={{ padding: '20px', borderRadius: '16px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
      {/* Background container for shimmer */}
      <div style={{ position: 'absolute', insetInline: 0, top: 0, height: '100%', width: '100%', pointerEvents: 'none' }}>
        <div 
           style={{
             height: '100%',
             width: '100%',
             background: 'linear-gradient(90deg, rgba(240,192,64,0) 0%, rgba(240,192,64,0.05) 50%, rgba(240,192,64,0) 100%)',
             backgroundSize: '200% 100%',
           }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '200px' }}>
          <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', width: '100%' }} />
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', width: '66%' }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 10 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
             key={i} 
             style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', width: `${100 - (i * 15)}%`, opacity: 1 - (i * 0.2) }}
           />
        ))}
      </div>
    </div>
  );
};
