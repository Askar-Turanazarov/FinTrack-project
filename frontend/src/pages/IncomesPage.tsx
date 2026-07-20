import { useState, useEffect } from 'react';
import {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeSources,
} from '../api/endpoints';
import type { Income, IncomeSource, PaginatedResponse } from '../types';
import IncomeForm from '../components/IncomeForm';
import { Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';

function formatMoney(minor: number): string {
  return (minor / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2 });
}

export default function IncomesPage() {
  const [data, setData] = useState<PaginatedResponse<Income> | null>(null);
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filterSourceId, setFilterSourceId] = useState<number | null>(null);
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadIncomes = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 10 };
      if (from) params.from = from;
      if (to) params.to = to;
      if (filterSourceId) params.sourceId = filterSourceId;
      const res = await getIncomes(params);
      setData(res);
    } catch (err: any) {
      setError(err?.error?.message || 'Ошибка загрузки доходов');
    } finally {
      setLoading(false);
    }
  };

  const loadSources = async () => {
    try {
      const res = await getIncomeSources();
      setSources(res);
    } catch {}
  };

  useEffect(() => {
    loadSources();
  }, []);

  useEffect(() => {
    loadIncomes();
  }, [page, from, to, filterSourceId]);

  const handleCreate = async (formData: any) => {
    await createIncome(formData);
    setShowForm(false);
    loadIncomes();
  };

  const handleUpdate = async (formData: any) => {
    if (!editingIncome) return;
    await updateIncome(editingIncome.id, formData);
    setEditingIncome(null);
    setShowForm(false);
    loadIncomes();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить доход?')) return;
    await deleteIncome(id);
    loadIncomes();
  };

  const openEdit = (income: Income) => {
    setEditingIncome(income);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingIncome(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Доходы</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Добавить доход
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-slate-400 mb-1">С</label>
          <input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">По</label>
          <input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Источник</label>
          <select value={filterSourceId ?? ''} onChange={e => { setFilterSourceId(e.target.value ? Number(e.target.value) : null); setPage(1); }}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">Все</option>
            {sources.filter(s => s.isActive).map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl">{error}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">{editingIncome ? 'Редактировать доход' : 'Новый доход'}</h3>
          <IncomeForm
            sources={sources}
            initialData={editingIncome ? { ...editingIncome, amountMinor: editingIncome.amountMinor } : undefined}
            onSubmit={editingIncome ? handleUpdate : handleCreate}
            onCancel={closeForm}
          />
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400"></div>
        </div>
      ) : data && data.items.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 font-medium">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Источник</th>
                <th className="px-4 py-3">Сумма</th>
                <th className="px-4 py-3">Заметка</th>
                <th className="px-4 py-3">Повтор</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {data.items.map(income => {
                const source = sources.find(s => s.id === income.sourceId);
                return (
                  <tr key={income.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-300">{income.receivedAt}</td>
                    <td className="px-4 py-3 text-slate-300">{source?.name || '—'}</td>
                    <td className="px-4 py-3 font-mono tabular-nums text-emerald-400">{formatMoney(income.amountMinor)} сум</td>
                    <td className="px-4 py-3 text-slate-400">{income.note || ''}</td>
                    <td className="px-4 py-3 text-slate-400">{income.isRecurring ? income.recurrence === 'monthly' ? 'Ежемес.' : 'Ежегод.' : 'Нет'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(income)} className="p-1 text-slate-400 hover:text-indigo-400 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(income.id)} className="p-1 text-slate-400 hover:text-rose-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">Доходов пока нет</div>
      )}

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 bg-slate-800 rounded-lg disabled:opacity-30 hover:bg-slate-700 transition-colors"
          >
            Назад
          </button>
          <span className="text-slate-400">Стр. {data.page} из {Math.ceil(data.total / data.limit)}</span>
          <button
            disabled={data.items.length < data.limit}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 bg-slate-800 rounded-lg disabled:opacity-30 hover:bg-slate-700 transition-colors"
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}