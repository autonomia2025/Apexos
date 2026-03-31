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
    if (score >= 80) return { color: '#c1603a', background: 'rgba(193,96,58,0.1)', borderColor: 'rgba(193,96,58,0.3)' };
    if (score >= 60) return { color: '#d4922a', background: 'rgba(250,204,21,0.1)', borderColor: 'rgba(250,204,21,0.3)' };
    return { color: '#c94040', background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)' };
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
      { name: 'Nutrición', value: scores.nut },
      { name: 'Fitness', value: scores.fit },
      { name: 'Finanzas', value: scores.fin },
      { name: 'Aprendizaje', value: scores.learn },
    ];
    return entries.sort((a, b) => a.value - b.value)[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', damping: 20 }}
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#ffffff', overflowY: 'auto' }}
    >
      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '16px', paddingBottom: '96px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', marginTop: '8px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', letterSpacing: '-0.01em' }}>
              Semana del 18 al 24 May
            </h1>
            <p style={{ fontSize: '14px', color: '#b08878', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Tu resumen de la semana
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            style={{ width: '40px', height: '40px', borderRadius: '999px', background: 'rgba(193,96,58,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b08878', border: 'none', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          
          {/* Section 1: Resumen de pareja */}
          <section>
            <h2 style={{ fontSize: '18px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#d4724a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} /> Score Semanal
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {([
                { u: users.jose, s: scoresJose }, 
                { u: users.anto, s: scoresAnto }
              ] as const).map(({ u, s }) => (
                <GlassCard key={u.user.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div 
                     style={{ width: '48px', height: '48px', borderRadius: '999px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: '"Outfit", sans-serif', boxShadow: '0 8px 16px rgba(180, 100, 60, 0.08)', border: '1px solid rgba(193,96,58,0.15)', backgroundColor: `${u.user.color}15`, color: u.user.color }}
                    >
                     {u.user.initials}
                   </div>
                   <div style={{ fontSize: '40px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, marginBottom: '8px', border: '1px solid', padding: '4px 16px', borderRadius: '16px', ...getScoreColor(s.total) }}>
                     {s.total}
                   </div>
                    
                   <div style={{ width: '100%', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(193,96,58,0.08)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: '"Outfit", sans-serif' }}>
                        <span style={{ color: '#b08878' }}>NUT</span>
                        <span style={{ color: '#2d1a0e' }}>{s.nut}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: '"Outfit", sans-serif' }}>
                        <span style={{ color: '#b08878' }}>FIT</span>
                        <span style={{ color: '#2d1a0e' }}>{s.fit.toFixed(0)}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: '"Outfit", sans-serif' }}>
                        <span style={{ color: '#b08878' }}>LRN</span>
                        <span style={{ color: '#2d1a0e' }}>{s.learn.toFixed(0)}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: '"Outfit", sans-serif' }}>
                        <span style={{ color: '#b08878' }}>FIN</span>
                        <span style={{ color: '#2d1a0e' }}>{s.fin}%</span>
                      </div>
                   </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Section 2: Highlights */}
          <section>
            <h2 style={{ fontSize: '18px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#d4724a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} /> Highlights
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {([
                { u: users.jose, s: scoresJose }, 
                { u: users.anto, s: scoresAnto }
              ] as const).map(({ u, s }) => (
                <div key={u.user.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }}>{u.user.name}</h3>
                  {getHighlights(u, s).map((h, i) => (
                    <div 
                      key={i} 
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${h.type === 'good' ? 'rgba(74,222,128,0.2)' : 'rgba(250,204,21,0.2)'}`, fontSize: '14px', fontWeight: 500, color: h.type === 'good' ? '#4a9068' : '#7a4a36', background: h.type === 'good' ? 'rgba(74,222,128,0.05)' : 'rgba(250,204,21,0.05)' }}
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
             <h2 style={{ fontSize: '18px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#d4724a', marginBottom: '24px', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', background: 'rgba(193,96,58,0.05)', padding: '16px 0', borderTop: '1px solid rgba(193,96,58,0.2)', borderBottom: '1px solid rgba(193,96,58,0.2)' }}>
               Coaching Inteligente
             </h2>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { u: users.jose, msg: aiMessageJose }, 
                  { u: users.anto, msg: aiMessageAnto }
                ].map(({ u, msg }) => (
                  <GlassCard key={u.user.id} style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                     <div 
                        style={{ position: 'absolute', inset: 0, opacity: 0.1, filter: 'blur(24px)', zIndex: 0, backgroundColor: u.user.color }}
                     />
                     <div style={{ position: 'relative', zIndex: 10 }}>
                        <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', color: u.user.color }}>
                          Para {u.user.name}
                        </h3>
                        {isLoadingAi ? (
                          <div style={{ display: 'flex', gap: '8px', padding: '16px 0' }}>
                            {[1, 2, 3].map((i) => (
                              <div 
                                key={i} 
                                style={{ width: '8px', height: '8px', borderRadius: '999px', backgroundColor: u.user.color, transform: `translateY(${i % 2 === 0 ? 0 : -2}px)` }} 
                              />
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: '#2d1a0e', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic', paddingRight: '16px' }}>
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
            <h2 style={{ fontSize: '18px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', marginBottom: '24px' }}>Próxima Semana</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
               {([
                { u: users.jose, s: scoresJose }, 
                { u: users.anto, s: scoresAnto }
              ] as const).map(({ u, s }) => {
                 const focus = getLowestModule(s);
                 return (
                    <GlassCard key={u.user.id} style={{ padding: '20px', borderColor: 'rgba(193,96,58,0.3)' }}>
                      <p style={{ fontSize: '14px', color: '#b08878', marginBottom: '4px' }}>El enfoque principal de {u.user.name} debe ser:</p>
                      <p style={{ fontSize: '20px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: focus.name === 'Nutrición' ? '#4a9068' : focus.name === 'Fitness' ? '#c1603a' : focus.name === 'Finanzas' ? '#c1603a' : '#d4849e' }}>
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
