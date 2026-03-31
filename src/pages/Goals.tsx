import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import { UserToggle } from '../components/ui/UserToggle';
import { FAB } from '../components/ui/FAB';
import { GoalCard } from '../components/modules/goals/GoalCard';
import { GoalModal } from '../components/modules/goals/GoalModal';
import { useCouple } from '../hooks/useCouple';
import { mockGoals } from '../data/goalsData';

export const Goals: React.FC = () => {
  const { activeUserId } = useCouple();
  const [activeTab, setActiveTab] = useState<'personal' | 'shared'>('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const personalGoals = mockGoals.filter(g => g.type === 'personal' && g.userId === activeUserId);
  const sharedGoals = mockGoals.filter(g => g.type === 'shared');

  return (
    <PageWrapper>
      <header className="flex justify-between items-start mb-8">
        <div>
           <h1 className="text-3xl font-display text-gold-400 font-bold tracking-tight">Metas</h1>
           <p className="text-sm font-body text-gray-400 mt-1">Sigue tu progreso y el de tu pareja</p>
        </div>
        <div className="md:hidden">
          <UserToggle />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-navy-800/80 rounded-xl p-1 border border-white/5 mb-8 relative z-10">
         <button
           onClick={() => setActiveTab('personal')}
           className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors relative ${
             activeTab === 'personal' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
           }`}
         >
           {activeTab === 'personal' && (
             <motion.div
               layoutId="activeTabIndicator"
               className="absolute inset-0 bg-white/10 rounded-lg shadow-inner border border-white/5"
               transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
             />
           )}
           <span className="relative z-10 tracking-wide uppercase text-xs">Mis Metas</span>
         </button>
         <button
           onClick={() => setActiveTab('shared')}
           className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors relative ${
             activeTab === 'shared' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
           }`}
         >
           {activeTab === 'shared' && (
             <motion.div
               layoutId="activeTabIndicator"
               className="absolute inset-0 bg-white/10 rounded-lg shadow-inner border border-white/5"
               transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
             />
           )}
           <span className="relative z-10 tracking-wide uppercase text-xs">De Pareja</span>
         </button>
      </div>

      {/* Content */}
      <div className="space-y-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'personal' ? (
             <motion.div
               key="personal"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               transition={{ duration: 0.3 }}
               className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
             >
               {personalGoals.map((goal) => (
                 <GoalCard key={goal.id} goal={goal} activeUserId={activeUserId} />
               ))}
               {personalGoals.length === 0 && (
                 <div className="col-span-full py-12 text-center text-gray-500">
                   Aún no tienes metas personales activas.
                 </div>
               )}
             </motion.div>
          ) : (
             <motion.div
               key="shared"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
               className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
             >
               {sharedGoals.map((goal) => (
                 <GoalCard key={goal.id} goal={goal} activeUserId={activeUserId} />
               ))}
               {sharedGoals.length === 0 && (
                 <div className="col-span-full py-12 text-center text-gray-500">
                   No hay metas de pareja activas aún.
                 </div>
               )}
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add CTA */}
      <FAB onClick={() => setIsModalOpen(true)} pulse={false} />

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        color="var(--gold-400)" 
      />
    </PageWrapper>
  );
};
