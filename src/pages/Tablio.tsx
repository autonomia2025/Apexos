import { Lock } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { AgentMessage } from '../components/ui/AgentMessage';
import { useCouple } from '../hooks/useCouple';
import { mockTablioData } from '../data/tablioData';
import { BusinessContext } from '../services/agentService';

import { HealthScore } from '../components/modules/tablio/HealthScore';
import { OKRsSection } from '../components/modules/tablio/OKRsSection';
import { RevenueDashboard } from '../components/modules/tablio/RevenueDashboard';
import { ProjectsSection } from '../components/modules/tablio/ProjectsSection';

// Calculate Q1/Q2/Q3/Q4
const getQuarter = () => {
  const month = new Date().getMonth();
  return `Q${Math.floor(month / 3) + 1}`;
};

export const Tablio = () => {
  const { activeUserId } = useCouple();

  // If Anto is active, show lock screen
  if (activeUserId === 'anto') {
    return (
      <PageWrapper>
        <div className="min-h-[70vh] flex items-center justify-center">
          <GlassCard className="p-10 flex flex-col items-center justify-center text-center max-w-sm w-full relative overflow-hidden group border-gold-400/20">
            <div className="absolute inset-0 bg-gold-400/5 blur-xl group-hover:bg-gold-400/10 transition-colors" />
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gold-400/10 border border-gold-400/30 text-gold-400 mb-6 relative z-10 shadow-[0_0_20px_rgba(240,192,64,0.2)]">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-display font-bold text-white relative z-10">
              Este espacio es de Jose <span className="text-gold-400">🔒</span>
            </h2>
            <p className="text-sm font-body text-gray-400 mt-2 relative z-10">
              Módulo de negocio exclusivo.
            </p>
          </GlassCard>
        </div>
      </PageWrapper>
    );
  }

  // Define the context sent to the Business AI agent
  const getBusinessContext = (): BusinessContext => {
    let projectsAtRisk = mockTablioData.projects.filter(p => 
      p.status === 'En pausa' || p.priority === 'Alta' // Simplification
    ).length;

    const topPriorityProject = mockTablioData.projects.find(p => p.priority === 'Alta')?.name || 'Ninguno';

    return {
      mrrActual: mockTablioData.revenue.mrrActual,
      mrrMeta: mockTablioData.revenue.mrrMeta,
      okrCompletion: {
        informatica: mockTablioData.okrs['Informática'].reduce((acc, c) => acc + c.completion, 0) / 2,
        ia: mockTablioData.okrs['Desarrollo IA'].reduce((acc, c) => acc + c.completion, 0) / 2,
        ventas: mockTablioData.okrs['Ventas'].reduce((acc, c) => acc + c.completion, 0) / 2,
        marketing: mockTablioData.okrs['Marketing'].reduce((acc, c) => acc + c.completion, 0) / 2,
      },
      companyHealthScore: mockTablioData.healthScore,
      projectsEnRiesgo: projectsAtRisk,
      topPriority: topPriorityProject
    };
  };

  const todayStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

  return (
    <PageWrapper>
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-gradient-to-b from-navy-900 to-transparent sticky top-0 z-20 py-2">
        <div>
           <h1 className="text-3xl font-display font-bold text-gold-400 tracking-wider">
             TABLIO
           </h1>
           <p className="text-sm font-body text-gray-400 mt-0.5 tracking-wide">
             Tu empresa. Tu visión.
           </p>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-sm text-gray-400 font-mono hidden sm:inline-block">
             {todayStr}
           </span>
           <div className="px-3 py-1 bg-gold-400/10 border border-gold-400/30 text-gold-400 rounded-lg text-sm font-bold tracking-widest uppercase">
             {getQuarter()}
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="space-y-6 md:space-y-8 pb-10">
        
        {/* Agent Insight */}
        <section className="relative">
          <div className="absolute -top-3 left-4 bg-navy-900 px-2 z-10">
            <span className="text-[10px] font-bold text-gold-300 uppercase tracking-widest">
              Advisor IA →
            </span>
          </div>
          <AgentMessage 
            agentType="business"
            userName="Jose"
            color="var(--color-gold-400)" 
            contextData={getBusinessContext()}
          />
        </section>

        {/* Section 1: Health Score */}
        <HealthScore data={mockTablioData} />

        {/* Section 3: Revenue Dashboard */}
        <RevenueDashboard data={mockTablioData.revenue} />

        {/* Section 2: OKRs Trimestrales */}
        <OKRsSection okrs={mockTablioData.okrs} />

        {/* Section 4: Proyectos Activos */}
        <ProjectsSection projects={mockTablioData.projects} />

      </div>
    </PageWrapper>
  );
};
