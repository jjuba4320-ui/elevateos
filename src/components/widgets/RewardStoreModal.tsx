import { useState, FormEvent } from 'react';
import {
  Gift,
  Plus,
  Zap,
  Check,
  X,
  Film,
  Gamepad2,
  Coffee,
  Utensils,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useGamificationStore } from '../../stores/useGamificationStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { soundscapeEngine } from '../../services/audioService';

export function RewardStoreModal({ onClose }: { onClose: () => void }) {
  const { xp, rewards, redeemReward, createCustomReward } = useGamificationStore();
  const { theme } = useThemeStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState<number>(400);
  const [newCategory, setNewCategory] = useState('Entertainment');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRedeem = (id: string, title: string, cost: number) => {
    if (xp < cost) {
      alert(`Insufficient XP! You need ${cost - xp} more XP. Complete more Pomodoro blocks and habits to earn.`);
      return;
    }

    const ok = redeemReward(id);
    if (ok) {
      soundscapeEngine.playTaskCompleteSound();
      setSuccessMsg(`Redeemed "${title}"! Enjoy your guilt-free reward.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createCustomReward(newTitle.trim(), Number(newCost) || 300, newCategory);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="max-w-xl w-full rounded-2xl border p-6 space-y-5 relative max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-black"
              style={{ backgroundColor: theme.primaryAccent }}
            >
              <Gift className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white">Custom XP Reward Store</h2>
          </div>
          <p className="text-xs text-neutral-400">
            Dopamine alignment engine: Convert hard-earned XP from deep work & habits into guilt-free treats.
          </p>
        </div>

        {/* User Balance Header */}
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Zap className="w-4 h-4 text-amber-400 fill-current" />
            <span>Available XP Balance:</span>
          </div>
          <div className="text-2xl font-black font-mono" style={{ color: theme.primaryAccent }}>
            {xp} XP
          </div>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Add custom reward trigger */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Available Rewards ({rewards.length})
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs flex items-center gap-1 font-semibold text-cyan-400 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Reward</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleCreate} className="p-4 rounded-xl bg-neutral-900 border border-neutral-700 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase">Define New Reward</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Reward Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Watch 1 Football Match"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">XP Cost</label>
                <input
                  type="number"
                  min={50}
                  step={50}
                  value={newCost}
                  onChange={(e) => setNewCost(parseInt(e.target.value, 10) || 100)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                Save Reward
              </button>
            </div>
          </form>
        )}

        {/* Rewards list */}
        <div className="space-y-2.5">
          {rewards.map((r) => {
            const canAfford = xp >= r.costXp;
            return (
              <div
                key={r.id}
                className="p-3.5 rounded-xl border bg-neutral-900/50 border-neutral-800 flex items-center justify-between hover:border-neutral-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white bg-neutral-800"
                  >
                    <Gift className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{r.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span className="font-mono text-amber-400 font-bold">{r.costXp} XP</span>
                      <span>•</span>
                      <span>Redeemed {r.redeemedCount} times</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRedeem(r.id, r.title, r.costXp)}
                  disabled={!canAfford}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    canAfford
                      ? 'text-black shadow hover:opacity-90 cursor-pointer'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: canAfford ? theme.primaryAccent : undefined }}
                >
                  {canAfford ? 'Redeem' : 'Locked'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
