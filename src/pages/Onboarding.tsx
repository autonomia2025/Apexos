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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#fdf6f0' }}>
      {step === 0 ? (
        <div className="glass-gold" style={{ textAlign: 'center', maxWidth: '448px', width: '100%', padding: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(193,96,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', border: '1px solid rgba(193,96,58,0.3)', boxShadow: '0 0 28px rgba(193,96,58,0.16)' }}>
            <Sparkles size={32} color="#c1603a" />
          </div>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#d4724a', fontWeight: 600 }}>Bienvenido</span>
          <h1 style={{ marginTop: '8px', marginBottom: '16px', fontSize: '42px', lineHeight: 1 }}>Apex Operating System</h1>
          <p style={{ color: 'rgba(209,213,219,0.8)', marginBottom: '32px', fontSize: '15px', lineHeight: 1.6 }}>
            Tu plataforma personal de alto rendimiento para gestionar nutrición, finanzas y metas.
          </p>
          <button className="btn-gold" onClick={() => setStep(1)}>
            INICIAR SISTEMA <ChevronRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </button>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '512px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
             <span style={{ fontSize: '10px', fontWeight: 600, color: '#c1603a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Configuracion</span>
             <h2 style={{ marginTop: '8px', fontSize: '38px', lineHeight: 1 }}>¿Quién está operando?</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <button
              className="glass" 
              onClick={() => startApp('jose')}
              style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(193,96,58,0.2)', color: '#c1603a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '1px solid rgba(193,96,58,0.35)' }}>J</div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: '28px', lineHeight: 1 }}>Jose</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#b08878', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Socio Fundador</p>
              </div>
            </button>

            <button
              className="glass" 
              onClick={() => startApp('anto')}
              style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(212,132,158,0.2)', color: '#d4849e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '1px solid rgba(212,132,158,0.35)' }}>A</div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: '28px', lineHeight: 1 }}>Anto</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#b08878', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Socia Fundadora</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
