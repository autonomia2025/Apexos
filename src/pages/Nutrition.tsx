import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ModuleHeader } from '../components/layout/ModuleHeader';
import { AgentMessage } from '../components/ui/AgentMessage';
import { NutritionStats } from '../components/modules/nutrition/NutritionStats';
import { MealLogList } from '../components/modules/nutrition/MealLogList';
import { MealModal } from '../components/modules/nutrition/MealModal';
import { useCouple } from '../hooks/useCouple';
import { useActiveUser } from '../hooks/useActiveUser';
import { NutritionContext } from '../services/agentService';
import { getNutritionLogs } from '../lib/db';

export const Nutrition: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [joseData, setJoseData] = useState<any>(null);
  const [antoData, setAntoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLogs = async () => {
    if (!users.jose || !users.anto) return;
    
    const [joseLogs, antoLogs] = await Promise.all([
      getNutritionLogs(users.jose.user.id),
      getNutritionLogs(users.anto.user.id)
    ]);

    const calculateMetrics = (logs: any[]) => {
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logs.filter(l => l.logged_at.split('T')[0] === today);
      return {
        calories: {
          consumed: todayLogs.reduce((sum, l) => sum + l.calories, 0),
          target: 2000
        },
        macros: {
          protein: todayLogs.reduce((sum, l) => sum + (Number(l.protein_g) || 0), 0),
          carbs: todayLogs.reduce((sum, l) => sum + (Number(l.carbs_g) || 0), 0),
          fat: todayLogs.reduce((sum, l) => sum + (Number(l.fat_g) || 0), 0),
        },
        compliance: 0 // Placeholder
      };
    };

    setJoseData({
      ...users.jose,
      metrics: {
        ...users.jose?.metrics,
        ...calculateMetrics(joseLogs)
      },
      recentMeals: joseLogs.slice(0, 5)
    });

    setAntoData({
      ...users.anto,
      metrics: {
        ...users.anto?.metrics,
        ...calculateMetrics(antoLogs)
      },
      recentMeals: antoLogs.slice(0, 5)
    });
    
    setLoading(false);
  };

  const joseId = users.jose?.user?.id;
  const antoId = users.anto?.user?.id;

  useEffect(() => {
    if (!joseId || !antoId) return;
    fetchLogs();
  }, [joseId, antoId, refreshKey]);

  const handleOpenMealModal = () => setIsMealModalOpen(true);
  const handleCloseMealModal = () => {
    setIsMealModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  if (loading || !joseData || !antoData) {
    return <PageWrapper><div style={{ padding: '40px', textAlign: 'center', color: '#b08878' }}>Cargando nutrición...</div></PageWrapper>;
  }

  const currentDisplayData = activeUserData.user.role === 'jose' ? joseData : antoData;

  const getNutritionContext = (userData: any): NutritionContext => ({
    userName: userData.user.name,
    caloriasHoy: userData.metrics?.calories?.consumed ?? 0,
    caloriasMeta: userData.metrics?.calories?.target ?? 2000,
    proteinaHoy: userData.metrics?.macros?.protein ?? 0,
    proteinaMeta: 180,
    pesoActual: 75,
    pesoMeta: 70,
    tendenciaPeso: 'estable',
    cumplimientoSemana: userData.metrics?.compliance ?? 0
  });

  return (
    <PageWrapper>
      <ModuleHeader
        title="Nutricion"
        subtitle="Gestion de macros y calorias"
        badge="Performance"
        icon={<Apple size={18} />}
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
            agentType="nutrition"
            userName={currentDisplayData.user.name}
            color={currentDisplayData.user.color} 
            contextData={getNutritionContext(currentDisplayData)}
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
                <NutritionStats user={currentDisplayData} />
                <MealLogList 
                  logs={currentDisplayData.recentMeals} 
                  color={currentDisplayData.user.color} 
                  onOpenAdd={handleOpenMealModal}
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <NutritionStats user={joseData} />
              <MealLogList 
                logs={joseData.recentMeals} 
                color={joseData.user.color} 
                onOpenAdd={handleOpenMealModal}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <NutritionStats user={antoData} />
              <MealLogList 
                logs={antoData.recentMeals} 
                color={antoData.user.color} 
                onOpenAdd={handleOpenMealModal}
              />
            </div>
          </div>
        )}
      </motion.div>

      <MealModal 
        isOpen={isMealModalOpen} 
        onClose={handleCloseMealModal} 
        color={activeUserData.user.color} 
      />
    </PageWrapper>
  );
};
