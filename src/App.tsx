import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CoupleProvider } from './context/CoupleContext';

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

// Protected route to check onboarding state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('lifeos_onboarded') === 'true';
  });

  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  return (
    <>
      <DesktopSideNav />
      {children}
      <MobileNav />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <CoupleProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />

            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
            <Route path="/fitness" element={<ProtectedRoute><Fitness /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><WeeklyReview /></ProtectedRoute>} />
            <Route path="/tablio" element={<ProtectedRoute><Tablio /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </CoupleProvider>
    </Router>
  );
};

export default App;
