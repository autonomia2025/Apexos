import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CoupleProvider } from './context/CoupleContext';

// Components
import { Onboarding } from './pages/Onboarding';
import { Tablio } from './pages/Tablio';
import { MobileNav } from './components/layout/MobileNav';
import { DesktopSideNav } from './components/layout/DesktopSideNav';

// Lazy-loaded pages
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Nutrition = React.lazy(() => import('./pages/Nutrition').then(m => ({ default: m.Nutrition })));
const Fitness = React.lazy(() => import('./pages/Fitness').then(m => ({ default: m.Fitness })));
const Finance = React.lazy(() => import('./pages/Finance').then(m => ({ default: m.Finance })));
const Learn = React.lazy(() => import('./pages/Learn').then(m => ({ default: m.Learn })));
const Goals = React.lazy(() => import('./pages/Goals').then(m => ({ default: m.Goals })));
const WeeklyReview = React.lazy(() => import('./pages/WeeklyReview').then(m => ({ default: m.WeeklyReview })));

const LoadingFallback = () => (
  <div className="fixed inset-0 bg-navy-900 flex items-center justify-center z-[100]">
    <div className="w-12 h-12 border-4 border-gold-400/20 border-t-gold-400 rounded-full animate-spin" />
  </div>
);

// Protected route to check onboarding state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const flag = localStorage.getItem('lifeos_onboarded');
    setIsOnboarded(flag === 'true');
  }, []);

  if (isOnboarded === null) return <LoadingFallback />;
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
        <Suspense fallback={<LoadingFallback />}>
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
