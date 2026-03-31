import { NavLink, useLocation } from 'react-router-dom';
import { Home, Apple, Dumbbell, Wallet, BookOpen, Briefcase, Target } from 'lucide-react';

/**
 * PURE CSS MOBILE NAVIGATION
 * Zero-dependency implementation with semantic segments and active route detection.
 */
export const MobileNav = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'Apex' },
    { path: '/nutrition', icon: Apple, label: 'Comer' },
    { path: '/fitness', icon: Dumbbell, label: 'Entrenar' },
    { path: '/finance', icon: Wallet, label: 'Dinero' },
    { path: '/learn', icon: BookOpen, label: 'Crecer' },
    { path: '/tablio', icon: Briefcase, label: 'Tablio' },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={22} color={isActive ? '#c1603a' : 'rgba(255,255,255,0.35)'} />
            <span>{item.label}</span>
            {isActive && <span className="nav-dot" />}
          </NavLink>
        );
      })}
    </nav>
  );
};

/**
 * PURE CSS DESKTOP SIDEBAR
 * Space-efficient icon sidebar with tooltips.
 */
export const DesktopSideNav = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'Apex Home' },
    { path: '/nutrition', icon: Apple, label: 'Nutrition' },
    { path: '/fitness', icon: Dumbbell, label: 'Fitness' },
    { path: '/finance', icon: Wallet, label: 'Finance' },
    { path: '/learn', icon: BookOpen, label: 'Learning' },
    { path: '/goals', icon: Target, label: 'Metas' },
    { path: '/tablio', icon: Briefcase, label: 'Tablio Business' },
  ];

  return (
    <nav className="desktop-nav">
      <div style={{ marginBottom: '32px' }}>
         <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
           <path d="M16 4L28 24H4L16 4Z" fill="#c1603a" fillOpacity="0.2" stroke="#c1603a" strokeWidth="2" strokeLinejoin="round"/>
           <path d="M16 12L22 22H10L16 12Z" fill="#c1603a" fillOpacity="0.4"/>
          </svg>
      </div>

      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <item.icon size={24} color={isActive ? '#c1603a' : 'rgba(255,255,255,0.35)'} />
            <span className="desktop-nav-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
