import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCouple } from '../hooks/useCouple';

/**
 * PURE CSS ONBOARDING
 * Uses high-end semantic classes and 100% inline layouts.
 */
export const Onboarding: React.FC = () => {
  const { setActiveUserId } = useCouple();
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<'jose' | 'anto' | null>(null);

  const startApp = (userId: 'jose' | 'anto') => {
    setActiveUserId(userId);
    localStorage.setItem('lifeos_onboarded', 'true');
    setFinished(true);
  };

  if (finished) return <Navigate to="/" replace />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#fdf6f0' }}>
      {step === 0 ? (
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#c1603a', color: '#ffffff', fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              J
            </div>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#d4849e', color: '#ffffff', fontSize: '24px', fontWeight: 800, marginLeft: '-16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              A
            </div>
          </div>
          <h1 style={{ marginTop: '24px', marginBottom: 0, textAlign: 'center', fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '48px', color: '#2d1a0e', lineHeight: 1.05, textTransform: 'lowercase' }}>
            nuestro OS
          </h1>
          <p style={{ marginTop: '8px', marginBottom: 0, textAlign: 'center', fontSize: '16px', color: '#b08878', fontWeight: 300 }}>
            tu sistema de vida, juntos.
          </p>
          <button className="btn-gold" onClick={() => setStep(1)} style={{ marginTop: '48px', width: '100%', maxWidth: '320px' }}>
            Comenzar →
          </button>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '36px', color: '#2d1a0e', textAlign: 'center', lineHeight: 1.1 }}>
              ¿quién sos hoy?
            </h2>
            <p style={{ marginTop: '8px', marginBottom: 0, fontSize: '13px', color: '#b08878', textAlign: 'center' }}>
              podés cambiar en cualquier momento
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              onClick={() => startApp('jose')}
              onMouseEnter={() => setHoveredCard('jose')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: '#ffffff',
                border: `1.5px solid ${hoveredCard === 'jose' ? '#c1603a' : '#e8d5c8'}`,
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '360px',
                margin: '0 auto',
                transition: 'all 0.2s',
                marginBottom: '12px',
                boxShadow: hoveredCard === 'jose' ? '0 8px 24px rgba(193,96,58,0.12)' : 'none',
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#c1603a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px' }}>J</div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '28px', lineHeight: 1, color: '#2d1a0e' }}>Jose</h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Usuario principal</p>
              </div>
            </button>

            <button
              onClick={() => startApp('anto')}
              onMouseEnter={() => setHoveredCard('anto')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: '#ffffff',
                border: `1.5px solid ${hoveredCard === 'anto' ? '#d4849e' : '#e8d5c8'}`,
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '360px',
                margin: '0 auto',
                transition: 'all 0.2s',
                marginBottom: '12px',
                boxShadow: hoveredCard === 'anto' ? '0 8px 24px rgba(193,96,58,0.12)' : 'none',
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#d4849e', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px' }}>A</div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '28px', lineHeight: 1, color: '#2d1a0e' }}>Anto</h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#b08878', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Usuaria principal</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
