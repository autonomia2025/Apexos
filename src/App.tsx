import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CoupleProvider } from './context/CoupleContext';

// Navigation Components
import { MobileNav } from './components/layout/MobileNav';
import { DesktopSideNav } from './components/layout/DesktopSideNav';

// Pages from the barrel export
import { 
  Onboarding, 
  Home, 
  Nutrition, 
  Fitness, 
  Finance, 
  Learn, 
  Goals, 
  WeeklyReview, 
  Tablio 
} from './pages';

const LoadingFallback = () => (
  <div className="fixed inset-0 bg-navy-900 flex flex-col items-center justify-center z-[100]">
    <div className="w-12 h-12 border-4 border-gold-400/20 border-t-gold-400 rounded-full animate-spin mb-4" />
    <span className="text-gold-400 font-mono text-sm uppercase tracking-widest">Cargando OS...</span>
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
      </CoupleProvider>
    </Router>
  );
};

export default App;
