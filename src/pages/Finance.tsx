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
import { getFinanceLogs, deleteFinanceLog } from '../lib/db';
import { formatCLP, getTodayChile, toChileDate } from '../lib/utils';

const SavingsCard = ({ metrics }: { metrics: any }) => {
  const income = metrics?.finance?.income || 0;
  const savings = metrics?.finance?.savings || 0;
  const savingsRate = metrics?.finance?.savingsRate || 0;
  const isPositive = savings >= 0;

  return (
    <div style={{
      background: '#ffffff',
      border: `1.5px solid ${isPositive
        ? 'rgba(74,144,104,0.3)'
        : 'rgba(201,64,64,0.3)'}`,
      borderRadius: '20px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#b08878',
            fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', margin: '0 0 4px' }}>
            Ahorro del mes
          </p>
          <p style={{ fontSize: '32px', fontWeight: 800,
            color: isPositive ? '#4a9068' : '#c94040',
            margin: 0, fontFamily: '"Outfit", sans-serif' }}>
            {isPositive ? '+' : ''}{formatCLP(savings)}
          </p>
        </div>
        <div style={{
          padding: '6px 14px',
          borderRadius: '100px',
          background: isPositive
            ? 'rgba(74,144,104,0.1)'
            : 'rgba(201,64,64,0.1)',
          color: isPositive ? '#4a9068' : '#c94040',
          fontSize: '14px', fontWeight: 800,
          fontFamily: '"Outfit", sans-serif',
        }}>
          {savingsRate}%
        </div>
      </div>

      {income > 0 && (
        <div style={{ display: 'flex',
          justifyContent: 'space-between',
          padding: '12px',
          background: 'rgba(193,96,58,0.04)',
          borderRadius: '12px' }}>
          <span style={{ fontSize: '13px',
            color: '#7a4a36' }}>
            Ingresos del mes
          </span>
          <span style={{ fontSize: '14px',
            fontWeight: 700, color: '#2d1a0e',
            fontFamily: '"Outfit", sans-serif' }}>
            {formatCLP(income)}
          </span>
        </div>
      )}

      {income === 0 && (
        <p style={{ fontSize: '12px', color: '#b08878',
          margin: 0, textAlign: 'center' }}>
          Registrá un ingreso para ver tu tasa de ahorro
        </p>
      )}
    </div>
  );
};

export const Finance: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [joseData, setJoseData] = useState<any>(null);
  const [antoData, setAntoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLogs = async () => {
    if (!users.jose || !users.anto) return;
    
    const [joseLogs, antoLogs] = await Promise.all([
      getFinanceLogs(users.jose.user.id),
      getFinanceLogs(users.anto.user.id)
    ]);

    const calculateMetrics = (rawLogs: any[], profile: any) => {
      const budget = profile?.monthlyBudgetCLP || 500000;
      
      const currentMonth = getTodayChile().slice(0, 7); // "YYYY-MM"
      const monthLogs = rawLogs.filter(l =>
        toChileDate(l.logged_at).slice(0, 7) === currentMonth
      );

      const gastos = monthLogs
        .filter(l => l.type === 'gasto')
        .reduce((sum, l) => sum + Number(l.amount), 0);
      const ingresos = monthLogs
        .filter(l => l.type === 'ingreso')
        .reduce((sum, l) => sum + Number(l.amount), 0);
      const ahorro = ingresos - gastos;
      const savingsRate = ingresos > 0
        ? Math.round((ahorro / ingresos) * 100)
        : 0;

      // Top spending category
      const categories: Record<string, number> = {};
      monthLogs.forEach(l => {
        if (l.type === 'gasto') categories[l.category] = (categories[l.category] || 0) + Number(l.amount);
      });
      const topCat = Object.entries(categories).sort((a,b) => b[1] - a[1])[0];

      return {
        finance: {
          spent: Math.round(gastos),
          income: Math.round(ingresos),
          savings: Math.round(ahorro),
          budget,
          savingsRate,
          compliance: Math.round((gastos / budget) * 100),
          topCategory: topCat ? { name: topCat[0], amount: Math.round(topCat[1]) } : { name: 'Sin datos', amount: 0 }
        }
      };
    };

    setJoseData({
      ...users.jose,
      metrics: { ...users.jose.metrics, ...calculateMetrics(joseLogs, users.jose?.user) },
      recentExpenses: joseLogs.slice(0, 10)
    });

    setAntoData({
      ...users.anto,
      metrics: { ...users.anto.metrics, ...calculateMetrics(antoLogs, users.anto?.user) },
      recentExpenses: antoLogs.slice(0, 10)
    });
    
    setLoading(false);
  };

  const joseId = users.jose?.user?.id;
  const antoId = users.anto?.user?.id;

  useEffect(() => {
    if (!joseId || !antoId) return;
    fetchLogs();
  }, [joseId, antoId, refreshKey]);

  const handleOpenExpenseModal = () => setIsExpenseModalOpen(true);
  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteFinanceLog(id);
      setRefreshKey(k => k + 1);
    } catch (e) {
      console.error('Delete failed:', e);
    }
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
                <SavingsCard metrics={currentDisplayData.metrics} />
                <ExpenseLogList 
                  logs={currentDisplayData.recentExpenses} 
                  color={currentDisplayData.user.color} 
                  onOpenAdd={handleOpenExpenseModal}
                  onDelete={handleDeleteExpense}
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FinanceStats user={joseData} />
              <SavingsCard metrics={joseData.metrics} />
              <ExpenseLogList 
                logs={joseData.recentExpenses} 
                color={joseData.user.color} 
                onOpenAdd={handleOpenExpenseModal}
                onDelete={handleDeleteExpense}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FinanceStats user={antoData} />
              <SavingsCard metrics={antoData.metrics} />
              <ExpenseLogList 
                logs={antoData.recentExpenses} 
                color={antoData.user.color} 
                onOpenAdd={handleOpenExpenseModal}
                onDelete={handleDeleteExpense}
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
