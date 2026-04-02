import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { AgentMessage } from '../components/ui/AgentMessage';
import { useCouple } from '../hooks/useCouple';
import { getTablioDashboard } from '../lib/db';
import { BusinessContext } from '../services/agentService';

import { HealthScore } from '../components/modules/tablio/HealthScore';
import { OKRsSection } from '../components/modules/tablio/OKRsSection';
import { RevenueDashboard } from '../components/modules/tablio/RevenueDashboard';
import { ProjectsSection } from '../components/modules/tablio/ProjectsSection';
import { RevenueData, Department, Objective } from '../types/tablio';

const getQuarter = () => {
  const month = new Date().getMonth();
  return `Q${Math.floor(month / 3) + 1}`;
};

export const Tablio = () => {
  const { activeUserId, users } = useCouple();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isJose = activeUserId 
    && users.jose?.user?.id 
    && users.jose.user.id === activeUserId;

  useEffect(() => {
    if (!isJose || !activeUserId) return;
    const fetchData = async () => {
      try {
        const data = await getTablioDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Error loading Tablio data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeUserId, isJose]);

  if (!activeUserId || !users.jose?.user?.id) {
    return (
      <PageWrapper>
        <div style={{ padding: '40px', textAlign: 'center', color: '#b08878' }}>
          Cargando...
        </div>
      </PageWrapper>
    );
  }

  if (!isJose) {
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

  if (loading || !dashboardData) {
    return <PageWrapper><div style={{ padding: '40px', textAlign: 'center', color: '#b08878' }}>Cargando datos estratégicos...</div></PageWrapper>;
  }

  const getBusinessContext = (): BusinessContext => {
    const projects = dashboardData?.projects || [];
    const revenueArray = dashboardData?.revenue || [];
    
    const atRisk = projects.filter((p: any) => 
      p.status === 'En riesgo' || p.priority === 'Alta'
    ).length || 0;
    
    const topProj = projects.find((p: any) => 
      p.priority === 'Alta'
    )?.name || 'Consolidación';
    
    const mrrActual = revenueArray.reduce((sum: number, r: any) => 
        sum + Number(r.amount), 0) || 0;

    return {
      mrrActual,
      mrrMeta: 2000,
      okrCompletion: { informatica: 85, ia: 70, ventas: 45, marketing: 60 },
      companyHealthScore: 92,
      projectsEnRiesgo: atRisk,
      topPriority: topProj,
    };
  };

  const transformRevenueData = (): RevenueData => {
    const revenueArray = dashboardData?.revenue || [];
    
    // History (last 6 unique months)
    const historyMap: Record<string, number> = {};
    revenueArray.forEach((r: any) => {
      const key = `${r.month} ${r.year}`;
      historyMap[key] = (historyMap[key] || 0) + Number(r.amount);
    });
    
    const history = Object.entries(historyMap).map(([month, value]) => ({ month, value })).slice(-6);

    // By Venture
    const ventureMap: Record<string, number> = {};
    revenueArray.forEach((r: any) => {
      ventureMap[r.venture] = (ventureMap[r.venture] || 0) + Number(r.amount);
    });
    
    const mrrActual = getBusinessContext().mrrActual;
    const byVenture = Object.entries(ventureMap).map(([venture, amount]) => ({
      venture,
      amount,
      percentage: mrrActual > 0 ? Math.round((amount / mrrActual) * 100) : 0
    }));

    return {
      mrrActual,
      mrrMeta: 2000,
      history,
      byVenture
    };
  };

  const transformOKRs = (): Record<Department, Objective[]> => {
    const okrsArray = dashboardData?.okrs || [];
    const grouped: Record<string, Objective[]> = {
      'Informática': [],
      'Desarrollo IA': [],
      'Ventas': [],
      'Marketing': []
    };

    okrsArray.forEach((o: any) => {
      if (grouped[o.department]) {
        grouped[o.department].push({
          id: o.id,
          title: o.title,
          completion: o.completion || 0,
          keyResults: o.tablio_key_results || []
        });
      }
    });

    return grouped as Record<Department, Objective[]>;
  };

  const todayStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

  return (
    <PageWrapper>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '40px' }}>
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

        <HealthScore data={dashboardData} />
        <RevenueDashboard data={transformRevenueData()} />
        <OKRsSection okrs={transformOKRs()} />
        <ProjectsSection projects={dashboardData.projects || []} />
      </div>
    </PageWrapper>
  );
};
