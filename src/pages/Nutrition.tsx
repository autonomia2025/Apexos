import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import { UserToggle } from '../components/ui/UserToggle';
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
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-display text-gold-400 font-bold tracking-tight">Nutrición</h1>
          <p className="text-sm font-body text-gray-400 mt-1">Gestión de macros y calorías</p>
        </div>
        <div className="md:hidden">
          <UserToggle />
        </div>
      </header>

      <div className="space-y-8">
        <section>
          <AgentMessage 
            agentType="nutrition"
            userName={activeUserData.user.name}
            color={activeUserData.user.color} 
            contextData={getNutritionContext(activeUserData)}
          />
        </section>

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
                <NutritionStats user={activeUserData} />
                <MealLogList 
                  logs={activeUserData.recentMeals} 
                  color={activeUserData.user.color} 
                  onOpenAdd={handleOpenMealModal}
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div className="grid grid-cols-2 gap-8 items-start">
            <div className="space-y-8">
              <NutritionStats user={users.jose} />
              <MealLogList 
                logs={users.jose.recentMeals} 
                color={users.jose.user.color} 
                onOpenAdd={handleOpenMealModal}
              />
            </div>
            <div className="space-y-8">
              <NutritionStats user={users.anto} />
              <MealLogList 
                logs={users.anto.recentMeals} 
                color={users.anto.user.color} 
                onOpenAdd={handleOpenMealModal}
              />
            </div>
          </div>
        )}
      </div>

      <MealModal 
        isOpen={isMealModalOpen} 
        onClose={handleCloseMealModal} 
        color={activeUserData.user.color} 
      />
    </PageWrapper>
  );
};
