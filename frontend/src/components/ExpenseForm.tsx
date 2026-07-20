import { useState, type FormEvent } from 'react';
import type { Category } from '../types';

interface ExpenseFormData {
  categoryId: number;
  amountMinor: number;
  currency: string;
  spentAt: string;
  description: string | null;
  isRecurring: boolean;
  recurrence: string | null;
}

interface Props {
  initialData?: Partial<ExpenseFormData>;
  categories: Category[];
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ExpenseForm({ initialData, categories, onSubmit, onCancel }: Props) {
  const [categoryId, setCategoryId] = useState<number>(initialData?.categoryId ?? 0);
  const [amountSum, setAmountSum] = useState(
    initialData?.amountMinor ? String(initialData.amountMinor / 100) : ''
  );
  const [spentAt, setSpentAt] = useState(initialData?.spentAt ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [isRecurring, setIsRecurring] = useState(initialData?.isRecurring ?? false);
  const [recurrence, setRecurrence] = useState<string>(initialData?.recurrence ?? 'monthly');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const amountMinor = Math.round(parseFloat(amountSum) * 100);
    if (isNaN(amountMinor) || amountMinor <= 0) {
      setError('Введите корректную сумму');
      return;
    }
    if (!spentAt) {
      setError('Укажите дату');
      return;
    }
    if (!categoryId) {
      setError('Выберите категорию');
      return;
    }

    await onSubmit({
      categoryId,
      amountMinor,
      currency: 'UZS',
      spentAt,
      description: description || null,
      isRecurring,
      recurrence: isRecurring ? recurrence : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Категория</label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(Number(e.target.value))}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value={0}>Выберите...</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Сумма (сум)</label>
        <input
          type="number" step="0.01"
          value={amountSum}
          onChange={e => setAmountSum(e.target.value)}
          required
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Дата расхода</label>
        <input
          type="date"
          value={spentAt}
          onChange={e => setSpentAt(e.target.value)}
          required
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Описание</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={500}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={e => setIsRecurring(e.target.checked)}
          className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500/50"
        />
        <label className="text-sm text-slate-300">Повторяющийся</label>
      </div>
      {isRecurring && (
        <div>
          <label className="block text-sm text-slate-400 mb-1">Периодичность</label>
          <select
            value={recurrence}
            onChange={e => setRecurrence(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="monthly">Ежемесячно</option>
            <option value="yearly">Ежегодно</option>
          </select>
        </div>
      )}
      {error && <p className="text-rose-400 text-sm">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
          Сохранить
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors">
          Отмена
        </button>
      </div>
    </form>
  );
}