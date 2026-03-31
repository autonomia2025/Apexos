import React from 'react';

interface MetricPillProps {
  label: string;
  value: string | number;
  highlightColor?: string;
  icon?: React.ReactNode;
}

export const MetricPill: React.FC<MetricPillProps> = ({ label, value, highlightColor, icon }) => {
  return (
    <div className="bg-navy-800/80 rounded-xl p-3 border border-white/5 flex flex-col justify-center relative overflow-hidden group">
      {highlightColor && (
        <div 
          className="absolute top-0 left-0 w-1 h-full opacity-50 transition-opacity group-hover:opacity-100"
          style={{ backgroundColor: highlightColor }}
        />
      )}
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="opacity-70">{icon}</span>}
        <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">{label}</span>
      </div>
      <span className="text-lg font-bold text-white font-display ml-1">{value}</span>
    </div>
  );
};
