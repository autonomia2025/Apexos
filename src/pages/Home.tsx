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
    <GlassCard variant={isJose ? 'jose' : 'anto'} className="p-5 md:p-6">
      <div className="flex gap-4 items-center mb-5">
        <AvatarRing 
          initials={user.user.initials} 
          color={user.user.color} 
          size={56} 
          progress={user.metrics.compliance}
        />
        <div>
          <h3 className="text-[38px] leading-none font-display font-semibold text-white">{user.user.name}</h3>
          <p className="text-[11px] text-gray-400 uppercase tracking-[0.12em] mt-1 font-semibold">
            {user.metrics.streak} días de racha 🔥
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
        className="flex justify-between items-center mb-7 pt-1 gap-3 hero-panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-gold-300/90 mb-2 font-semibold">
            <Sparkles size={12} /> Panel Diario
          </span>
          <h1 className="text-[44px] leading-none font-display font-bold text-gold-400 tracking-[0.01em]">APEX OS</h1>
          <p className="text-sm text-gray-300 mt-2">
            Buenos días, {activeUser.user.name} <span className="opacity-40 mx-1">|</span> {today}
          </p>
        </div>
        <UserToggle />
      </motion.div>

      <motion.div
        className="couple-grid mb-6"
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
        className="mb-7"
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
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16 }}
      >
        <Link to="/goals" style={{ textDecoration: 'none' }}>
          <GlassCard variant="gold" className="flex justify-between items-center px-5 py-4">
            <div className="flex items-center gap-3.5">
               <div className="w-10 h-10 rounded-xl bg-gold-400/15 flex items-center justify-center border border-gold-400/25">
                  <Target size={22} color="#f0c040" />
                </div>
                <div>
                   <h3 className="text-[28px] leading-none font-display font-semibold text-white">Metas Compartidas 🎯</h3>
                   <p className="text-[12px] text-gray-400 mt-1">
                     Visión conjunta del trimestre Q2 2024
                   </p>
                </div>
            </div>
            <ArrowRight size={20} color="#f0c040" opacity={0.6} />
          </GlassCard>
        </Link>
      </motion.div>

      <div className="text-center mb-20">
        <Link to="/review" className="inline-flex items-center gap-1 text-[12px] font-semibold text-gold-400 uppercase tracking-[0.12em] no-underline">
          Revisión Semanal Completa <ArrowRight size={12} />
        </Link>
      </div>

      <FAB onClick={() => setIsCheckInOpen(true)} />
    </PageWrapper>
  );
};
