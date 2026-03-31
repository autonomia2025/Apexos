import React from 'react';

interface MetricPillProps {
  label: string;
  value: string | number;
  highlightColor?: string;
  icon?: React.ReactNode;
}

export const MetricPill: React.FC<MetricPillProps> = ({ label, value, highlightColor, icon }) => {
  return (
    <div className="metric-pill" style={{ position: 'relative', overflow: 'hidden', boxShadow: '0 8px 18px rgba(0,0,0,0.18)' }}>
      {highlightColor && (
        <div 
          style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', opacity: 0.6, backgroundColor: highlightColor }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        {icon && <span style={{ opacity: 0.8, color: '#f0c040' }}>{icon}</span>}
        <span className="label">{label}</span>
      </div>
      <span className="value" style={{ marginLeft: '4px' }}>{value}</span>
    </div>
  );
};
