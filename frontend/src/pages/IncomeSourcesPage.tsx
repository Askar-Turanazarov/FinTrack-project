import { useState, useEffect, type FormEvent } from 'react';
import {
  getIncomeSources,
  createIncomeSource,
  updateIncomeSource,
  deleteIncomeSource,
} from '../api/endpoints';
import type { IncomeSource } from '../types';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function IncomeSourcesPage() {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('salary');

  const loadSources = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getIncomeSources();
      setSources(data);
    } catch (err: any) {
      setError(err?.error?.message || 'Ошибка загрузки источников');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editingId) {
        await updateIncomeSource(editingId, { name, type });
      } else {
        await createIncomeSource({ name, type });
      }
      setShowForm(false);
      setEditingId(null);
      setName('');
      setType('salary');
      loadSources();
    } catch (err: any) {
      alert(err?.error?.message || 'Ошибка сохранения');
    }
  };

  const handleEdit = (source: IncomeSource) => {
    setEditingId(source.id);
    setName(source.name);
    setType(source.type);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить источник?')) return;
    try {
      await deleteIncomeSource(id);
      loadSources();
    } catch (err: any) {
      alert(err?.error?.message || 'Ошибка удаления');
    }
  };

  const handleToggleActive = async (source: IncomeSource) => {
    try {
      await updateIncomeSource(source.id, { isActive: !source.isActive });
      loadSources();
    } catch (err: any) {
      alert(err?.error?.message || 'Ошибка обновления');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setType('salary');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Источники дохода</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Добавить источник
        </button>
      </div>

      {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl">{error}</div>}

      {showForm && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 max-w-lg">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Редактировать источник' : 'Новый источник'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Название</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Тип</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="salary">Зарплата</option>
                <option value="freelance">Фриланс</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
                Сохранить
              </button>
              <button type="button" onClick={closeForm} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors">
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400"></div>
        </div>
      ) : sources.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 font-medium">
              <tr>
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3">Тип</th>
                <th className="px-4 py-3">Активен</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sources.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-slate-200">{s.name}</td>
                  <td className="px-4 py-3 text-slate-400 capitalize">
                    {s.type === 'salary' ? 'Зарплата' : s.type === 'freelance' ? 'Фриланс' : 'Другое'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleActive(s)} className="text-slate-400 hover:text-slate-200 transition-colors">
                      {s.isActive ? <ToggleRight className="h-5 w-5 text-emerald-400" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(s)} className="p-1 text-slate-400 hover:text-indigo-400 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1 text-slate-400 hover:text-rose-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">Источников пока нет</div>
      )}
    </div>
  );
}