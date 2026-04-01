import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ModuleHeader } from '../components/layout/ModuleHeader';
import { FAB } from '../components/ui/FAB';
import { GoalCard } from '../components/modules/goals/GoalCard';
import { GoalModal } from '../components/modules/goals/GoalModal';
import { useCouple } from '../hooks/useCouple';
import { getGoals } from '../lib/db';

export const Goals: React.FC = () => {
  const { activeUserId } = useCouple();
  const [activeTab, setActiveTab] = useState<'personal' | 'shared'>('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    if (!activeUserId) return;
    try {
      const data = await getGoals(activeUserId);
      setGoals(data);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [activeUserId]);

  const personalGoals = goals.filter(g => !g.couple_goal);
  const sharedGoals = goals.filter(g => g.couple_goal);

  return (
    <PageWrapper>
      <ModuleHeader
        title="Metas"
        subtitle="Sigue tu progreso y el de tu pareja"
        badge="Execution"
        icon={<Target size={18} />}
      />

      <motion.div
        style={{ display: 'flex', borderRadius: '16px', padding: '6px', border: '1px solid rgba(193,96,58,0.15)', marginBottom: '32px', position: 'relative', zIndex: 10, background: 'rgba(45,26,14,0.05)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
      >
         <button
           onClick={() => setActiveTab('personal')}
           style={{ flex: 1, padding: '12px 0', fontSize: '14px', fontWeight: 700, borderRadius: '12px', transition: 'color 0.2s', position: 'relative', color: activeTab === 'personal' ? '#c1603a' : '#b08878', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {activeTab === 'personal' && (
              <motion.div
                layoutId="activeTabIndicator"
                style={{ position: 'absolute', inset: 0, borderRadius: '12px', border: '1px solid rgba(193,96,58,0.3)', background: 'rgba(193,96,58,0.08)' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
           <span style={{ position: 'relative', zIndex: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '12px' }}>Mis Metas</span>
         </button>
         <button
           onClick={() => setActiveTab('shared')}
           style={{ flex: 1, padding: '12px 0', fontSize: '14px', fontWeight: 700, borderRadius: '12px', transition: 'color 0.2s', position: 'relative', color: activeTab === 'shared' ? '#c1603a' : '#b08878', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {activeTab === 'shared' && (
              <motion.div
                layoutId="activeTabIndicator"
                style={{ position: 'absolute', inset: 0, borderRadius: '12px', border: '1px solid rgba(193,96,58,0.3)', background: 'rgba(193,96,58,0.08)' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
           <span style={{ position: 'relative', zIndex: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '12px' }}>De Pareja</span>
         </button>
       </motion.div>

      <motion.div
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '96px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#b08878' }}>Cargando metas...</div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'personal' ? (
               <motion.div
                 key="personal"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ duration: 0.3 }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}
                >
                 {personalGoals.map((goal) => (
                   <GoalCard key={goal.id} goal={{ ...goal, type: 'personal', currentPercent: 0 }} activeUserId={activeUserId} />
                 ))}
                 {personalGoals.length === 0 && (
                    <div style={{ padding: '48px 0', textAlign: 'center', color: '#b08878' }}>
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
                  style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}
                >
                 {sharedGoals.map((goal) => (
                   <GoalCard key={goal.id} goal={{ ...goal, type: 'shared', currentPercent: 0 }} activeUserId={activeUserId} />
                 ))}
                 {sharedGoals.length === 0 && (
                    <div style={{ padding: '48px 0', textAlign: 'center', color: '#b08878' }}>
                      No hay metas de pareja activas aún.
                    </div>
                  )}
               </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      <FAB onClick={() => setIsModalOpen(true)} pulse={false} />

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchGoals(); }} 
        color="#c1603a" 
      />
    </PageWrapper>
  );
};
