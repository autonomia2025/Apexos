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
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GlassCard style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '384px', width: '100%', position: 'relative', overflow: 'hidden', borderColor: 'rgba(193,96,58,0.2)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(193,96,58,0.05)', filter: 'blur(24px)' }} />
            <div style={{ width: '64px', height: '64px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(193,96,58,0.1)', border: '1px solid rgba(193,96,58,0.3)', color: '#c1603a', marginBottom: '24px', position: 'relative', zIndex: 10, boxShadow: '0 0 20px rgba(193,96,58,0.2)' }}>
              <Lock size={32} />
            </div>
            <h2 style={{ fontSize: '20px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', position: 'relative', zIndex: 10 }}>
              Este espacio es de Jose <span style={{ color: '#c1603a' }}>🔒</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#b08878', marginTop: '8px', position: 'relative', zIndex: 10 }}>
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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', background: '#fdf6f0', position: 'sticky', top: 0, zIndex: 20, padding: '8px 0' }}>
        <div>
           <h1 style={{ fontSize: '26px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#c1603a', letterSpacing: '0.04em' }}>
             TABLIO
           </h1>
           <p style={{ fontSize: '14px', color: '#b08878', marginTop: '2px', letterSpacing: '0.02em' }}>
             Tu empresa. Tu visión.
           </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <span style={{ fontSize: '14px', color: '#b08878', fontFamily: '"Outfit", sans-serif' }}>
             {todayStr}
           </span>
           <div style={{ padding: '4px 12px', background: 'rgba(193,96,58,0.1)', border: '1px solid rgba(193,96,58,0.3)', color: '#c1603a', borderRadius: '8px', fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
             {getQuarter()}
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '40px' }}>
        
        {/* Agent Insight */}
        <section style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '16px', background: '#ffffff', padding: '0 8px', zIndex: 10 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#d4724a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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
