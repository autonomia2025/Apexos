import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertTriangle, Target, Star } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { useCouple } from '../hooks/useCouple';
import { callAgent, AgentContext } from '../services/agentService';
import { UserData } from '../types';

export const WeeklyReview: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useCouple();

  const [aiMessageJose, setAiMessageJose] = useState<string | null>(null);
  const [aiMessageAnto, setAiMessageAnto] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(true);

  // Compute scores for a user
  const computeScores = (user: UserData) => {
    const nut = user.metrics.compliance;
    const fit = (user.metrics.trainingDays / 5) * 100;
    const learn = (user.metrics.studyHours / 10) * 100;
    const fin = Math.round((user.metrics.finance.spent / user.metrics.finance.budget) * 100);
    const finScore = fin <= 100 ? 100 : Math.max(0, 100 - (fin - 100)); // Simple normalization

    const total = Math.round((nut + fit + learn + finScore) / 4);

    return { nut, fit, learn, fin: finScore, total };
  };

  const scoresJose = computeScores(users.jose);
  const scoresAnto = computeScores(users.anto);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-gold-400 bg-gold-400/10 border-gold-400/30';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  const getCombinedContext = (userData: UserData): AgentContext => ({
    userName: userData.user.name,
    caloriasHoy: userData.metrics.calories.consumed,
    caloriasMeta: userData.metrics.calories.target,
    proteinaHoy: userData.metrics.macros.protein,
    proteinaMeta: Math.round(userData.metrics.calories.target * 0.3 / 4),
    pesoActual: 75,
    pesoMeta: 70,
    tendenciaPeso: 'bajando',
    cumplimientoSemana: userData.metrics.compliance,
    entrenosSemana: userData.metrics.trainingDays,
    metaEntrenosSemana: 5,
    ultimoEntreno: userData.recentWorkouts.length > 0 ? userData.recentWorkouts[0].type : 'Ninguno',
    rachaActual: userData.metrics.streak,
    pasosHoy: userData.metrics.steps,
    gastosMes: userData.metrics.finance.spent,
    presupuestoMes: userData.metrics.finance.budget,
    tasaAhorro: userData.metrics.finance.savingsRate,
    categoriaTopGasto: userData.metrics.finance.topCategory.name,
    cumplimientoPresupuesto: Math.round((userData.metrics.finance.spent / userData.metrics.finance.budget) * 100),
    horasEstaSemana: userData.metrics.studyHours,
    metaHorasSemana: 10,
    temaActivo: userData.metrics.learning.activeTopics[0] || 'Ninguno',
    recursoTipo: userData.recentLearning.length > 0 ? userData.recentLearning[0].resource : 'Ninguno'
  });

  useEffect(() => {
    const fetchAiCoaching = async () => {
      setIsLoadingAi(true);
      try {
        const [resJose, resAnto] = await Promise.all([
          callAgent('planner', users.jose.user.name, getCombinedContext(users.jose)),
          callAgent('planner', users.anto.user.name, getCombinedContext(users.anto))
        ]);
        setAiMessageJose(resJose);
        setAiMessageAnto(resAnto);
      } catch (e) {
        setAiMessageJose("Error al cargar insights. Mantente consistente con tus metas.");
        setAiMessageAnto("Error al cargar insights. Mantente consistente con tus metas.");
      } finally {
        setIsLoadingAi(false);
      }
    };

    fetchAiCoaching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHighlights = (user: UserData, scores: ReturnType<typeof computeScores>) => {
    const highlights = [];
    if (scores.fit >= 80) highlights.push({ type: 'good', text: `Racha de ${user.metrics.streak} días activa` });
    else highlights.push({ type: 'alert', text: `Entrenaste ${user.metrics.trainingDays} días de 5` });

    if (scores.nut >= 85) highlights.push({ type: 'good', text: 'Excelente adherencia calórica' });
    else highlights.push({ type: 'alert', text: 'Proteína por debajo de la meta' });

    if (scores.fin >= 80) highlights.push({ type: 'good', text: `Ahorro mensual del ${user.metrics.finance.savingsRate}%` });
    else highlights.push({ type: 'alert', text: `Gasto alto en ${user.metrics.finance.topCategory.name}` });

    return highlights;
  };

  const getLowestModule = (scores: ReturnType<typeof computeScores>) => {
    const entries = [
      { name: 'Nutrición', value: scores.nut, color: 'text-green-400' },
      { name: 'Fitness', value: scores.fit, color: 'text-blue-400' },
      { name: 'Finanzas', value: scores.fin, color: 'text-gold-400' },
      { name: 'Aprendizaje', value: scores.learn, color: 'text-purple-400' },
    ];
    return entries.sort((a, b) => a.value - b.value)[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed inset-0 z-50 bg-navy-900 overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 mt-safe">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Semana del 18 al 24 May
            </h1>
            <p className="text-sm font-body text-gray-400 mt-1 uppercase tracking-widest font-bold">
              Tu resumen de la semana
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-12">
          
          {/* Section 1: Resumen de pareja */}
          <section>
            <h2 className="text-lg font-display font-bold text-gold-300 mb-6 flex items-center gap-2">
              <Star size={18} /> Score Semanal
            </h2>
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {([
                { u: users.jose, s: scoresJose }, 
                { u: users.anto, s: scoresAnto }
              ] as const).map(({ u, s }) => (
                <GlassCard key={u.user.id} className="p-5 flex flex-col items-center">
                   <div 
                     className="w-12 h-12 rounded-full mb-3 flex items-center justify-center font-bold font-display shadow-lg border border-white/10"
                     style={{ backgroundColor: `${u.user.color}15`, color: u.user.color }}
                   >
                     {u.user.initials}
                   </div>
                   <div className={`text-4xl md:text-5xl font-display font-bold mb-2 border px-4 py-1 rounded-2xl ${getScoreColor(s.total)}`}>
                     {s.total}
                   </div>
                   
                   <div className="w-full mt-4 space-y-2 border-t border-white/5 pt-4">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">NUT</span>
                        <span className="text-gray-200">{s.nut}%</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">FIT</span>
                        <span className="text-gray-200">{s.fit.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">LRN</span>
                        <span className="text-gray-200">{s.learn.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">FIN</span>
                        <span className="text-gray-200">{s.fin}%</span>
                      </div>
                   </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Section 2: Highlights */}
          <section>
            <h2 className="text-lg font-display font-bold text-gold-300 mb-6 flex items-center gap-2">
              <Target size={18} /> Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {([
                { u: users.jose, s: scoresJose }, 
                { u: users.anto, s: scoresAnto }
              ] as const).map(({ u, s }) => (
                <div key={u.user.id} className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">{u.user.name}</h3>
                  {getHighlights(u, s).map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
                        h.type === 'good' 
                          ? 'bg-green-400/5 border-green-400/20 text-green-300' 
                          : 'bg-yellow-400/5 border-yellow-400/20 text-yellow-300'
                      }`}
                    >
                      {h.type === 'good' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                      {h.text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: AI Weekly Coach */}
          <section>
             <h2 className="text-lg font-display font-bold text-gold-300 mb-6 font-mono tracking-widest uppercase text-center bg-gold-400/5 py-4 border-y border-gold-400/20">
              Coaching Inteligente
             </h2>
             <div className="space-y-6">
                {[
                  { u: users.jose, msg: aiMessageJose }, 
                  { u: users.anto, msg: aiMessageAnto }
                ].map(({ u, msg }) => (
                  <GlassCard key={u.user.id} className="p-6 relative overflow-hidden group">
                     <div 
                        className="absolute inset-0 opacity-10 blur-2xl z-0 transition-opacity group-hover:opacity-20"
                        style={{ backgroundColor: u.user.color }}
                     />
                     <div className="relative z-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: u.user.color }}>
                          Para {u.user.name}
                        </h3>
                        {isLoadingAi ? (
                          <div className="flex gap-2 py-4">
                            {[1, 2, 3].map((i) => (
                              <div 
                                key={i} 
                                className="w-2 h-2 rounded-full animate-bounce" 
                                style={{ backgroundColor: u.user.color, animationDelay: `${i * 150}ms` }} 
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-200 text-sm md:text-base leading-relaxed italic pr-4">
                            "{msg}"
                          </p>
                        )}
                     </div>
                  </GlassCard>
                ))}
             </div>
          </section>

          {/* Section 4: Próxima semana */}
          <section>
            <h2 className="text-lg font-display font-bold text-white mb-6">Próxima Semana</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
               {([
                { u: users.jose, s: scoresJose }, 
                { u: users.anto, s: scoresAnto }
              ] as const).map(({ u, s }) => {
                 const focus = getLowestModule(s);
                 return (
                   <GlassCard key={u.user.id} className="p-5 border-gold-400/30">
                     <p className="text-sm text-gray-400 mb-1">El enfoque principal de {u.user.name} debe ser:</p>
                     <p className={`text-xl font-display font-bold ${focus.color}`}>
                       {focus.name}
                     </p>
                   </GlassCard>
                 );
               })}
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
};
