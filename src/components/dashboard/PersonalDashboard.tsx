import { useState, FormEvent } from 'react';
import { DollarSign, Plus, Trash2, Sparkles, NotebookPen } from 'lucide-react';
import { useWellnessStore } from '../../stores/useWellnessStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { HabitHeatmap } from '../widgets/HabitHeatmap';
import { BreathingWidget } from '../widgets/BreathingWidget';
import { TaskKanbanAndEisenhower } from '../widgets/TaskKanbanAndEisenhower';
import { PomodoroTimer } from '../widgets/PomodoroTimer';
import { GamificationCard } from '../widgets/GamificationCard';

export function PersonalDashboard({ onOpenRewardStore }: { onOpenRewardStore: () => void }) {
  const { budgetItems, addBudgetItem, deleteBudgetItem } = useWellnessStore();
  const { theme } = useThemeStore();

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState<number>(15);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Food & Groceries');

  const handleAddBudget = (e: FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;
    addBudgetItem(desc.trim(), Number(amount), type, category);
    setDesc('');
  };

  const totalIncome = budgetItems
    .filter((b) => b.type === 'income')
    .reduce((acc, b) => acc + b.amount, 0);

  const totalExpense = budgetItems
    .filter((b) => b.type === 'expense')
    .reduce((acc, b) => acc + b.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8">
      <GamificationCard onOpenRewardStore={onOpenRewardStore} />

      {/* Habits & Streaks */}
      <HabitHeatmap onOpenRewardStore={onOpenRewardStore} />

      {/* Micro-Budgeting & Personal Cashflow Tracker */}
      <div
        className="p-6 rounded-2xl border shadow-xl space-y-4"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-base text-white">Micro-Budgeting & Cash Flow</h3>
            </div>
            <p className="text-xs text-neutral-400">Zero-friction daily expense tracker to maintain financial discipline.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Net Balance</span>
              <span className={`text-lg font-black font-mono ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {balance >= 0 ? '+' : ''}{balance.toFixed(2)} DZD
              </span>
            </div>
          </div>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAddBudget} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              placeholder="Description (e.g. Exam Books, Bus Pass, Coffee)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="number"
              step="any"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
            />
          </div>
          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
            >
              <option value="expense">Expense (-)</option>
              <option value="income">Income (+)</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl font-bold text-black"
            style={{ backgroundColor: theme.primaryAccent }}
          >
            Log Entry
          </button>
        </form>

        {/* Entries list */}
        <div className="space-y-2 pt-2">
          {budgetItems.slice(0, 6).map((b) => (
            <div
              key={b.id}
              className="p-3 rounded-xl border bg-neutral-900/40 border-neutral-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    b.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <div>
                  <span className="font-semibold text-white">{b.title}</span>
                  <span className="text-neutral-500 ml-2 font-mono text-[10px]">{b.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold ${b.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {b.type === 'income' ? '+' : '-'}{b.amount} DZD
                </span>
                <button
                  onClick={() => deleteBudgetItem(b.id)}
                  className="p-1 rounded text-neutral-600 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness & Gratitude */}
      <BreathingWidget />

      {/* Tasks & Pomodoro */}
      <TaskKanbanAndEisenhower />
      <PomodoroTimer />
    </div>
  );
}
