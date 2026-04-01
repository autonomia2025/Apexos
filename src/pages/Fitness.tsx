import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ModuleHeader } from '../components/layout/ModuleHeader';
import { AgentMessage } from '../components/ui/AgentMessage';
import { FitnessStats } from '../components/modules/fitness/FitnessStats';
import { ActivityGrid } from '../components/modules/fitness/ActivityGrid';
import { WorkoutLogList } from '../components/modules/fitness/WorkoutLogList';
import { WorkoutModal } from '../components/modules/fitness/WorkoutModal';
import { useCouple } from '../hooks/useCouple';
import { useActiveUser } from '../hooks/useActiveUser';
import { FitnessContext } from '../services/agentService';
import { getFitnessLogs } from '../lib/db';

export const Fitness: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [joseData, setJoseData] = useState<any>(null);
  const [antoData, setAntoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!users.jose || !users.anto) return;
    
    const [joseLogs, antoLogs] = await Promise.all([
      getFitnessLogs(users.jose.user.id),
      getFitnessLogs(users.anto.user.id)
    ]);

    const calculateMetrics = (logs: any[]) => {
      const trainingDays = new Set(logs.map(l => l.logged_at.split('T')[0])).size;
      return {
        trainingDays,
        streak: 0,
        steps: 0
      };
    };

    setJoseData({
      ...users.jose,
      metrics: { ...users.jose.metrics, ...calculateMetrics(joseLogs) },
      recentWorkouts: joseLogs.slice(0, 5)
    });

    setAntoData({
      ...users.anto,
      metrics: { ...users.anto.metrics, ...calculateMetrics(antoLogs) },
      recentWorkouts: antoLogs.slice(0, 5)
    });
    
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [users]);

  const handleOpenWorkoutModal = () => setIsWorkoutModalOpen(true);
  const handleCloseWorkoutModal = () => {
    setIsWorkoutModalOpen(false);
    fetchLogs();
  };

  if (loading || !joseData || !antoData) {
    return <PageWrapper><div style={{ padding: '40px', textAlign: 'center', color: '#b08878' }}>Cargando fitness...</div></PageWrapper>;
  }

  const currentDisplayData = activeUserData.user.role === 'jose' ? joseData : antoData;

  const getFitnessContext = (userData: any): FitnessContext => ({
    userName: userData.user.name,
    entrenosSemana: userData.metrics.trainingDays,
    metaEntrenosSemana: 5,
    ultimoEntreno: userData.recentWorkouts.length > 0 ? `${userData.recentWorkouts[0].workout_type}` : 'Ninguno reciente',
    rachaActual: userData.metrics.streak,
    pasosHoy: userData.metrics.steps
  });

  return (
    <PageWrapper>
      <ModuleHeader
        title="Fitness"
        subtitle="Rendimiento y actividad fisica"
        badge="Training"
        icon={<Dumbbell size={18} />}
      />

      <motion.div
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <AgentMessage 
            agentType="fitness"
            userName={currentDisplayData.user.name}
            color={currentDisplayData.user.color} 
            contextData={getFitnessContext(currentDisplayData)}
          />
        </motion.section>

        {isMobile ? (
          <AnimatePresence mode="wait">
             <motion.div
                key={currentDisplayData.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <FitnessStats user={currentDisplayData} />
                <ActivityGrid user={currentDisplayData} />
                <WorkoutLogList 
                  logs={currentDisplayData.recentWorkouts} 
                  color={currentDisplayData.user.color} 
                  onOpenAdd={handleOpenWorkoutModal}
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FitnessStats user={joseData} />
              <ActivityGrid user={joseData} />
              <WorkoutLogList 
                logs={joseData.recentWorkouts} 
                color={joseData.user.color} 
                onOpenAdd={handleOpenWorkoutModal}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FitnessStats user={antoData} />
              <ActivityGrid user={antoData} />
              <WorkoutLogList 
                logs={antoData.recentWorkouts} 
                color={antoData.user.color} 
                onOpenAdd={handleOpenWorkoutModal}
              />
            </div>
          </div>
        )}
      </motion.div>

      <WorkoutModal 
        isOpen={isWorkoutModalOpen} 
        onClose={handleCloseWorkoutModal} 
        color={activeUserData.user.color} 
      />
    </PageWrapper>
  );
};
