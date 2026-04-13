import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CoupleProvider } from './context/CoupleContext';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// Navigation Components
import { MobileNav, DesktopSideNav } from './components/layout/Navigation';

// Pages — static (load immediately)
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';

// Pages — lazy loaded for performance
const Nutrition = lazy(() =>
  import('./pages/Nutrition').then(m => ({ default: m.Nutrition }))
);
const Fitness = lazy(() =>
  import('./pages/Fitness').then(m => ({ default: m.Fitness }))
);
const Finance = lazy(() =>
  import('./pages/Finance').then(m => ({ default: m.Finance }))
);
const Learn = lazy(() =>
  import('./pages/Learn').then(m => ({ default: m.Learn }))
);
const Goals = lazy(() =>
  import('./pages/Goals').then(m => ({ default: m.Goals }))
);
const WeeklyReview = lazy(() =>
  import('./pages/WeeklyReview').then(m => ({ default: m.WeeklyReview }))
);
const Tablio = lazy(() =>
  import('./pages/Tablio').then(m => ({ default: m.Tablio }))
);
const SettingsPage = lazy(() =>
  import('./pages/Settings').then(m => ({ default: m.SettingsPage }))
);

const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    background: '#fdf6f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#c1603a',
          animation: 'pulse-dot 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

// Protected route to check session state
const ProtectedRoute = ({ children, session }: { children: React.ReactNode, session: Session | null }) => {
  if (!session) return <Navigate to="/onboarding" replace />;

  return (
    <>
      <DesktopSideNav />
      {children}
      <MobileNav />
    </>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <Router>
      <CoupleProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/onboarding" element={session ? <Navigate to="/" replace /> : <Onboarding />} />

            <Route path="/" element={<ProtectedRoute session={session}><Home /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute session={session}><Nutrition /></ProtectedRoute>} />
            <Route path="/fitness" element={<ProtectedRoute session={session}><Fitness /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute session={session}><Finance /></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute session={session}><Learn /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute session={session}><Goals /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute session={session}><WeeklyReview /></ProtectedRoute>} />
            <Route path="/tablio" element={<ProtectedRoute session={session}><Tablio /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute session={session}><SettingsPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </CoupleProvider>
    </Router>
  );
};

export default App;
