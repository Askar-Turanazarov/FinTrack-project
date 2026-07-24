import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, TrendingUp } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, displayName);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.error?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative">
      <ThreeBackground />

      <div className="w-full max-w-md relative z-10 animate-fade-in-scale">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 animate-glow">
            <TrendingUp className="h-8 w-8 text-indigo-400" strokeWidth={1.5} />
            <span className="text-2xl font-semibold tracking-tight">
              Fin<span className="text-indigo-400">Track</span>
            </span>
          </div>
          <p className="text-slate-400">Создайте новый аккаунт</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6 card-hover animate-fade-in-up delay-200 animate-delay-base">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Имя</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 input-glow"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 input-glow"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Пароль (минимум 8 символов)</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 input-glow"
              />
            </div>
            {error && (
              <p className="text-rose-400 text-sm animate-fade-in-up">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 btn-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-400">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors link-underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
