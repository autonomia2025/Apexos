import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Target, Droplets, CheckCircle, Flame } from 'lucide-react';
import { useCouple } from '../../../hooks/useCouple';
import { useActiveUser } from '../../../hooks/useActiveUser';
import { GlassCard } from '../../ui/GlassCard';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const { activeUserId } = useCouple();
  const activeUserData = useActiveUser();
  const profile = activeUserData.user;
  
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [water, setWater] = useState<number>(0);
  const [goalMet, setGoalMet] = useState<boolean | null>(null);

  const moods = [
    { value: 1, emoji: '😫' },
    { value: 2, emoji: '🙁' },
    { value: 3, emoji: '😐' },
    { value: 4, emoji: '🙂' },
    { value: 5, emoji: '🔥' },
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  
  const handleClose = () => {
    setStep(1);
    setMood(null);
    setWeight('');
    setWater(0);
    setGoalMet(null);
    onClose();
  };

  const getAiMessage = () => {
    if (mood && mood >= 4 && goalMet) {
      return `¡Increíble día, ${profile.name}! Cumpliste tu objetivo y tu energía está a tope. Racha aumentada en +1 🔥.`;
    } else if (mood && mood <= 2) {
      return `Día difícil hoy, ${profile.name}. Recuerda que el descanso también es parte del proceso. Mañana será mejor.`;
    }
    return `Buen trabajo haciendo check-in, ${profile.name}. Mantener el registro es clave para la consistencia.`;
  };

  // Prevent scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:w-full sm:max-w-md h-[85vh] sm:h-auto sm:min-h-[500px] z-50 bg-navy-900 border border-gold-400/20 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden glass-panel-gold border-b-0 sm:border-b"
          >
            {/* Drag Handle (Mobile) */}
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 relative">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="w-2 h-2 rounded-full transition-colors duration-300"
                    style={{ 
                      backgroundColor: i === step ? profile.color : i < step ? 'var(--gold-400)' : 'rgba(255,255,255,0.2)' 
                    }}
                  />
                ))}
              </div>
              <button onClick={handleClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 relative">
              
              {/* --- STEP 1: MOOD --- */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                     key="step1"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="h-full flex flex-col justify-center"
                  >
                    <h2 className="text-2xl font-display font-bold text-center mb-10 text-white">
                      ¿Cómo te sentís hoy, {profile.name}?
                    </h2>
                    
                    <div className="flex justify-between px-2">
                      {moods.map((m) => (
                        <motion.button
                          key={m.value}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setMood(m.value); setTimeout(handleNext, 300); }}
                          className={`text-4xl sm:text-5xl transition-all duration-300 filter ${
                            mood === m.value 
                              ? 'scale-125 saturate-150 drop-shadow-md' 
                              : mood ? 'grayscale opacity-30 scale-90' : 'hover:saturate-150'
                          }`}
                          style={{
                            filter: mood === m.value ? `drop-shadow(0 0 15px ${profile.color}66)` : undefined
                          }}
                        >
                          {m.emoji}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* --- STEP 2: QUICK STATS --- */}
                {step === 2 && (
                  <motion.div
                     key="step2"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="flex flex-col gap-8"
                  >
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gold-300">Peso de hoy (kg)</label>
                      <input 
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Ej. 75.4"
                        className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-gold-400/50 transition-colors"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gold-300 flex items-center gap-2">
                        <Droplets size={16} className="text-blue-400" /> Agua (vasos)
                      </label>
                      <div className="flex items-center justify-between bg-navy-800 rounded-xl border border-white/10 overflow-hidden">
                         <button 
                           onClick={() => setWater(Math.max(0, water - 1))}
                           className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white text-xl active:scale-95 transition-transform"
                         >-</button>
                         <span className="font-mono text-2xl font-bold">{water}</span>
                         <button 
                           onClick={() => setWater(water + 1)}
                           className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white text-xl active:scale-95 transition-transform"
                         >+</button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-gold-300 flex items-center gap-2">
                        <Target size={16} className="text-red-400" /> ¿Cumpliste tu objetivo principal hoy?
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                         <button
                           onClick={() => setGoalMet(true)}
                           className={`py-3 rounded-xl border font-bold transition-colors ${
                              goalMet === true 
                                ? 'bg-gold-400/20 border-gold-400 text-gold-300' 
                                : 'bg-navy-800 border-white/10 text-gray-400 hover:border-white/30'
                           }`}
                         >
                           Sí
                         </button>
                         <button
                           onClick={() => setGoalMet(false)}
                           className={`py-3 rounded-xl border font-bold transition-colors ${
                              goalMet === false 
                                ? 'bg-red-400/20 border-red-400 text-red-300' 
                                : 'bg-navy-800 border-white/10 text-gray-400 hover:border-white/30'
                           }`}
                         >
                           No
                         </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* --- STEP 3: AI SUMMARY --- */}
                {step === 3 && (
                  <motion.div
                     key="step3"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="h-full flex flex-col items-center justify-center text-center space-y-8"
                  >
                     <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="w-20 h-20 rounded-full bg-gold-400/20 flex items-center justify-center border-2 border-gold-400 shadow-[0_0_30px_rgba(240,192,64,0.3)]"
                     >
                       <CheckCircle size={40} className="text-gold-400" />
                     </motion.div>
                     
                     <div className="space-y-4">
                       <h3 className="text-2xl font-display font-bold text-white">¡Check-in Completo!</h3>
                       <GlassCard className="p-4 bg-navy-800/50 border-gold-400/30">
                         <p className="text-gray-300 text-sm italic leading-relaxed">
                           "{getAiMessage()}"
                         </p>
                       </GlassCard>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

             {/* Footer Actions */}
             <div className="p-6 border-t border-white/5 flex justify-between gap-4">
              {step > 1 && step < 3 && (
                 <button 
                  onClick={handleBack}
                  className="px-4 py-3 rounded-xl font-bold flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                 >
                   <ArrowLeft size={18} /> Atrás
                 </button>
              )}
              
              <div className="flex-1" />

              {step === 2 && (
                <button 
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 bg-gold-400 text-navy-900 hover:bg-gold-300 transition-colors shadow-lg active:scale-95"
                >
                  Siguiente <ArrowRight size={18} />
                </button>
              )}

              {step === 3 && (
                <button 
                  onClick={handleClose}
                  className="w-full px-6 py-4 rounded-xl font-bold text-center bg-gold-400 text-navy-900 hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20 active:scale-95"
                >
                  Cerrar
                </button>
              )}
            </div>
            
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
