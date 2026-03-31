import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCouple } from '../hooks/useCouple';
import { UserId } from '../types';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserId | null>(null);
  const { users, setActiveUserId } = useCouple();
  const navigate = useNavigate();

  const handleStart = () => setStep(2);

  const handleFinish = () => {
    if (selectedUser) {
      setActiveUserId(selectedUser);
      localStorage.setItem('lifeos_onboarded', 'true');
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900 flex flex-col pt-safe pb-safe outline-none focus:outline-none">
       {/* Background glow effects */}
       <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/5 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full filter blur-[100px]" />
       </div>

       <div className="flex-1 flex items-center justify-center relative z-10 px-6">
          <AnimatePresence mode="wait">
             {step === 1 && (
                <motion.div
                   key="step1"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="text-center space-y-8 max-w-lg"
                >
                   <div className="space-y-4">
                     <div className="w-20 h-20 mx-auto rounded-2xl bg-gold-400/10 flex items-center justify-center border border-gold-400/30 mb-8">
                        <span className="text-4xl font-display font-bold text-gold-400">A</span>
                     </div>
                     <h1 className="text-4xl md:text-5xl font-display font-bold text-gold-400 tracking-tight">
                        APEX OS
                     </h1>
                     <p className="text-lg md:text-xl font-body text-gray-300">
                        Tu sistema operativo de vida.
                     </p>
                     <p className="text-sm font-body text-gray-500 max-w-sm mx-auto">
                        Diseñado para rendir al máximo, juntos.
                     </p>
                   </div>

                   <button
                     onClick={handleStart}
                     className="px-8 py-4 rounded-xl font-bold bg-gold-400 text-navy-900 hover:bg-gold-300 transition-all shadow-[0_0_20px_rgba(240,192,64,0.3)] active:scale-95"
                   >
                     Comenzar →
                   </button>
                </motion.div>
             )}

             {step === 2 && (
                <motion.div
                   key="step2"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="w-full max-w-xl text-center"
                >
                   <h2 className="text-3xl font-display font-bold text-white mb-10">
                     ¿Quién sos hoy?
                   </h2>

                   <div className="grid grid-cols-2 gap-4 md:gap-8 mb-12">
                      {(['jose', 'anto'] as const).map((uid) => {
                         const profile = users[uid].user;
                         const isSelected = selectedUser === uid;
                         
                         return (
                           <motion.button
                             key={uid}
                             whileTap={{ scale: 0.95 }}
                             onClick={() => setSelectedUser(uid)}
                             className={`relative p-6 md:p-8 rounded-3xl border transition-all flex flex-col items-center gap-4 filter ${
                               isSelected ? 'bg-white/10 scale-105' : 'bg-navy-800/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                             }`}
                             style={{ 
                                borderColor: isSelected ? profile.color : 'rgba(255,255,255,0.1)',
                                boxShadow: isSelected ? `0 0 30px ${profile.color}40` : 'none'
                             }}
                           >
                             <div 
                               className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold font-display shadow-inner"
                               style={{ backgroundColor: `${profile.color}22`, color: profile.color }}
                             >
                               {profile.initials}
                             </div>
                             <span className="text-xl font-bold text-white">{profile.name}</span>
                           </motion.button>
                         );
                      })}
                   </div>

                   <AnimatePresence>
                     {selectedUser && (
                       <motion.button
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 20 }}
                         onClick={handleFinish}
                         className="px-10 py-4 rounded-xl font-bold bg-gold-400 text-navy-900 hover:bg-gold-300 transition-all shadow-[0_0_20px_rgba(240,192,64,0.3)] active:scale-95"
                       >
                         Entrar →
                       </motion.button>
                     )}
                   </AnimatePresence>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
};
