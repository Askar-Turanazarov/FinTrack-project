import { useState, useEffect } from 'react';
import {
  getMonthlySummary,
  getSummaryByCategory,
  getSummaryBySource,
  getRecurring,
} from '../api/endpoints';
import type {
  MonthlySummary,
  CategorySummaryItem,
  SourceSummaryItem,
  RecurringSummary,
} from '../types';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { Calendar, ArrowUpRight, ArrowDownRight, Wallet, Repeat } from 'lucide-react';

const COLORS = ['#818cf8', '#34d399', '#f472b6', '#a78bfa', '#f87171'];

function formatMoney(minor: number): string {
  return (minor / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2 });
}

export default function DashboardPage() {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [month, setMonth] = useState(defaultMonth);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [byCategory, setByCategory] = useState<CategorySummaryItem[]>([]);
  const [bySource, setBySource] = useState<SourceSummaryItem[]>([]);
  const [recurring, setRecurring] = useState<RecurringSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sum, cat, src, rec] = await Promise.all([
        getMonthlySummary(month),
        getSummaryByCategory(month),
        getSummaryBySource(month),
        getRecurring(),
      ]);
      setSummary(sum);
      setByCategory(cat.items);
      setBySource(src.items);
      setRecurring(rec);
    } catch (err: any) {
      setError(err?.error?.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Обзор финансов</h1>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" strokeWidth={1.5} />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/80 hover:translate-y-[-1px] transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <ArrowUpRight className="h-5 w-5 text-emerald-400" strokeWidth={1.75} />
              </div>
              <span className="text-sm text-slate-400 tracking-wide">Доход</span>
            </div>
            <p className="text-2xl font-semibold text-emerald-400 font-mono tabular-nums tracking-tight">
              {formatMoney(summary.totalIncomeMinor)} сум
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/80 hover:translate-y-[-1px] transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-500/10 rounded-xl">
                <ArrowDownRight className="h-5 w-5 text-rose-400" strokeWidth={1.75} />
              </div>
              <span className="text-sm text-slate-400 tracking-wide">Расход</span>
            </div>
            <p className="text-2xl font-semibold text-rose-400 font-mono tabular-nums tracking-tight">
              {formatMoney(summary.totalExpenseMinor)} сум
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/80 hover:translate-y-[-1px] transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <Wallet className="h-5 w-5 text-indigo-400" strokeWidth={1.75} />
              </div>
              <span className="text-sm text-slate-400 tracking-wide">Баланс</span>
            </div>
            <p className={`text-2xl font-semibold font-mono tabular-nums tracking-tight ${summary.balanceMinor >= 0 ? 'text-indigo-300' : 'text-rose-400'}`}>
              {formatMoney(summary.balanceMinor)} сум
            </p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Расходы по категориям</h3>
          {byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="totalMinor"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {byCategory.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                  }}
                  formatter={(value: number) => formatMoney(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-10">Нет данных за этот месяц</p>
          )}
        </div>

        {/* Income by Source */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Доходы по источникам</h3>
          {bySource.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bySource}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} axisLine={false} />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  tick={{ fill: '#94a3b8' }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                  }}
                  formatter={(value: number) => formatMoney(value)}
                />
                <Bar dataKey="totalMinor" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-10">Нет данных за этот месяц</p>
          )}
        </div>
      </div>

      {/* Recurring Expenses */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-500/10 rounded-xl">
            <Repeat className="h-5 w-5 text-violet-400" strokeWidth={1.75} />
          </div>
          <h3 className="text-lg font-semibold">Постоянные расходы</h3>
        </div>
        {recurring && recurring.items.length > 0 ? (
          <>
            <p className="text-sm text-slate-400 mb-4">
              Общая сумма в месяц:{' '}
              <span className="text-white font-medium">{formatMoney(recurring.monthlyExpenseMinor)} сум</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recurring.items.map((item, idx) => (
                <div key={idx} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/80 transition-colors">
                  <p className="font-medium text-slate-200">{item.name}</p>
                  <p className="text-lg font-semibold text-violet-400 mt-1 font-mono tabular-nums">{formatMoney(item.amountMinor)} сум</p>
                  <p className="text-xs text-slate-500 mt-1 capitalize">{item.recurrence === 'monthly' ? 'Ежемесячно' : 'Ежегодно'}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-slate-500">Нет постоянных расходов</p>
        )}
      </div>
    </div>
  );
}