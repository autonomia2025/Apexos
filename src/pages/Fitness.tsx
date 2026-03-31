import React, { useState } from 'react';
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

export const Fitness: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

  const handleOpenWorkoutModal = () => setIsWorkoutModalOpen(true);
  const handleCloseWorkoutModal = () => setIsWorkoutModalOpen(false);

  const getFitnessContext = (userData: typeof activeUserData): FitnessContext => ({
    userName: userData.user.name,
    entrenosSemana: userData.metrics.trainingDays,
    metaEntrenosSemana: 5,
    ultimoEntreno: userData.recentWorkouts.length > 0 ? `${userData.recentWorkouts[0].type} (${userData.recentWorkouts[0].date})` : 'Ninguno reciente',
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
        style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
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
            userName={activeUserData.user.name}
            color={activeUserData.user.color} 
            contextData={getFitnessContext(activeUserData)}
          />
        </motion.section>

        {isMobile ? (
          <AnimatePresence mode="wait">
             <motion.div
                key={activeUserData.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
              >
                <FitnessStats user={activeUserData} />
                <ActivityGrid user={activeUserData} />
                <WorkoutLogList 
                  logs={activeUserData.recentWorkouts} 
                  color={activeUserData.user.color} 
                  onOpenAdd={handleOpenWorkoutModal}
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <FitnessStats user={users.jose} />
              <ActivityGrid user={users.jose} />
              <WorkoutLogList 
                logs={users.jose.recentWorkouts} 
                color={users.jose.user.color} 
                onOpenAdd={handleOpenWorkoutModal}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <FitnessStats user={users.anto} />
              <ActivityGrid user={users.anto} />
              <WorkoutLogList 
                logs={users.anto.recentWorkouts} 
                color={users.anto.user.color} 
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
