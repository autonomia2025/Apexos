import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Footprints } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ModuleHeader } from '../components/layout/ModuleHeader';
import { AgentMessage } from '../components/ui/AgentMessage';
import { FitnessStats } from '../components/modules/fitness/FitnessStats';
import { ActivityGrid } from '../components/modules/fitness/ActivityGrid';
import { WorkoutLogList } from '../components/modules/fitness/WorkoutLogList';
import { WorkoutModal } from '../components/modules/fitness/WorkoutModal';
import { WeeklyChart } from '../components/modules/fitness/WeeklyChart';
import { useCouple } from '../hooks/useCouple';
import { useActiveUser } from '../hooks/useActiveUser';
import { FitnessContext } from '../services/agentService';
import { getFitnessLogs } from '../lib/db';
import { supabase } from '../lib/supabase';

const StepsCard = ({ user, onUpdate }: { 
  user: any; 
  onUpdate: () => void; 
}) => {
  const [steps, setSteps] = useState('');
  const [saving, setSaving] = useState(false);
  const todaySteps = user.metrics.steps || 0;

  const handleSave = async () => {
    if (!steps || !user.user.id) return;
    setSaving(true);
    try {
      await supabase
        .from('daily_checkins')
        .upsert({
          user_id: user.user.id,
          checkin_date: new Date().toISOString().split('T')[0],
          steps: parseInt(steps) || 0
        }, { onConflict: 'user_id,checkin_date' });
      
      await supabase.from('fitness_logs').insert({
        user_id: user.user.id,
        workout_type: 'Cardio',
        duration_min: 0,
        notes: `pasos:${steps}`,
      });
      setSteps('');
      onUpdate();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e8d5c8',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `${user.user.color}15`,
        border: `1px solid ${user.user.color}30`,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        <Footprints size={20} color={user.user.color} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '11px', color: '#b08878', 
          fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', margin: '0 0 2px' }}>
          Pasos hoy
        </p>
        <p style={{ fontSize: '22px', fontWeight: 800,
          color: '#2d1a0e', margin: 0 }}>
          {todaySteps.toLocaleString('es-CL')}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="number"
          value={steps}
          onChange={e => setSteps(e.target.value)}
          placeholder="Actualizar"
          style={{
            width: '100px', padding: '8px 12px',
            borderRadius: '10px', border: '1.5px solid #e8d5c8',
            background: '#fdf6f0', fontFamily: '"Outfit", sans-serif',
            fontSize: '14px', outline: 'none', color: '#2d1a0e',
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving || !steps}
          style={{
            padding: '8px 14px', borderRadius: '10px',
            background: user.user.color, color: '#fff',
            border: 'none', fontWeight: 700, fontSize: '13px',
            cursor: steps ? 'pointer' : 'not-allowed',
            opacity: steps ? 1 : 0.5,
            fontFamily: '"Outfit", sans-serif',
          }}
        >
          {saving ? '...' : 'OK'}
        </button>
      </div>
    </div>
  );
};

export const Fitness: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUserData = useActiveUser();
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [joseData, setJoseData] = useState<any>(null);
  const [antoData, setAntoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLogs = async () => {
    if (!users.jose?.user?.id || !users.anto?.user?.id) return;
    
    try {
      const [joseFitness, antoFitness] = await Promise.all([
        getFitnessLogs(users.jose.user.id),
        getFitnessLogs(users.anto.user.id)
      ]);

      const calculateMetrics = (logs: any[], steps: number) => {
        const trainingDays = new Set(logs.map(l => l.logged_at.split('T')[0])).size;
        return {
          trainingDays,
          streak: 0,
          steps
        };
      };

      setJoseData({
        ...users.jose,
        metrics: { ...users.jose.metrics, ...calculateMetrics(joseFitness.logs, joseFitness.todaySteps) },
        recentWorkouts: joseFitness.logs.slice(0, 5)
      });

      setAntoData({
        ...users.anto,
        metrics: { ...users.anto.metrics, ...calculateMetrics(antoFitness.logs, antoFitness.todaySteps) },
        recentWorkouts: antoFitness.logs.slice(0, 5)
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching fitness logs:', err);
      setLoading(false);
    }
  };

  const joseId = users.jose?.user?.id;
  const antoId = users.anto?.user?.id;

  useEffect(() => {
    if (!joseId || !antoId) return;
    fetchLogs();
  }, [joseId, antoId, refreshKey]);

  const handleOpenWorkoutModal = () => setIsWorkoutModalOpen(true);
  const handleCloseWorkoutModal = () => {
    setIsWorkoutModalOpen(false);
    setRefreshKey(k => k + 1);
  };

  if (loading || !joseData || !antoData) {
    return <PageWrapper><div style={{ padding: '40px', textAlign: 'center', color: '#b08878' }}>Cargando fitness...</div></PageWrapper>;
  }

  const currentDisplayData = activeUserData.user.role === 'jose' ? joseData : antoData;

  const getFitnessContext = (userData: any): FitnessContext => ({
    userName: userData.user.name,
    entrenosSemana: userData.metrics.trainingDays,
    metaEntrenosSemana: 5,
    ultimoEntreno: userData.recentWorkouts.length > 0 ? `${userData.recentWorkouts[0].workout_type}` : 'Ninguno reciente',
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
            agentType="fitness"
            userName={currentDisplayData.user.name}
            color={currentDisplayData.user.color} 
            contextData={getFitnessContext(currentDisplayData)}
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
                <FitnessStats user={currentDisplayData} />
                <WeeklyChart logs={currentDisplayData.recentWorkouts} color={currentDisplayData.user.color} userName={currentDisplayData.user.name} />
                <ActivityGrid user={currentDisplayData} />
                <StepsCard user={currentDisplayData} onUpdate={fetchLogs} />
                <WorkoutLogList 
                  logs={currentDisplayData.recentWorkouts} 
                  color={currentDisplayData.user.color} 
                  onOpenAdd={handleOpenWorkoutModal}
                />
             </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FitnessStats user={joseData} />
              <WeeklyChart logs={joseData.recentWorkouts} color={joseData.user.color} userName={joseData.user.name} />
              <ActivityGrid user={joseData} />
              <StepsCard user={joseData} onUpdate={fetchLogs} />
              <WorkoutLogList 
                logs={joseData.recentWorkouts} 
                color={joseData.user.color} 
                onOpenAdd={handleOpenWorkoutModal}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FitnessStats user={antoData} />
              <WeeklyChart logs={antoData.recentWorkouts} color={antoData.user.color} userName={antoData.user.name} />
              <ActivityGrid user={antoData} />
              <StepsCard user={antoData} onUpdate={fetchLogs} />
              <WorkoutLogList 
                logs={antoData.recentWorkouts} 
                color={antoData.user.color} 
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
