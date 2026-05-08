import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LogOut, CheckSquare, Moon, Sun, Archive, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border h-full flex flex-col transition-all duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-dark-border/50">
        <div className="bg-brand-600 text-white p-2 rounded-lg">
          <CheckSquare size={24} />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">TaskFlow</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive 
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400' 
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-dark-border/30 dark:hover:text-slate-200'
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink 
          to="/history" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive 
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400' 
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-dark-border/30 dark:hover:text-slate-200'
            }`
          }
        >
          <Archive size={20} />
          History
        </NavLink>
        <NavLink 
          to="/suggestions" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive 
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' 
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-dark-border/30 dark:hover:text-slate-200'
            }`
          }
        >
          <Sparkles size={20} />
          Suggestions
        </NavLink>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-dark-border space-y-2">
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-dark-border/30 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
