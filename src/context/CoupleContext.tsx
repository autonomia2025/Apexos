import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface CoupleContextType {
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  users: Record<string, any>;
  isMobile: boolean;
}

export const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export const CoupleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeUserId, setActiveUserIdState] = useState<string>('');
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const setActiveUserId = useCallback((id: string) => {
    setActiveUserIdState(id);
    localStorage.setItem('active_user_id', id);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Load profiles and current session
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data: profileRecords } = await supabase
        .from('profiles')
        .select('*');

      if (profileRecords) {
        const pMap: Record<string, any> = {};
        profileRecords.forEach(p => {
          pMap[p.role] = {
            user: {
              id: p.id,
              name: p.name,
              initials: p.initials,
              color: p.color,
              role: p.role,
            },
            metrics: {
              compliance: 0,
              streak: 0,
              calories: { consumed: 0, target: 2000 },
              macros: { protein: 0, carbs: 0, fat: 0 },
              trainingDays: 0,
              steps: 0,
              finance: { spent: 0, budget: 1000, savingsRate: 0, topCategory: { name: 'Comida', amount: 0 } },
              studyHours: 0,
              studyStreak: 0,
              learning: { activeTopics: [], inProgressCount: 0 }
            },
            recentMeals: [],
            recentWorkouts: [],
            recentExpenses: [],
            recentLearning: []
          };
        });
        setProfiles(pMap);

        // Auto-set active user if logged in
        if (session?.user) {
          setActiveUserIdState(session.user.id);
        } else {
          // Fallback to role-based id from local storage if needed, though UUID is preferred
          const savedActiveId = localStorage.getItem('active_user_id');
          if (savedActiveId) setActiveUserIdState(savedActiveId);
        }
      }
    };

    init();

    // Sync on auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setActiveUserIdState(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({
    activeUserId,
    setActiveUserId,
    users: profiles,
    isMobile,
  }), [activeUserId, profiles, isMobile, setActiveUserId]);

  return (
    <CoupleContext.Provider value={value}>
      {children}
    </CoupleContext.Provider>
  );
};
