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
    setIsLoading(true);
    try {
      const insight = await callAgent(agentType, userName, contextData);
      setMessage(insight);
    } catch (e) {
      setMessage("El agente no está disponible ahora.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Basic caching based on a stringified context signature to avoid re-calls
    // In a broader app, we could persist this in localStorage or a global store.
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentType, userName]);

  return (
    <GlassCard className="agent-card" style={{ marginBottom: '24px', position: 'relative', overflow: 'hidden', borderColor: 'rgba(193,96,58,0.3)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(193,96,58,0.08), transparent, transparent)', pointerEvents: 'none' }} />
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
           <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(247,217,122,0.9)' }}>Insight IA</span>
           <button
              onClick={(e) => { e.stopPropagation(); fetchInsight(); }}
              style={{ padding: '6px', display: 'flex', alignItems: 'center', gap: '4px', color: '#c1603a', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
             <RefreshCw size={12} style={isLoading ? { transform: 'rotate(180deg)' } : undefined} />
             <span>Actualizar</span>
           </button>
         </div>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <span style={{ width: '6px', height: '6px', background: '#c1603a', borderRadius: '999px' }} />
            <span style={{ width: '6px', height: '6px', background: '#c1603a', borderRadius: '999px', opacity: 0.7 }} />
            <span style={{ width: '6px', height: '6px', background: '#c1603a', borderRadius: '999px', opacity: 0.4 }} />
          </div>
        ) : (
          <p style={{ color: 'rgba(229,231,235,1)', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6, marginTop: '4px' }}>
            "{message}"
          </p>
        )}
      </div>
    </GlassCard>
  );
};
