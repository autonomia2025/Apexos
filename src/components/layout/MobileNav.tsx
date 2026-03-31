import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Utensils, Dumbbell, Wallet, Briefcase, 
         BookOpen, Target, X, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TERRA = '#c1603a';
const MUTED = '#b08878';
const BG = '#fdf6f0';

const mainItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrición' },
  { to: '/fitness', icon: Dumbbell, label: 'Fitness' },
  { to: '/finance', icon: Wallet, label: 'Finanzas' },
  { to: '/tablio', icon: Briefcase, label: 'Tablio' },
];

const moreItems = [
  { to: '/learn', icon: BookOpen, label: 'Aprender' },
  { to: '/goals', icon: Target, label: 'Metas' },
];

export const MobileNav = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMoreOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(45,26,14,0.3)',
              backdropFilter: 'blur(4px)',
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            style={{
              position: 'fixed', bottom: '80px', right: '16px',
              zIndex: 50, background: '#ffffff',
              border: '1px solid #e8d5c8',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(45,26,14,0.12)',
              overflow: 'hidden', minWidth: '160px',
            }}
          >
            {moreItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMoreOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 20px', textDecoration: 'none',
                  background: isActive ? 'rgba(193,96,58,0.06)' : 'transparent',
                  color: isActive ? TERRA : '#2d1a0e',
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '14px', fontWeight: 600,
                  borderBottom: '1px solid #f0e4da',
                })}
              >
                {({ isActive }) => (
                  <>
                    <item.icon 
                      size={18} 
                      color={isActive ? TERRA : MUTED}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <nav style={{
        display: 'flex', position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: BG,
        borderTop: '1px solid #e8d5c8',
        backdropFilter: 'blur(16px)',
        zIndex: 40, paddingBottom: 'env(safe-area-inset-bottom)',
        justifyContent: 'space-around', alignItems: 'center',
        height: '64px',
      }}>
        {mainItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '4px', flex: 1, height: '100%',
                textDecoration: 'none', cursor: 'pointer',
                color: isActive ? TERRA : MUTED,
                fontFamily: '"Outfit", sans-serif',
                fontSize: '10px', fontWeight: isActive ? 700 : 500,
                transition: 'all 0.2s',
              }}
            >
              <item.icon
                size={22}
                color={isActive ? TERRA : MUTED}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              {item.label}
            </NavLink>
          );
        })}

        <button
          onClick={() => setIsMoreOpen(v => !v)}
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '4px', flex: 1, height: '100%',
            background: 'transparent', border: 'none',
            cursor: 'pointer',
            color: isMoreOpen ? TERRA : MUTED,
            fontFamily: '"Outfit", sans-serif',
            fontSize: '10px', fontWeight: 500,
          }}
        >
          {isMoreOpen 
            ? <X size={22} color={TERRA} strokeWidth={2.5} />
            : <MoreHorizontal size={22} color={MUTED} strokeWidth={1.8} />
          }
          Más
        </button>
      </nav>
    </>
  );
};
