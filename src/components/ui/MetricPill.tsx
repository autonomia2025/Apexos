import React from 'react';

interface MetricPillProps {
  label: string;
  value: string | number;
  highlightColor?: string;
  icon?: React.ReactNode;
}

export const MetricPill: React.FC<MetricPillProps> = ({ label, value, highlightColor, icon }) => {
  return (
    <div className="metric-pill" style={{ position: 'relative', overflow: 'hidden' }}>
      {highlightColor && (
        <div 
          style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', opacity: 0.5, backgroundColor: highlightColor, borderRadius: '0 3px 3px 0' }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        {icon && <span style={{ opacity: 0.7, color: '#c1603a', display: 'flex' }}>{icon}</span>}
        <span className="label">{label}</span>
      </div>
      <span className="value" style={{ marginLeft: '2px' }}>{value}</span>
    </div>
  );
};
