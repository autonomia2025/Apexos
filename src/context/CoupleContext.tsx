import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface CoupleContextType {
  activeRole: 'jose' | 'anto';
  setActiveRole: (role: 'jose' | 'anto') => void;
  activeUserId: string; // The UUID (derived)
  users: Record<string, any>;
  isMobile: boolean;
  isJose: boolean;
}

export const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export const CoupleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<'jose' | 'anto'>('jose');
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const setActiveRole = useCallback((role: 'jose' | 'anto') => {
    setActiveRoleState(role);
    localStorage.setItem('active_role', role);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data: profileRecords } = await supabase
        .from('profiles')
        .select('*, monthly_budget_clp, calorie_target, protein_target_g');

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
              monthlyBudgetCLP: p.monthly_budget_clp || 500000,
              calorieTarget: p.calorie_target || 2000,
              proteinTarget: p.protein_target_g || 150,
            },
            metrics: {
              compliance: 0,
              streak: 0,
              calories: { consumed: 0, target: 2000 },
              macros: { protein: 0, carbs: 0, fat: 0 },
              trainingDays: 0,
              steps: 0,
              studyHours: 0,
              finance: { 
                spent: 0, 
                budget: 500000, 
                savingsRate: 0, 
                topCategory: { name: 'Comida', amount: 0 } 
              },
              learning: {
                activeTopics: [],
                streak: 0,
              },
            },
            recentMeals: [],
            recentWorkouts: [],
            recentExpenses: [],
            recentLearning: [],
            weeklyActivity: []
          };
        });
        setProfiles(pMap);

        // Initialization Logic:
        // 1. Check for saved role in localStorage
        // 2. Fallback to session user role if logged in
        // 3. Last fallback to 'jose'
        const savedRole = localStorage.getItem('active_role') as 'jose' | 'anto';
        if (savedRole && (savedRole === 'jose' || savedRole === 'anto')) {
          setActiveRoleState(savedRole);
        } else if (session?.user) {
          const userProfile = profileRecords.find(p => p.id === session.user.id);
          if (userProfile) {
            setActiveRoleState(userProfile.role as 'jose' | 'anto');
          }
        }
      }
    };

    init();

    // On auth state change, we might want to switch to the logged-in user's role
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setActiveRoleState(profile.role as 'jose' | 'anto');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const activeUserId = useMemo(() => {
    return profiles[activeRole]?.user?.id || '';
  }, [profiles, activeRole]);

  const value = useMemo(() => ({
    activeRole,
    setActiveRole,
    activeUserId,
    users: profiles,
    isMobile,
    isJose: activeRole === 'jose',
  }), [activeRole, activeUserId, profiles, isMobile, setActiveRole]);

  return (
    <CoupleContext.Provider value={value}>
      {children}
    </CoupleContext.Provider>
  );
};

