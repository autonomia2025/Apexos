import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { UserId, CoupleData } from '../types';
import { mockData } from '../data/mockData';

interface CoupleContextType {
  activeUserId: UserId;
  setActiveUserId: (id: UserId) => void;
  users: CoupleData;
  isMobile: boolean;
}

export const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export const CoupleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeUserId, setActiveUserIdState] = useState<UserId>(() => {
    // Try to restore from localStorage if possible (selected during onboarding)
    const saved = localStorage.getItem('active_user_id') as UserId;
    return saved || 'jose';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const setActiveUserId = useCallback((id: UserId) => {
    setActiveUserIdState(id);
    localStorage.setItem('active_user_id', id);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value = useMemo(() => ({
    activeUserId,
    setActiveUserId,
    users: mockData,
    isMobile,
  }), [activeUserId, setActiveUserId, isMobile]);

  return (
    <CoupleContext.Provider value={value}>
      {children}
    </CoupleContext.Provider>
  );
};
