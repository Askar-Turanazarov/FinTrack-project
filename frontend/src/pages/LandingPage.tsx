import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ArrowRight,
  Shield,
  BarChart3,
  Wallet,
  Repeat,
  Smartphone,
} from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

/**
 * Лендинг-страница FinTrack.
 * Отображается первой при входе на сайт (маршрут "/").
 * Содержит: hero-блок, описание проекта, статистику, кнопки авторизации.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Three.js фон */}
      <ThreeBackground />

      {/* Верхняя панель с кнопками входа */}
      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          {/* Логотип */}
          <Link to="/" className="flex items-center gap-2 animate-glow rounded-xl px-2 py-1 -ml-2">
            <TrendingUp className="h-7 w-7 text-indigo-400" strokeWidth={1.5} />
            <span className="text-xl font-semibold tracking-tight">
              Fin<span className="text-indigo-400">Track</span>
            </span>
          </Link>

          {/* Кнопки авторизации */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-xl transition-all duration-200 hover:bg-slate-800/50 btn-lift"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 btn-lift"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </header>

      {/* Hero-блок */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Заголовок */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight animate-fade-in-up">
            Управляйте{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">
              личными финансами
            </span>
            <br />
            с умом
          </h1>

          {/* Слоган */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto animate-fade-in-up delay-100 animate-delay-base">
            FinTrack — минималистичный трекер доходов, расходов и постоянных платежей.
            Наглядные графики, помесячная аналитика и премиальный тёмный интерфейс.
          </p>

          {/* Кнопки CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200 animate-delay-base">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl shadow-indigo-600/25 btn-lift text-base"
            >
              Начать бесплатно
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-200 border border-slate-700/50 btn-lift text-base"
            >
              У меня есть аккаунт
            </Link>
          </div>
        </div>

        {/* Карточки возможностей */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-indigo-400" />}
            title="Аналитика и графики"
            description="Круговые и столбчатые диаграммы по категориям и источникам дохода"
            delay="delay-200"
          />
          <FeatureCard
            icon={<Wallet className="h-6 w-6 text-emerald-400" />}
            title="Доходы и расходы"
            description="Удобное добавление, редактирование и фильтрация транзакций"
            delay="delay-300"
          />
          <FeatureCard
            icon={<Repeat className="h-6 w-6 text-violet-400" />}
            title="Постоянные платежи"
            description="Отслеживание повторяющихся расходов и доходов"
            delay="delay-400"
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-rose-400" />}
            title="Безопасность"
            description="JWT-аутентификация, шифрование паролей, защита API"
            delay="delay-500"
          />
          <FeatureCard
            icon={<Smartphone className="h-6 w-6 text-amber-400" />}
            title="Адаптивный дизайн"
            description="Идеальное отображение на мобильных, планшетах и десктопе"
            delay="delay-500"
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6 text-cyan-400" />}
            title="Помесячная сводка"
            description="Обзор финансов за каждый месяц с детализацией по категориям"
            delay="delay-500"
          />
        </div>

        {/* Статистика */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up delay-400 animate-delay-base">
          <StatItem number="5+" label="Категорий расходов" />
          <StatItem number="3" label="Типа дохода" />
          <StatItem number="24/7" label="Доступ из любого устройства" />
          <StatItem number="0₽" label="Полностью бесплатно" />
        </div>

        {/* Футер */}
        <footer className="mt-24 text-center text-sm text-slate-600 animate-fade-in-up delay-500 animate-delay-base">
          <p>FinTrack — персональный трекер финансов</p>
        </footer>
      </section>
    </div>
  );
}

/* --- Вспомогательные компоненты --- */

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className={`bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 card-hover animate-fade-in-up ${delay} animate-delay-base`}
    >
      <div className="p-2 bg-slate-800/50 rounded-xl w-fit mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
        {number}
      </p>
      <p className="mt-1 text-xs sm:text-sm text-slate-500">{label}</p>
    </div>
  );
}
