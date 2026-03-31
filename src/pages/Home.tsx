import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, ArrowRight } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { UserToggle } from '../components/ui/UserToggle';
import { CoupleOverview } from '../components/modules/home/CoupleOverview';
import { WeekStrip } from '../components/modules/home/WeekStrip';
import { WeekNumbers } from '../components/modules/home/WeekNumbers';
import { AgentMessage } from '../components/ui/AgentMessage';
import { CheckInCTA } from '../components/modules/home/CheckInCTA';
import { CheckInModal } from '../components/modules/home/CheckInModal';
import { FAB } from '../components/ui/FAB';
import { GlassCard } from '../components/ui/GlassCard';
import { useCouple } from '../hooks/useCouple';
import { useActiveUser } from '../hooks/useActiveUser';
import { AgentContext } from '../services/agentService';

export const Home: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  const handleOpenCheckIn = () => setIsCheckInOpen(true);
  const handleCloseCheckIn = () => setIsCheckInOpen(false);

  // Combine contexts for the Planner agent
  const getCombinedContext = (userData: typeof activeUserData): AgentContext => ({
    userName: userData.user.name,
    // Nutrition
    caloriasHoy: userData.metrics.calories.consumed,
    caloriasMeta: userData.metrics.calories.target,
    proteinaHoy: userData.metrics.macros.protein,
    proteinaMeta: Math.round(userData.metrics.calories.target * 0.3 / 4),
    pesoActual: 75,
    pesoMeta: 70,
    tendenciaPeso: 'bajando',
    cumplimientoSemana: userData.metrics.compliance,
    // Fitness
    entrenosSemana: userData.metrics.trainingDays,
    metaEntrenosSemana: 5,
    ultimoEntreno: userData.recentWorkouts.length > 0 ? `${userData.recentWorkouts[0].type} (${userData.recentWorkouts[0].date})` : 'Ninguno',
    rachaActual: userData.metrics.streak,
    pasosHoy: userData.metrics.steps,
    // Finance
    gastosMes: userData.metrics.finance.spent,
    presupuestoMes: userData.metrics.finance.budget,
    tasaAhorro: userData.metrics.finance.savingsRate,
    categoriaTopGasto: userData.metrics.finance.topCategory.name,
    cumplimientoPresupuesto: Math.round((userData.metrics.finance.spent / userData.metrics.finance.budget) * 100),
    // Learning
    horasEstaSemana: userData.metrics.studyHours,
    metaHorasSemana: 10,
    temaActivo: userData.metrics.learning.activeTopics[0] || 'Ninguno',
    recursoTipo: userData.recentLearning.length > 0 ? userData.recentLearning[0].resource : 'Ninguno'
  });

  return (
    <PageWrapper>
      {/* Header */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-display text-gold-400 font-bold tracking-tight">
            [NOMBRE]
          </h1>
          <h2 className="text-xl font-display text-white mt-1">
            Buenos días, {activeUserData.user.name}
          </h2>
          <p className="text-sm font-body text-gray-400 mt-1">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        
        {/* Mobile User Toggle */}
        <div className="md:hidden">
          <UserToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="space-y-6 lg:space-y-8 mb-6">
        {/* Couple Overview */}
        <section>
          {isMobile ? (
            <CoupleOverview user={activeUserData} />
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <CoupleOverview user={users.jose} />
              <CoupleOverview user={users.anto} />
            </div>
          )}
        </section>

        {/* AI Insight - Planner */}
        <section className="relative">
          <div className="absolute -top-3 left-4 bg-navy-900 px-2 z-10">
            <span className="text-[10px] font-bold text-gold-300 uppercase tracking-widest">
              Tu coach dice →
            </span>
          </div>
          <AgentMessage 
            agentType="planner"
            userName={activeUserData.user.name}
            color={activeUserData.user.color} 
            contextData={getCombinedContext(activeUserData)}
          />
        </section>
        
        {/* Goals Entry */}
        <section>
          <Link to="/goals">
             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
               <GlassCard className="p-4 border-gold-400/30 flex items-center justify-between group hover:bg-white/5 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center border border-gold-400/20">
                     <Target size={20} className="text-gold-400" />
                   </div>
                   <div>
                     <h3 className="font-display font-bold text-white text-lg">Metas 🎯</h3>
                     <p className="text-xs text-gray-400">Progreso personal y de pareja</p>
                   </div>
                 </div>
                 <ArrowRight size={20} className="text-gold-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
               </GlassCard>
             </motion.div>
          </Link>
        </section>


        {/* Weekly Progress */}
        <section>
          <WeekStrip />
          <WeekNumbers />
        </section>
      </div>

      <div className="flex justify-center mb-8">
        <Link 
          to="/review"
          className="text-sm font-bold text-gold-400 hover:text-gold-300 hover:underline uppercase tracking-wider flex items-center gap-1 transition-all"
        >
          Revisión semanal <ArrowRight size={14} />
        </Link>
      </div>

      {/* CTAs */}
      <FAB onClick={handleOpenCheckIn} pulse={true} />
      <div onClick={handleOpenCheckIn} className="cursor-pointer">
        <CheckInCTA />
      </div>

      <CheckInModal isOpen={isCheckInOpen} onClose={handleCloseCheckIn} />
    </PageWrapper>
  );
};
