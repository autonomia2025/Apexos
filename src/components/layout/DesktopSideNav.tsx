import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, Dumbbell, Wallet, BookOpen, Target, Briefcase } from 'lucide-react';

export const DesktopSideNav = () => {
  const personalNavItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
    { to: '/fitness', icon: Dumbbell, label: 'Fitness' },
    { to: '/finance', icon: Wallet, label: 'Finance' },
    { to: '/learn', icon: BookOpen, label: 'Learn' },
    { to: '/goals', icon: Target, label: 'Metas' },
  ];

  const businessNavItems = [
    { to: '/tablio', icon: Briefcase, label: 'Tablio' },
  ];

  const NavItem = ({ item }: { item: any }) => (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `group relative flex items-center xl:px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive
            ? 'bg-gold-400/10 text-gold-400 shadow-[inset_2px_0_0_var(--color-gold-400)]'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex justify-center xl:justify-start w-full gap-4 items-center">
            <item.icon
              className={`w-5 h-5 xl:w-6 xl:h-6 transition-transform group-hover:scale-110 ${
                isActive ? 'drop-shadow-[0_0_8px_rgba(240,192,64,0.5)]' : ''
              }`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="hidden xl:block font-bold tracking-wide text-sm">{item.label}</span>
          </div>
          
          <div className="absolute left-16 px-3 py-1.5 bg-navy-800 text-white text-xs font-bold rounded-md opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all z-50 xl:hidden whitespace-nowrap shadow-xl border border-white/10">
            {item.label}
          </div>
        </>
      )}
    </NavLink>
  );

  return (
    <nav className="fixed left-0 top-0 h-full w-20 xl:w-64 bg-navy-900 border-r border-gold-400/20 z-40 hidden md:block glass-panel">
      <div className="flex flex-col h-full py-8">
        <div className="px-6 mb-12 hidden xl:block">
          <h1 className="text-2xl font-display font-bold text-gold-400 tracking-wider">APEX</h1>
        </div>
        <div className="flex justify-center xl:hidden mb-12">
          <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center border border-gold-400/50">
            <span className="text-gold-400 font-display font-bold text-xl">A</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-3 xl:px-4 flex-1">
          {personalNavItems.map((item) => <NavItem key={item.to} item={item} />)}
          
          <div className="my-2 border-t border-white/10 w-8 xl:w-full mx-auto" />
          
          {businessNavItems.map((item) => <NavItem key={item.to} item={item} />)}
        </div>
      </div>
    </nav>
  );
};
