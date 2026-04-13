

interface WeeklyChartProps {
  logs: any[];
  color: string;
  userName: string;
}

export const WeeklyChart = ({ logs, color, userName }: WeeklyChartProps) => {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const today = new Date();
  
  // Get start of current week (Monday)
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(today.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Count workouts per day this week
  const counts = days.map((_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const dayStr = day.toISOString().split('T')[0];
    return logs.filter(l => 
      l.logged_at.split('T')[0] === dayStr
    ).length;
  });

  const maxCount = Math.max(...counts, 1);
  const chartH = 80;
  const barW = 28;
  const gap = 8;
  const totalW = days.length * (barW + gap) - gap;

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e8d5c8',
      borderRadius: '16px',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '12px' }}>
        <p style={{ fontSize: '12px', fontWeight: 700,
          color: '#b08878', textTransform: 'uppercase',
          letterSpacing: '0.08em', margin: 0 }}>
          Semana de {userName}
        </p>
        <p style={{ fontSize: '12px', color: color, 
          fontWeight: 700, margin: 0 }}>
          {counts.reduce((a,b) => a+b, 0)} entrenos
        </p>
      </div>
      <svg width="100%" viewBox={`0 0 ${totalW + 20} ${chartH + 24}`}>
        {days.map((day, i) => {
          const x = i * (barW + gap) + 10;
          const barH = counts[i] > 0 
            ? Math.max((counts[i] / maxCount) * chartH, 12) 
            : 4;
          const y = chartH - barH;
          const isToday = i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
          
          return (
            <g key={i}>
              {/* Background bar */}
              <rect
                x={x} y={0} width={barW} height={chartH}
                rx={6} fill="rgba(193,96,58,0.06)"
              />
              {/* Value bar */}
              <rect
                x={x} y={y} width={barW} height={barH}
                rx={6}
                fill={counts[i] > 0 ? color : 'rgba(193,96,58,0.15)'}
                opacity={isToday ? 1 : 0.7}
              />
              {/* Count label */}
              {counts[i] > 0 && (
                <text
                  x={x + barW/2} y={y - 4}
                  textAnchor="middle"
                  fill={color}
                  fontSize={10}
                  fontWeight={700}
                  fontFamily='"Outfit", sans-serif'
                >
                  {counts[i]}
                </text>
              )}
              {/* Day label */}
              <text
                x={x + barW/2} y={chartH + 16}
                textAnchor="middle"
                fill={isToday ? '#2d1a0e' : '#b08878'}
                fontSize={11}
                fontWeight={isToday ? 700 : 400}
                fontFamily='"Outfit", sans-serif'
              >
                {day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
