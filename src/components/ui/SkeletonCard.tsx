import React from 'react';

interface SkeletonProps {
  lines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`p-5 rounded-2xl bg-navy-800/50 border border-white/5 relative overflow-hidden ${className}`}>
      {/* Background container for shimmer */}
      <div className="absolute inset-x-0 top-0 h-full w-full pointer-events-none">
        <div 
           className="h-full w-full animate-shimmer"
           style={{
             background: 'linear-gradient(90deg, rgba(240,192,64,0) 0%, rgba(240,192,64,0.05) 50%, rgba(240,192,64,0) 100%)',
             backgroundSize: '200% 100%',
           }}
        />
      </div>
      
      <div className="flex items-center gap-4 mb-4 relative z-10 w-full mb-6">
        <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
        <div className="space-y-2 w-full max-w-[200px]">
          <div className="h-3 bg-white/5 rounded-full w-full" />
          <div className="h-2 bg-white/5 rounded-full w-2/3" />
        </div>
      </div>
      
      <div className="space-y-3 relative z-10">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
             key={i} 
             className="h-2 bg-white/5 rounded-full w-full" 
             style={{ width: `${100 - (i * 15)}%`, opacity: 1 - (i * 0.2) }}
          />
        ))}
      </div>
    </div>
  );
};
