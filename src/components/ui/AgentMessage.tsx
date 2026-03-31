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
    <GlassCard className="p-4 md:p-6 mb-6 flex items-start gap-4 border-gold-400/25 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold-400/8 via-transparent to-transparent pointer-events-none" />
      {/* Dynamic glow behind the icon */}
      <div className="relative">
        <div 
          className="absolute inset-0 blur-xl opacity-30 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/10 relative z-10"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <Bot size={20} className="md:w-6 md:h-6" />
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[40px] md:min-h-[48px]">
         <div className="flex items-center justify-between gap-3 mb-1">
           <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-gold-300/90">Insight IA</span>
           <button
             onClick={(e) => { e.stopPropagation(); fetchInsight(); }}
             className="p-1.5 flex items-center gap-1 text-gold-400 hover:text-gold-300 transition-colors uppercase text-[10px] tracking-widest font-bold"
           >
             <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
             <span className="hidden sm:inline">Actualizar</span>
           </button>
         </div>

        {isLoading ? (
          <div className="flex items-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <p className="text-gray-200 text-sm md:text-base italic leading-relaxed mt-1">
            "{message}"
          </p>
        )}
      </div>
    </GlassCard>
  );
};
