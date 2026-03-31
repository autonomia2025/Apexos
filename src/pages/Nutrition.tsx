import React, { useState } from 'react';
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

export const Nutrition: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);

  const handleOpenMealModal = () => setIsMealModalOpen(true);
  const handleCloseMealModal = () => setIsMealModalOpen(false);

  const getNutritionContext = (userData: typeof activeUserData): NutritionContext => ({
    userName: userData.user.name,
    caloriasHoy: userData.metrics.calories.consumed,
    caloriasMeta: userData.metrics.calories.target,
    proteinaHoy: userData.metrics.macros.protein,
    proteinaMeta: Math.round(userData.metrics.calories.target * 0.3 / 4), // Example dynamic target
    pesoActual: 75, // Placeholder
    pesoMeta: 70, // Placeholder
    tendenciaPeso: 'bajando',
    cumplimientoSemana: userData.metrics.compliance
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
            agentType="nutrition"
            userName={activeUserData.user.name}
            color={activeUserData.user.color} 
            contextData={getNutritionContext(activeUserData)}
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
                <NutritionStats user={activeUserData} />
                <MealLogList 
                  logs={activeUserData.recentMeals} 
                  color={activeUserData.user.color} 
                  onOpenAdd={handleOpenMealModal}
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <NutritionStats user={users.jose} />
              <MealLogList 
                logs={users.jose.recentMeals} 
                color={users.jose.user.color} 
                onOpenAdd={handleOpenMealModal}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <NutritionStats user={users.anto} />
              <MealLogList 
                logs={users.anto.recentMeals} 
                color={users.anto.user.color} 
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
