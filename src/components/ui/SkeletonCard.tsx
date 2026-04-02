

export const SkeletonCard = () => (
  <div style={{
    background: '#ffffff',
    border: '1px solid #e8d5c8',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }}>
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'linear-gradient(90deg, #f0e4da 25%, #fdf6f0 50%, #f0e4da 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{
          height: '18px', borderRadius: '6px', width: '60%',
          background: 'linear-gradient(90deg, #f0e4da 25%, #fdf6f0 50%, #f0e4da 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}/>
        <div style={{
          height: '12px', borderRadius: '4px', width: '40%',
          background: 'linear-gradient(90deg, #f0e4da 25%, #fdf6f0 50%, #f0e4da 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite 0.2s',
        }}/>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      {[0,1].map(i => (
        <div key={i} style={{
          height: '64px', borderRadius: '14px',
          background: 'linear-gradient(90deg, #f0e4da 25%, #fdf6f0 50%, #f0e4da 75%)',
          backgroundSize: '200% 100%',
          animation: `shimmer 1.5s infinite ${i * 0.1}s`,
        }}/>
      ))}
    </div>
  </div>
);
