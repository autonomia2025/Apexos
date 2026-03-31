import React, { useState } from 'react';
import { Target, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { PageWrapper } from '../components/layout/PageWrapper';
import { UserToggle } from '../components/ui/UserToggle';
import { GlassCard } from '../components/ui/GlassCard';
import { AgentMessage } from '../components/ui/AgentMessage';
import { FAB } from '../components/ui/FAB';
import { AvatarRing, ProgressBar } from '../components/ui/MetricsUI';

import { useCouple } from '../hooks/useCouple';
import { UserData } from '../types';

/**
 * PURE CSS COUPLE OVERVIEW CARD
 */
const UserSummaryCard: React.FC<{ user: UserData }> = ({ user }) => {
  const isJose = user.user.id === 'jose';
  return (
    <GlassCard variant={isJose ? 'jose' : 'anto'} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        <AvatarRing 
          initials={user.user.initials} 
          color={user.user.color} 
          size={56} 
          progress={user.metrics.compliance}
        />
        <div>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '28px', lineHeight: 1, fontWeight: 600, color: '#fff', margin: 0 }}>{user.user.name}</h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px', fontWeight: 600 }}>
            {user.metrics.streak} días de racha 🔥
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="metric-pill">
           <span className="label">Calorías</span>
           <span className="value">{user.metrics.calories.consumed}</span>
           <ProgressBar value={(user.metrics.calories.consumed / user.metrics.calories.target) * 100} color={user.user.color} />
        </div>
        <div className="metric-pill">
           <span className="label">Entrenos</span>
           <span className="value">{user.metrics.trainingDays}/5</span>
           <ProgressBar value={(user.metrics.trainingDays / 5) * 100} color={user.user.color} />
        </div>
      </div>
    </GlassCard>
  );
};

export const Home: React.FC = () => {
  const { users, activeUserId } = useCouple();
  const activeUser = users[activeUserId];
  const [, setIsCheckInOpen] = useState(false);
  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

  return (
    <PageWrapper>
      <motion.div
        className="hero-panel"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '12px' }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div style={{ minWidth: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(247,217,122,0.9)', marginBottom: '8px', fontWeight: 600 }}>
            <Sparkles size={12} /> Panel Diario
          </span>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '42px', lineHeight: 1, fontWeight: 700, color: '#f0c040', letterSpacing: '0.01em', margin: 0 }}>APEX OS</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
            Buenos días, {activeUser.user.name} · {today}
          </p>
        </div>
        <UserToggle />
      </motion.div>

      <motion.div
        className="couple-grid"
        style={{ marginBottom: '24px' }}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <UserSummaryCard user={users.jose} />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <UserSummaryCard user={users.anto} />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ marginBottom: '28px' }}
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
             caloriasHoy: activeUser.metrics.calories.consumed,
             caloriasMeta: activeUser.metrics.calories.target,
             proteinaHoy: activeUser.metrics.macros.protein,
             proteinaMeta: 180,
             pesoActual: 75,
             pesoMeta: 70,
             tendenciaPeso: 'estable',
             cumplimientoSemana: activeUser.metrics.compliance,
             entrenosSemana: activeUser.metrics.trainingDays,
             metaEntrenosSemana: 5,
             ultimoEntreno: 'Fuerza',
             rachaActual: activeUser.metrics.streak,
             pasosHoy: activeUser.metrics.steps,
             gastosMes: activeUser.metrics.finance.spent,
             presupuestoMes: activeUser.metrics.finance.budget,
             tasaAhorro: activeUser.metrics.finance.savingsRate,
             categoriaTopGasto: activeUser.metrics.finance.topCategory.name,
             cumplimientoPresupuesto: Math.round((activeUser.metrics.finance.spent / activeUser.metrics.finance.budget) * 100),
             horasEstaSemana: activeUser.metrics.studyHours,
             metaHorasSemana: 10,
             temaActivo: activeUser.metrics.learning.activeTopics[0] || 'Ninguno',
             recursoTipo: 'Video'
          }}
        />
      </motion.div>

      <motion.div
        style={{ marginBottom: '24px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16 }}
      >
        <Link to="/goals" style={{ textDecoration: 'none' }}>
          <GlassCard
            variant="gold"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(240,192,64,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(240,192,64,0.25)', flexShrink: 0 }}>
                  <Target size={22} color="#f0c040" />
                </div>
                <div>
                   <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>Metas compartidas</h3>
                   <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>
                     Visión conjunta · Q2 2025
                   </p>
                </div>
            </div>
            <ArrowRight size={18} color="#f0c040" opacity={0.6} />
          </GlassCard>
        </Link>
      </motion.div>

      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <Link to="/review" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#f0c040', textTransform: 'uppercase', letterSpacing: '0.12em', textDecoration: 'none' }}>
          Revisión Semanal Completa <ArrowRight size={12} />
        </Link>
      </div>

      <FAB onClick={() => setIsCheckInOpen(true)} />
    </PageWrapper>
  );
};
