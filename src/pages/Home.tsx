import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowRight, TrendingUp, Calendar, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageWrapper } from '../components/layout/PageWrapper';
import { UserToggle } from '../components/ui/UserToggle';
import { GlassCard } from '../components/ui/GlassCard';
import { AgentMessage } from '../components/ui/AgentMessage';
import { FAB } from '../components/ui/FAB';

import { useCouple } from '../hooks/useCouple';
import { UserData } from '../types';

// Subcomponents
const CoupleOverview: React.FC<{ user: UserData }> = ({ user }) => (
  <GlassCard 
    jose={user.user.id === 'jose'} 
    anto={user.user.id === 'anto'}
    className="p-6 relative group overflow-hidden"
  >
    <div className="flex justify-between items-start relative z-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ring-1 ring-white/10`} style={{ backgroundColor: `${user.user.color}22`, color: user.user.color }}>
            {user.user.initials}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">{user.user.name}</span>
        </div>
        
        <div>
          <div className="text-4xl font-display font-bold text-white tracking-tight flex items-baseline gap-1">
            {user.metrics.compliance}
            <span className="text-sm font-body font-normal text-gray-500 uppercase tracking-widest">%</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mt-1">Cumplimiento Semanal</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-gold-400">
           <Zap size={14} />
           <span className="text-sm font-bold">{user.metrics.streak}d</span>
        </div>
        <div className="flex items-center gap-1 text-blue-400">
           <TrendingUp size={14} />
           <span className="text-[10px] font-bold">TOP 5%</span>
        </div>
      </div>
    </div>
    
    {/* Micro charts or indicators */}
    <div className="mt-8 grid grid-cols-3 gap-2 relative z-10">
       {[
         { l: 'Nut', v: user.metrics.calories.consumed / user.metrics.calories.target },
         { l: 'Fit', v: user.metrics.trainingDays / 5 },
         { l: 'Lrn', v: user.metrics.studyHours / 10 }
       ].map(m => (
         <div key={m.l} className="space-y-1">
           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${m.v * 100}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full bg-white opacity-40" 
             />
           </div>
           <span className="text-[8px] uppercase tracking-tighter text-gray-500 font-mono">{m.l}</span>
         </div>
       ))}
    </div>
  </GlassCard>
);

export const Home: React.FC = () => {
  const { users, activeUserId, isMobile } = useCouple();
  const activeUserData = users[activeUserId];
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  return (
    <PageWrapper>
      <div className="page-wrapper-luxury max-w-4xl mx-auto px-4 pt-12">
        
        {/* TOP HEADER (Expert Layout) */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 animate-in">
          <div>
            <div className="flex items-center gap-4 mb-2">
               <span className="w-12 h-px bg-gold-400/40" />
               <span className="text-[11px] font-mono text-gold-400/60 uppercase tracking-[0.4em] font-bold">Executive OS</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-medium text-white tracking-tighter">
              Apex<span className="text-gold-400">OS</span>
            </h1>
            <p className="text-sm font-body text-gray-500 mt-4 max-w-sm leading-relaxed">
               Gestionando los pilares fundamentales de tu vida de alto rendimiento junto a {activeUserId === 'jose' ? 'Anto' : 'Jose'}.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3 self-end md:self-auto">
             <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <Calendar size={14} />
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
             </div>
             <UserToggle />
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-in" style={{ animationDelay: '0.1s' }}>
          
          {/* User Overviews */}
          <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <CoupleOverview user={users.jose} />
            <CoupleOverview user={users.anto} />
          </section>

          {/* Side Module: Goals (High Intensity CTA) */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            <Link to="/goals" className="h-full">
              <GlassCard gold className="h-full p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gold-400/10 flex items-center justify-center border border-gold-400/20 shadow-[0_0_15px_rgba(240,192,64,0.1)]">
                    <Target size={24} className="text-gold-400" />
                  </div>
                  <ArrowRight size={20} className="text-gold-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Metas Compartidas</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Visionado conjunto del trimestre Q2 2024.</p>
                </div>
              </GlassCard>
            </Link>
          </section>

          {/* AI Intelligence Sector */}
          <section className="lg:col-span-12 relative mt-4">
             <div className="absolute -top-3 left-4 bg-navy-950 px-2 z-10">
               <span className="text-[10px] font-bold text-gold-300 uppercase tracking-[0.2em]">Neural Insight Processed</span>
             </div>
             <AgentMessage 
               agentType="planner"
               userName={activeUserData.user.name}
               color={activeUserData.user.color} 
               contextData={{ /* mock context */ }}
             />
          </section>
        </div>

        {/* WEEKLY TRACKER (Integrated) */}
        <footer className="mt-20 border-t border-white/5 pt-12 pb-32 animate-in" style={{ animationDelay: '0.2s' }}>
           <div className="flex justify-between items-baseline mb-12">
              <h3 className="text-xl font-display font-medium text-gray-400">Rendimiento <span className="italic text-white">Semanal</span></h3>
              <Link to="/review" className="text-xs font-bold text-gold-400 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                Ver Informe Detallado <ArrowRight size={14} />
              </Link>
           </div>
           
           <div className="grid grid-cols-7 gap-2 md:gap-4">
              {[18, 19, 20, 21, 22, 23, 24].map((d, i) => {
                const isToday = i === 6;
                return (
                  <div key={d} className="flex flex-col items-center gap-4">
                     <span className={`text-[10px] font-mono tracking-tighter uppercase ${isToday ? 'text-gold-400 font-bold' : 'text-gray-600'}`}>
                       {['Lun','Mar','Mie','Jue','Vie','Sab','Dom'][i]}
                     </span>
                     <div className={`w-full aspect-[2/3] rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                       isToday ? 'bg-gold-400/10 border-gold-400/40 shadow-lg shadow-gold-400/5' : 'bg-white/[0.02] border-white/5'
                     }`}>
                        <span className={`text-lg font-display ${isToday ? 'text-gold-400 font-bold' : 'text-gray-400'}`}>{d}</span>
                        {isToday && <div className="w-1 h-1 rounded-full bg-gold-400" />}
                     </div>
                  </div>
                );
              })}
           </div>
        </footer>

        {/* Global CTA */}
        <FAB onClick={() => setIsCheckInOpen(true)} pulse />
      </div>
    </PageWrapper>
  );
};
