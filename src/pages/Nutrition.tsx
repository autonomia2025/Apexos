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
import { getNutritionLogs, deleteNutritionLog } from '../lib/db';

const mapMealLog = (log: any) => ({
  id: log.id,
  name: log.meal_name,
  calories: log.calories || 0,
  time: new Date(log.logged_at).toLocaleTimeString('es-CL', {
    hour: '2-digit', minute: '2-digit'
  }),
  meal_type: log.meal_type,
  macros: {
    protein: Math.round(Number(log.protein_g) || 0),
    carbs: Math.round(Number(log.carbs_g) || 0),
    fat: Math.round(Number(log.fat_g) || 0),
  }
});

const calculateMetrics = (rawLogs: any[], userProfile: any) => {
  const calorieTarget = userProfile?.calorieTarget || 2000;
  const proteinTarget = userProfile?.proteinTarget || 150;
  const today = new Date().toISOString().split('T')[0];
  const todayRaw = rawLogs.filter(l =>
    l.logged_at.split('T')[0] === today
  );
  const totalCal = todayRaw.reduce((s, l) => s + (l.calories || 0), 0);
  const totalProtein = todayRaw.reduce((s, l) => s + (Number(l.protein_g) || 0), 0);
  const totalCarbs = todayRaw.reduce((s, l) => s + (Number(l.carbs_g) || 0), 0);
  const totalFat = todayRaw.reduce((s, l) => s + (Number(l.fat_g) || 0), 0);

  return {
    calories: { consumed: totalCal, target: calorieTarget },
    macros: {
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      proteinTarget,
    },
    compliance: Math.round((totalCal / calorieTarget) * 100),
  };
};

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

    setJoseData({
      ...users.jose,
      metrics: {
        ...users.jose?.metrics,
        ...calculateMetrics(joseLogs, users.jose?.user),
      },
      recentMeals: joseLogs.map(mapMealLog),
    });

    setAntoData({
      ...users.anto,
      metrics: {
        ...users.anto?.metrics,
        ...calculateMetrics(antoLogs, users.anto?.user),
      },
      recentMeals: antoLogs.map(mapMealLog),
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

  const handleDeleteMeal = async (id: string) => {
    await deleteNutritionLog(id);
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
                  onDelete={handleDeleteMeal}
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
                onDelete={handleDeleteMeal}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <NutritionStats user={antoData} />
              <MealLogList
                logs={antoData.recentMeals}
                color={antoData.user.color}
                onOpenAdd={handleOpenMealModal}
                onDelete={handleDeleteMeal}
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
