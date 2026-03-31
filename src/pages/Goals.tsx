import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ModuleHeader } from '../components/layout/ModuleHeader';
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
      <ModuleHeader
        title="Metas"
        subtitle="Sigue tu progreso y el de tu pareja"
        badge="Execution"
        icon={<Target size={18} />}
      />

      {/* Tabs */}
      <motion.div
        className="flex rounded-2xl p-1.5 border border-white/10 mb-8 relative z-10 bg-[linear-gradient(140deg,rgba(14,30,58,0.7),rgba(8,18,35,0.5))]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
      >
         <button
           onClick={() => setActiveTab('personal')}
           className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors relative ${
              activeTab === 'personal' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {activeTab === 'personal' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 rounded-xl border border-gold-400/30 bg-[linear-gradient(180deg,rgba(240,192,64,0.18),rgba(240,192,64,0.05))] shadow-[0_8px_16px_rgba(0,0,0,0.22)]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
           <span className="relative z-10 tracking-wide uppercase text-xs">Mis Metas</span>
         </button>
         <button
           onClick={() => setActiveTab('shared')}
           className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors relative ${
              activeTab === 'shared' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {activeTab === 'shared' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 rounded-xl border border-gold-400/30 bg-[linear-gradient(180deg,rgba(240,192,64,0.18),rgba(240,192,64,0.05))] shadow-[0_8px_16px_rgba(0,0,0,0.22)]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
           <span className="relative z-10 tracking-wide uppercase text-xs">De Pareja</span>
         </button>
       </motion.div>

      {/* Content */}
      <motion.div
        className="space-y-4 pb-24"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
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
      </motion.div>

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
