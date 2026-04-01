import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ModuleHeader } from '../components/layout/ModuleHeader';
import { AgentMessage } from '../components/ui/AgentMessage';
import { FinanceStats } from '../components/modules/finance/FinanceStats';
import { ExpenseLogList } from '../components/modules/finance/ExpenseLogList';
import { ExpenseModal } from '../components/modules/finance/ExpenseModal';
import { useCouple } from '../hooks/useCouple';
import { useActiveUser } from '../hooks/useActiveUser';
import { FinanceContext } from '../services/agentService';
import { getFinanceLogs } from '../lib/db';

export const Finance: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [joseData, setJoseData] = useState<any>(null);
  const [antoData, setAntoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!users.jose || !users.anto) return;
    
    const [joseLogs, antoLogs] = await Promise.all([
      getFinanceLogs(users.jose.user.id),
      getFinanceLogs(users.anto.user.id)
    ]);

    const calculateMetrics = (logs: any[]) => {
      const spent = logs.reduce((sum, l) => sum + (l.type === 'gasto' ? Number(l.amount) : 0), 0);
      return {
        finance: {
          spent,
          budget: 1000,
          savingsRate: 0,
          topCategory: { name: 'Comida', amount: 0 }
        }
      };
    };

    setJoseData({
      ...users.jose,
      metrics: { ...users.jose.metrics, ...calculateMetrics(joseLogs) },
      recentExpenses: joseLogs.slice(0, 10)
    });

    setAntoData({
      ...users.anto,
      metrics: { ...users.anto.metrics, ...calculateMetrics(antoLogs) },
      recentExpenses: antoLogs.slice(0, 10)
    });
    
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [users]);

  const handleOpenExpenseModal = () => setIsExpenseModalOpen(true);
  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    fetchLogs();
  };

  if (loading || !joseData || !antoData) {
    return <PageWrapper><div style={{ padding: '40px', textAlign: 'center', color: '#b08878' }}>Cargando finanzas...</div></PageWrapper>;
  }

  const currentDisplayData = activeUserData.user.role === 'jose' ? joseData : antoData;

  const getFinanceContext = (userData: any): FinanceContext => ({
    userName: userData.user.name,
    gastosMes: userData.metrics.finance.spent,
    presupuestoMes: userData.metrics.finance.budget,
    tasaAhorro: userData.metrics.finance.savingsRate,
    categoriaTopGasto: userData.metrics.finance.topCategory.name,
    cumplimientoPresupuesto: Math.round((userData.metrics.finance.spent / userData.metrics.finance.budget) * 100)
  });

  return (
    <PageWrapper>
      <ModuleHeader
        title="Finanzas"
        subtitle="Control de gastos y presupuesto"
        badge="Money"
        icon={<Wallet size={18} />}
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
            agentType="finance"
            userName={currentDisplayData.user.name}
            color={currentDisplayData.user.color} 
            contextData={getFinanceContext(currentDisplayData)}
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
                <FinanceStats user={currentDisplayData} />
                <ExpenseLogList 
                  logs={currentDisplayData.recentExpenses} 
                  color={currentDisplayData.user.color} 
                  onOpenAdd={handleOpenExpenseModal} 
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FinanceStats user={joseData} />
              <ExpenseLogList 
                logs={joseData.recentExpenses} 
                color={joseData.user.color} 
                onOpenAdd={handleOpenExpenseModal} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FinanceStats user={antoData} />
              <ExpenseLogList 
                logs={antoData.recentExpenses} 
                color={antoData.user.color} 
                onOpenAdd={handleOpenExpenseModal} 
              />
            </div>
          </div>
        )}
      </motion.div>

      <ExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={handleCloseExpenseModal} 
        color={activeUserData.user.color} 
      />
    </PageWrapper>
  );
};
