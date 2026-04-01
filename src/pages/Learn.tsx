import React, { useState, useEffect } from 'react';
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
import { getLearningLogs } from '../lib/db';

export const Learn: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  const [joseData, setJoseData] = useState<any>(null);
  const [antoData, setAntoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!users.jose || !users.anto) return;
    
    const [joseLogs, antoLogs] = await Promise.all([
      getLearningLogs(users.jose.user.id),
      getLearningLogs(users.anto.user.id)
    ]);

    const calculateMetrics = (logs: any[]) => {
      const totalMin = logs.reduce((sum, l) => sum + l.duration_min, 0);
      return {
        studyHours: totalMin / 60,
        studyStreak: 0,
        learning: {
          activeTopics: Array.from(new Set(logs.map(l => l.topic))).slice(0, 3)
        }
      };
    };

    setJoseData({
      ...users.jose,
      metrics: { ...users.jose.metrics, ...calculateMetrics(joseLogs) },
      recentLearning: joseLogs.slice(0, 10).map(l => ({
        id: l.id,
        topic: l.topic,
        duration: l.duration_min >= 60 ? `${(l.duration_min / 60).toFixed(1)}h` : `${l.duration_min}min`,
        resource: l.resource_type,
        date: l.logged_at.split('T')[0]
      }))
    });

    setAntoData({
      ...users.anto,
      metrics: { ...users.anto.metrics, ...calculateMetrics(antoLogs) },
      recentLearning: antoLogs.slice(0, 10).map(l => ({
        id: l.id,
        topic: l.topic,
        duration: l.duration_min >= 60 ? `${(l.duration_min / 60).toFixed(1)}h` : `${l.duration_min}min`,
        resource: l.resource_type,
        date: l.logged_at.split('T')[0]
      }))
    });
    
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [users]);

  const handleOpenLearnModal = () => setIsLearnModalOpen(true);
  const handleCloseLearnModal = () => {
    setIsLearnModalOpen(false);
    fetchLogs();
  };

  if (loading || !joseData || !antoData) {
    return <PageWrapper><div style={{ padding: '40px', textAlign: 'center', color: '#b08878' }}>Cargando aprendizaje...</div></PageWrapper>;
  }

  const currentDisplayData = activeUserData.user.role === 'jose' ? joseData : antoData;

  const getLearningContext = (userData: any): LearningContext => ({
    userName: userData.user.name,
    horasEstaSemana: userData.metrics.studyHours,
    metaHorasSemana: 10,
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
            agentType="learning"
            userName={currentDisplayData.user.name}
            color={currentDisplayData.user.color} 
            contextData={getLearningContext(currentDisplayData)}
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
                <LearnStats user={currentDisplayData} />
                <LearningLogList 
                  logs={currentDisplayData.recentLearning} 
                  color={currentDisplayData.user.color} 
                  onOpenAdd={handleOpenLearnModal} 
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <LearnStats user={joseData} />
              <LearningLogList 
                logs={joseData.recentLearning} 
                color={joseData.user.color} 
                onOpenAdd={handleOpenLearnModal} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <LearnStats user={antoData} />
              <LearningLogList 
                logs={antoData.recentLearning} 
                color={antoData.user.color} 
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
