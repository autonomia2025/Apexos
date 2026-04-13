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
  const { activeUserId, activeRole } = useCouple();
  const [activeTab, setActiveTab] = useState<'personal' | 'shared' | 'completed'>('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

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
  }, [activeUserId, refreshKey]);

  const personalGoals = goals.filter(g => !g.couple_goal && g.status === 'active');
  const sharedGoals = goals.filter(g => g.couple_goal && g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const onRefresh = () => setRefreshKey(prev => prev + 1);

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
         {(['personal', 'shared', 'completed'] as const).map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             style={{ flex: 1, padding: '12px 0', fontSize: '11px', fontWeight: 700, borderRadius: '12px', transition: 'color 0.2s', position: 'relative', color: activeTab === tab ? '#c1603a' : '#b08878', background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  style={{ position: 'absolute', inset: 0, borderRadius: '12px', border: '1px solid rgba(193,96,58,0.3)', background: 'rgba(193,96,58,0.08)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
             <span style={{ position: 'relative', zIndex: 10 }}>
               {tab === 'personal' ? 'Mis Metas' : tab === 'shared' ? 'De Pareja' : 'Logradas'}
             </span>
           </button>
         ))}
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
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -10 }}
               transition={{ duration: 0.2 }}
               style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}
             >
                {activeTab === 'personal' && personalGoals.map(g => (
                  <GoalCard key={g.id} goal={g} activeRole={activeRole} onRefresh={onRefresh} />
                ))}
                {activeTab === 'shared' && sharedGoals.map(g => (
                  <GoalCard key={g.id} goal={g} activeRole={activeRole} onRefresh={onRefresh} />
                ))}
                {activeTab === 'completed' && completedGoals.map(g => (
                  <GoalCard key={g.id} goal={g} activeRole={activeRole} onRefresh={onRefresh} />
                ))}

                {activeTab === 'personal' && personalGoals.length === 0 && <div style={{ padding: '48px 0', textAlign: 'center', color: '#b08878' }}>No hay metas personales activas.</div>}
                {activeTab === 'shared' && sharedGoals.length === 0 && <div style={{ padding: '48px 0', textAlign: 'center', color: '#b08878' }}>No hay metas de pareja activas.</div>}
                {activeTab === 'completed' && completedGoals.length === 0 && <div style={{ padding: '48px 0', textAlign: 'center', color: '#b08878' }}>No has completado metas aún. ¡Tú puedes!</div>}
             </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      <FAB onClick={() => setIsModalOpen(true)} pulse={false} />

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setRefreshKey(k => k + 1); }} 
        color="#c1603a" 
      />
    </PageWrapper>
  );
};
