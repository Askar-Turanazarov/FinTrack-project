import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  Briefcase,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import ThreeBackground from './ThreeBackground';
import PageTransition from './PageTransition';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { to: '/incomes', label: 'Доходы', icon: TrendingUp },
    { to: '/expenses', label: 'Расходы', icon: ShoppingCart },
    { to: '/sources', label: 'Источники', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      {/* Three.js фон */}
      <ThreeBackground />

      {/* Header */}
      <header className="bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/60 sticky top-0 z-50 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <Link to="/dashboard" className="flex items-center gap-2 animate-glow rounded-xl px-2 py-1 -ml-2">
              <TrendingUp className="h-7 w-7 text-indigo-400" strokeWidth={1.5} />
              <span className="text-xl font-semibold tracking-tight">
                Fin<span className="text-indigo-400">Track</span>
              </span>
            </Link>

            {/* Десктопная навигация */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 btn-lift ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-400 shadow-sm shadow-indigo-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Меню пользователя и мобильное меню */}
            <div className="flex items-center gap-3">
              {user && (
                <span className="hidden sm:block text-sm text-slate-400 tracking-wide">
                  {user.displayName || user.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-rose-400 transition-all duration-200 rounded-xl hover:bg-slate-800/50 btn-lift"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/50 transition-all duration-200"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Мобильная навигация */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/60 animate-fade-in-up">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Основной контент с анимацией перехода */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
