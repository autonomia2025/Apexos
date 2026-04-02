import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { callAgent, AgentType, AgentContext } from '../../services/agentService';

interface AgentMessageProps {
  agentType: AgentType;
  userName: string;
  contextData: AgentContext;
  color: string;
}

export const AgentMessage: React.FC<AgentMessageProps> = ({ agentType, userName, contextData, color }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInsight = async () => {
    const cacheKey = `agent_${agentType}_${userName}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setMessage(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const insight = await callAgent(agentType, userName, contextData);
      setMessage(insight);
      sessionStorage.setItem(cacheKey, insight);
    } catch (e) {
      setMessage("El agente no está disponible ahora.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInsight();
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentType, userName]);

  return (
    <GlassCard className="agent-card" style={{ marginBottom: '24px', position: 'relative', overflow: 'hidden', background: '#fff8f5', border: '1.5px solid rgba(193,96,58,0.25)' }}>
      {/* Dynamic glow behind the icon */}
      <div style={{ position: 'relative' }}>
        <div 
          style={{ position: 'absolute', inset: 0, filter: 'blur(20px)', opacity: 0.3, borderRadius: '999px', backgroundColor: color }}
        />
        <div 
          className="agent-icon"
          style={{ backgroundColor: `${color}15`, color: color, border: '1px solid rgba(193,96,58,0.15)' }}
        >
          <Bot size={20} />
        </div>
      </div>

      <div className="agent-text" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '40px' }}>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
           <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c1603a' }}>Insight IA</span>
           <button
              onClick={(e) => { e.stopPropagation(); fetchInsight(); }}
              style={{ padding: '6px', display: 'flex', alignItems: 'center', gap: '4px', color: '#c1603a', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
             <RefreshCw size={12} style={isLoading ? { transform: 'rotate(180deg)' } : undefined} />
             <span>Actualizar</span>
           </button>
         </div>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: '7px',
                  height: '7px',
                  background: '#c1603a',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'pulse-dot 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: '#2d1a0e', fontSize: '14px', fontStyle: 'normal', lineHeight: 1.6, marginTop: '4px' }}>
            "{message}"
          </p>
        )}
      </div>
    </GlassCard>
  );
};
