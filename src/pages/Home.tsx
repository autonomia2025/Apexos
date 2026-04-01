import React, { useState, useEffect } from 'react';
import { Target, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { PageWrapper } from '../components/layout/PageWrapper';
import { UserToggle } from '../components/ui/UserToggle';
import { GlassCard } from '../components/ui/GlassCard';
import { AgentMessage } from '../components/ui/AgentMessage';
import { FAB } from '../components/ui/FAB';
import { AvatarRing, ProgressBar } from '../components/ui/MetricsUI';
import { CheckInModal } from '../components/modules/home/CheckInModal';

import { useCouple } from '../hooks/useCouple';
import { getUserSummary } from '../lib/db';

const UserSummaryCard: React.FC<{ user: any; metrics: any }> = ({ user, metrics }) => {
  const isJose = user.name === 'Jose';
  return (
    <GlassCard variant={isJose ? 'jose' : 'anto'} style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
        <AvatarRing 
          initials={user.initials} 
          color={user.color} 
          size={48} 
          progress={metrics.compliance}
        />
        <div>
          <h3 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '24px', lineHeight: 1, fontWeight: 700, color: '#2d1a0e', margin: 0 }}>{user.name}</h3>
          <p style={{ fontSize: '11px', color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px', fontWeight: 300 }}>
            {metrics.streak} días de racha 🔥
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div className="metric-pill">
           <span className="label">Calorías</span>
           <span className="value">{metrics.calories}</span>
           <ProgressBar value={(metrics.calories / 2000) * 100} color={user.color} />
        </div>
        <div className="metric-pill">
           <span className="label">Entrenos</span>
           <span className="value">{metrics.trainingDays}/5</span>
           <ProgressBar value={(metrics.trainingDays / 5) * 100} color={user.color} />
        </div>
      </div>
    </GlassCard>
  );
};

export const Home: React.FC = () => {
  const { users, activeRole } = useCouple();
  const [summaries, setSummaries] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  
  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  const activeUser = users[activeRole];

  useEffect(() => {
    const loadSummaries = async () => {
      if (Object.keys(users).length === 0) return;
      
      const [joseSum, antoSum] = await Promise.all([
        getUserSummary(users.jose.user.id),
        getUserSummary(users.anto.user.id)
      ]);
      
      setSummaries({
        jose: joseSum,
        anto: antoSum
      });
      setLoading(false);
    };
    
    loadSummaries();
  }, [users]);

  if (loading || !activeUser) {
    return (
      <PageWrapper>
        <div style={{ padding: '40px', textAlign: 'center', color: '#b08878' }}>Cargando panel...</div>
      </PageWrapper>
    );
  }

  const activeMetrics = summaries[activeRole];

  return (
    <PageWrapper>
      <motion.div
        className="hero-panel"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div style={{ minWidth: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#b08878', marginBottom: '6px', fontWeight: 600 }}>
            <Sparkles size={12} /> Panel Diario
          </span>
          <h1 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '36px', lineHeight: 1, fontWeight: 800, color: '#c1603a', letterSpacing: '0.01em', margin: 0 }}>APEX OS</h1>
          <p style={{ fontSize: '13px', color: '#7a4a36', marginTop: '6px', fontWeight: 400 }}>
            Buenos días, {activeUser.user.name} · {today}
          </p>
        </div>
        <UserToggle />
      </motion.div>

      <motion.div
        className="couple-grid"
        style={{ marginBottom: '16px' }}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <UserSummaryCard user={users.jose.user} metrics={summaries.jose} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <UserSummaryCard user={users.anto.user} metrics={summaries.anto} />
        </motion.div>
      </motion.div>

      {summaries.jose && summaries.anto && (
        <motion.div
          style={{ marginBottom: '16px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12 }}
        >
          <AgentMessage 
            agentType="planner"
            userName={activeUser.user.name}
            color={activeUser.user.color} 
            contextData={{
               userName: activeUser.user.name,
               caloriasHoy: activeMetrics.calories,
               caloriasMeta: 2000,
               proteinaHoy: activeMetrics.macros.protein,
               proteinaMeta: 180,
               pesoActual: activeMetrics.checkin?.weight_kg || 75,
               pesoMeta: 70,
               tendenciaPeso: 'estable',
               cumplimientoSemana: activeMetrics.compliance,
               entrenosSemana: activeMetrics.trainingDays,
               metaEntrenosSemana: 5,
               ultimoEntreno: 'Carga',
               rachaActual: activeMetrics.streak,
               pasosHoy: 0,
               gastosMes: activeMetrics.financeSpent,
               presupuestoMes: 1000,
               tasaAhorro: 0,
               categoriaTopGasto: 'Comida',
               cumplimientoPresupuesto: Math.round((activeMetrics.financeSpent / 1000) * 100),
               horasEstaSemana: activeMetrics.studyHours,
               metaHorasSemana: 10,
               temaActivo: 'Supabase',
               recursoTipo: 'Documentación'
            }}
          />
        </motion.div>
      )}

      <motion.div
        style={{ marginBottom: '16px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16 }}
      >
        <Link to="/goals" style={{ textDecoration: 'none' }}>
          <GlassCard
            variant="gold"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
               <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(193,96,58,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(193,96,58,0.2)', flexShrink: 0 }}>
                  <Target size={22} color="#c1603a" />
                </div>
                <div>
                   <h3 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '18px', fontWeight: 700, color: '#2d1a0e', margin: 0 }}>Metas compartidas</h3>
                   <p style={{ fontSize: '12px', color: '#b08878', marginTop: '3px', fontWeight: 300 }}>
                     Visión conjunta · Q2 2025
                   </p>
                </div>
            </div>
            <ArrowRight size={18} color="#c1603a" opacity={0.6} />
          </GlassCard>
        </Link>
      </motion.div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Link to="/review" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#c1603a', textTransform: 'uppercase', letterSpacing: '0.12em', textDecoration: 'none' }}>
          Revisión Semanal Completa <ArrowRight size={12} />
        </Link>
      </div>

      <FAB onClick={() => setIsCheckInOpen(true)} />
      {isCheckInOpen && <CheckInModal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />}
    </PageWrapper>
  );
};
