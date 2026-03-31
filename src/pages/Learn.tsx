import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ModuleHeader } from '../components/layout/ModuleHeader';
import { AgentMessage } from '../components/ui/AgentMessage';
import { LearnStats } from '../components/modules/learn/LearnStats';
import { LearningLogList } from '../components/modules/learn/LearningLogList';
import { LearningSessionModal } from '../components/modules/learn/LearningSessionModal';
import { useCouple } from '../hooks/useCouple';
import { useActiveUser } from '../hooks/useActiveUser';
import { LearningContext } from '../services/agentService';

export const Learn: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);

  const handleOpenLearnModal = () => setIsLearnModalOpen(true);
  const handleCloseLearnModal = () => setIsLearnModalOpen(false);

  const getLearningContext = (userData: typeof activeUserData): LearningContext => ({
    userName: userData.user.name,
    horasEstaSemana: userData.metrics.studyHours,
    metaHorasSemana: 10, // Mock
    rachaActual: userData.metrics.studyStreak,
    temaActivo: userData.metrics.learning.activeTopics[0] || 'Ninguno',
    recursoTipo: userData.recentLearning.length > 0 ? userData.recentLearning[0].resource : 'Ninguno'
  });

  return (
    <PageWrapper>
      <ModuleHeader
        title="Aprendizaje"
        subtitle="Desarrollo personal y conocimientos"
        badge="Growth"
        icon={<BookOpen size={18} />}
      />

      <motion.div
        className="space-y-8"
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
            agentType="learning"
            userName={activeUserData.user.name}
            color={activeUserData.user.color} 
            contextData={getLearningContext(activeUserData)}
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
                className="space-y-8"
             >
                <LearnStats user={activeUserData} />
                <LearningLogList 
                  logs={activeUserData.recentLearning} 
                  color={activeUserData.user.color} 
                  onOpenAdd={handleOpenLearnModal} 
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div className="grid grid-cols-2 gap-8 items-start">
            <div className="space-y-8">
              <LearnStats user={users.jose} />
              <LearningLogList 
                logs={users.jose.recentLearning} 
                color={users.jose.user.color} 
                onOpenAdd={handleOpenLearnModal} 
              />
            </div>
            <div className="space-y-8">
              <LearnStats user={users.anto} />
              <LearningLogList 
                logs={users.anto.recentLearning} 
                color={users.anto.user.color} 
                onOpenAdd={handleOpenLearnModal} 
              />
            </div>
          </div>
        )}
      </motion.div>

      <LearningSessionModal 
        isOpen={isLearnModalOpen} 
        onClose={handleCloseLearnModal} 
        color={activeUserData.user.color} 
      />
    </PageWrapper>
  );
};
