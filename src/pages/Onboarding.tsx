import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useCouple } from '../hooks/useCouple';

/**
 * PURE CSS ONBOARDING
 * Uses high-end semantic classes and 100% inline layouts.
 */
export const Onboarding: React.FC = () => {
  const { setActiveUserId } = useCouple();
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);

  const startApp = (userId: 'jose' | 'anto') => {
    setActiveUserId(userId);
    localStorage.setItem('lifeos_onboarded', 'true');
    setFinished(true);
  };

  if (finished) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(620px_320px_at_20%_12%,rgba(74,144,217,0.2),transparent_70%),radial-gradient(560px_300px_at_92%_8%,rgba(240,192,64,0.16),transparent_72%),linear-gradient(180deg,#08142b_0%,#030918_60%,#01040e_100%)]">
      {step === 0 ? (
        <div className="text-center max-w-md w-full glass-gold p-8">
          <div className="w-16 h-16 rounded-2xl bg-gold-400/10 flex items-center justify-center mx-auto mb-8 border border-gold-400/30 shadow-[0_0_28px_rgba(240,192,64,0.16)]">
            <Sparkles size={32} color="#f0c040" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold-300 font-semibold">Bienvenido</span>
          <h1 className="mt-2 mb-4 text-[42px] leading-none">Apex Operating System</h1>
          <p className="text-gray-300/80 mb-8 text-[15px] leading-relaxed">
            Tu plataforma personal de alto rendimiento para gestionar nutrición, finanzas y metas.
          </p>
          <button className="btn-gold" onClick={() => setStep(1)}>
            INICIAR SISTEMA <ChevronRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
             <span className="text-[10px] font-semibold text-gold-400 tracking-[0.2em] uppercase">Configuracion</span>
             <h2 className="mt-2 text-[38px] leading-none">¿Quién está operando?</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              className="glass" 
              onClick={() => startApp('jose')}
              style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(74,144,217,0.2)', color: '#4a90d9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '1px solid rgba(74,144,217,0.35)' }}>J</div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: '28px', lineHeight: 1 }}>Jose</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Socio Fundador</p>
              </div>
            </button>

            <button
              className="glass" 
              onClick={() => startApp('anto')}
              style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(232,121,160,0.2)', color: '#e879a0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '1px solid rgba(232,121,160,0.35)' }}>A</div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: '28px', lineHeight: 1 }}>Anto</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Socia Fundadora</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
