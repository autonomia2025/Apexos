import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import { UserToggle } from '../components/ui/UserToggle';
import { AgentMessage } from '../components/ui/AgentMessage';
import { FinanceStats } from '../components/modules/finance/FinanceStats';
import { ExpenseLogList } from '../components/modules/finance/ExpenseLogList';
import { ExpenseModal } from '../components/modules/finance/ExpenseModal';
import { useCouple } from '../hooks/useCouple';
import { useActiveUser } from '../hooks/useActiveUser';
import { FinanceContext } from '../services/agentService';

export const Finance: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const handleOpenExpenseModal = () => setIsExpenseModalOpen(true);
  const handleCloseExpenseModal = () => setIsExpenseModalOpen(false);

  const getFinanceContext = (userData: typeof activeUserData): FinanceContext => ({
    userName: userData.user.name,
    gastosMes: userData.metrics.finance.spent,
    presupuestoMes: userData.metrics.finance.budget,
    tasaAhorro: userData.metrics.finance.savingsRate,
    categoriaTopGasto: userData.metrics.finance.topCategory.name,
    cumplimientoPresupuesto: Math.round((userData.metrics.finance.spent / userData.metrics.finance.budget) * 100)
  });

  return (
    <PageWrapper>
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-display text-gold-400 font-bold tracking-tight">Finanzas</h1>
          <p className="text-sm font-body text-gray-400 mt-1">Control de gastos y presupuesto</p>
        </div>
        <div className="md:hidden">
          <UserToggle />
        </div>
      </header>

      <div className="space-y-8">
        <section>
          <AgentMessage 
            agentType="finance"
            userName={activeUserData.user.name}
            color={activeUserData.user.color} 
            contextData={getFinanceContext(activeUserData)}
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
                <FinanceStats user={activeUserData} />
                <ExpenseLogList 
                  logs={activeUserData.recentExpenses} 
                  color={activeUserData.user.color} 
                  onOpenAdd={handleOpenExpenseModal} 
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div className="grid grid-cols-2 gap-8 items-start">
            <div className="space-y-8">
              <FinanceStats user={users.jose} />
              <ExpenseLogList 
                logs={users.jose.recentExpenses} 
                color={users.jose.user.color} 
                onOpenAdd={handleOpenExpenseModal} 
              />
            </div>
            <div className="space-y-8">
              <FinanceStats user={users.anto} />
              <ExpenseLogList 
                logs={users.anto.recentExpenses} 
                color={users.anto.user.color} 
                onOpenAdd={handleOpenExpenseModal} 
              />
            </div>
          </div>
        )}
      </div>

      <ExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={handleCloseExpenseModal} 
        color={activeUserData.user.color} 
      />
    </PageWrapper>
  );
};
