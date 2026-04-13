import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Utensils, Dumbbell, Wallet, Briefcase,
         BookOpen, Target, X, MoreHorizontal, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TERRA = '#c1603a';
const MUTED_INACTIVE = '#7a4a36';

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
  { to: '/settings', icon: Settings, label: 'Config' },
];

const activeNavStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
  flex: 1,
  height: '100%',
  textDecoration: 'none',
  color: '#c1603a',
  fontFamily: '"Outfit", sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  padding: '8px 4px',
  background: 'rgba(193,96,58,0.08)',
  borderRadius: '14px',
  border: '1px solid rgba(193,96,58,0.2)',
  margin: '6px 3px',
  transition: 'all 0.2s',
};

const inactiveNavStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
  flex: 1,
  height: '100%',
  textDecoration: 'none',
  color: '#7a4a36',
  fontFamily: '"Outfit", sans-serif',
  fontSize: '11px',
  fontWeight: 500,
  padding: '8px 4px',
  background: 'transparent',
  borderRadius: '14px',
  border: '1px solid transparent',
  margin: '6px 3px',
  transition: 'all 0.2s',
};

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
              position: 'fixed', bottom: '88px', right: '16px',
              zIndex: 50, background: '#ffffff',
              border: '1px solid #e8d5c8',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(45,26,14,0.12)',
              overflow: 'hidden', minWidth: '160px',
            }}
          >
            {moreItems.map(item => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMoreOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 20px', textDecoration: 'none',
                    background: isActive ? 'rgba(193,96,58,0.06)' : 'transparent',
                    color: isActive ? TERRA : '#2d1a0e',
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '14px', fontWeight: 600,
                    borderBottom: '1px solid #f0e4da',
                  }}
                >
                  <item.icon
                    size={18}
                    color={isActive ? TERRA : MUTED_INACTIVE}
                    strokeWidth={isActive ? 2.5 : 2.0}
                  />
                  {item.label}
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <nav style={{
        display: 'flex',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderTop: '1.5px solid #e8d5c8',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 40,
        height: '72px',
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        {mainItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={isActive ? activeNavStyle : inactiveNavStyle}
            >
              <item.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2.0}
                color={isActive ? '#c1603a' : '#7a4a36'}
              />
              {item.label}
            </NavLink>
          );
        })}

        <button
          onClick={() => setIsMoreOpen(v => !v)}
          style={isMoreOpen ? activeNavStyle : inactiveNavStyle}
        >
          {isMoreOpen
            ? <X size={22} strokeWidth={2.5} color="#c1603a" />
            : <MoreHorizontal size={22} strokeWidth={2.0} color="#7a4a36" />
          }
          Más
        </button>
      </nav>
    </>
  );
};
