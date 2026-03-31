import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Zap } from 'lucide-react';
import { useCouple } from '../context/CoupleContext';

/**
 * HIGH-END ONBOARDING EXPERIENCE
 * Cinematic entry flow with premium glass interactions.
 */
export const Onboarding: React.FC = () => {
  const { setActiveUserId } = useCouple();
  const [step, setStep] = useState(0);

  const startApp = (userId: 'jose' | 'anto') => {
    setActiveUserId(userId);
    localStorage.setItem('lifeos_onboarded', 'true');
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background Cinematic Atmos */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-gold-400/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-900 to-transparent blur-[120px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            className="flex flex-col items-center text-center max-w-lg z-10"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-20 h-20 bg-gold-400/10 rounded-[2.5rem] flex items-center justify-center border border-gold-400/20 mb-10 shadow-[0_0_50px_rgba(240,192,64,0.15)]"
            >
              <Sparkles size={36} className="text-gold-400" />
            </motion.div>
            
            <h1 className="text-6xl font-display font-medium text-white mb-6 tracking-tight leading-tight">
              Bienvenido al <br />
              <span className="italic text-gold-200">Apex Operating System</span>
            </h1>
            
            <p className="text-sm font-body text-gray-400 mb-12 max-w-sm leading-relaxed tracking-wide uppercase font-bold opacity-60">
              Personalized Life Optimization for High Performance Couples
            </p>
            
            <button 
              onClick={() => setStep(1)}
              className="px-10 py-5 bg-gold-400 text-navy-950 rounded-2xl font-bold flex items-center gap-3 shadow-[0_15px_35px_rgba(240,192,64,0.3)] hover:scale-105 active:scale-95 transition-all group"
            >
              INICIAR SISTEMA <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="user-select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center z-10 w-full max-w-3xl"
          >
            <div className="text-center mb-16 space-y-2">
               <span className="text-[10px] font-mono text-gold-400 uppercase tracking-[0.4em] font-bold">Protocolo de Acceso</span>
               <h2 className="text-4xl font-display font-bold text-white italic">¿Quién está al mando hoy?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {[
                { id: 'jose', name: 'Jose', initials: 'J', color: '#4a90d9', desc: 'Socio Fundador & Dev' },
                { id: 'anto', name: 'Anto', initials: 'A', color: '#e879a0', desc: 'Socia Fundadora & PM' }
              ].map((u) => (
                <motion.div
                  key={u.id}
                  whileHover={{ y: -8 }}
                  onClick={() => startApp(u.id as 'jose' | 'anto')}
                  className="relative group cursor-pointer"
                >
                  <div 
                    className="absolute inset-0 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" 
                    style={{ backgroundColor: u.color }} 
                  />
                  
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center group-hover:border-white/20 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                    <div 
                      className="w-24 h-24 rounded-3xl flex items-center justify-center font-display font-bold text-3xl mb-8 border border-white/10 shadow-inner ring-1 ring-white/5"
                      style={{ backgroundColor: `${u.color}33`, color: u.color }}
                    >
                      {u.initials}
                    </div>
                    
                    <h3 className="text-3xl font-display font-bold text-white mb-2 leading-none">{u.name}</h3>
                    <p className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-bold mb-8">{u.desc}</p>
                    
                    <div className="flex items-center gap-2 text- gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Zap size={14} className="animate-pulse" />
                       <span className="text-[10px] font-bold tracking-widest uppercase">Activar Biometría</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer Branding */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-20">
         <div className="w-10 h-px bg-white" />
         <span className="text-[8px] font-mono tracking-[0.6em] text-white uppercase font-bold">Autonomía 2024</span>
      </div>
    </div>
  );
};
