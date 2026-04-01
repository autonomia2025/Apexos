import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { signIn } from '../lib/auth';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      localStorage.setItem('lifeos_onboarded', 'true');
      setFinished(true);
    } catch (err: any) {
      setError(err.message || 'Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
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
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ margin: 0, fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '32px', color: '#2d1a0e', lineHeight: 1.1 }}>
              Iniciar sesión
            </h2>
            <p style={{ marginTop: '8px', marginBottom: 0, fontSize: '13px', color: '#b08878' }}>
              Ingresá tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #e8d5c8',
                  background: '#ffffff',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#7a4a36', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contraseña</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #e8d5c8',
                  background: '#ffffff',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#c1603a', fontSize: '13px', textAlign: 'center', margin: 0 }}>
                {error}
              </p>
            )}

            <button 
              type="submit"
              className="btn-gold" 
              disabled={loading}
              style={{ marginTop: '12px', width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Entrando...' : 'Entrar →'}
            </button>

            <button 
              type="button"
              onClick={() => setStep(0)}
              style={{ background: 'none', border: 'none', color: '#b08878', fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}
            >
              ← Volver
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
