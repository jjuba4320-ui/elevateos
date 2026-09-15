import { useRef } from 'react';
import {
  Share2,
  Download,
  X,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useGamificationStore } from '../../stores/useGamificationStore';
import { useFocusStore } from '../../stores/useFocusStore';
import { useThemeStore } from '../../stores/useThemeStore';

export function ShareStoryModal({ onClose }: { onClose: () => void }) {
  const { profile } = useUserStore();
  const { level, xp, title } = useGamificationStore();
  const { todayFocusMinutes } = useFocusStore();
  const { theme } = useThemeStore();

  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    alert('Story card visual ready! You can screenshot or copy this graphic directly to Instagram Stories / WhatsApp Status.');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="max-w-md w-full rounded-2xl border p-6 space-y-5 relative max-h-[95vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Instagram Story Progress Card</span>
          </h3>
          <p className="text-xs text-neutral-400">
            Share your daily momentum, focus hours, and BAC preparation streak with peers.
          </p>
        </div>

        {/* 9:16 Ratio Story Card Mockup */}
        <div className="flex justify-center py-2">
          <div
            ref={cardRef}
            className="w-[280px] h-[480px] rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all"
            style={{
              backgroundColor: '#090d16',
              borderColor: theme.primaryAccent,
            }}
          >
            {/* Background Glow */}
            <div
              className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-2xl opacity-25"
              style={{ backgroundColor: theme.primaryAccent }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full blur-2xl opacity-20"
              style={{ backgroundColor: theme.secondaryAccent }}
            />

            {/* Top Branding */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-black font-bold text-xs"
                  style={{ backgroundColor: theme.primaryAccent }}
                >
                  ⚡
                </div>
                <span className="font-bold text-xs tracking-tight text-white">ElevateOS</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Middle Stats Showcase */}
            <div className="relative z-10 space-y-4 text-center my-auto">
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl text-black shadow-lg"
                style={{ backgroundColor: theme.primaryAccent }}>
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'EO'}
              </div>

              <div>
                <h4 className="text-base font-extrabold text-white">{profile.name}</h4>
                <div className="text-xs font-mono font-semibold" style={{ color: theme.primaryAccent }}>
                  Level {level} • {title}
                </div>
              </div>

              {/* Stat Pillars */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-[10px] text-neutral-400">Deep Work</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {Math.round(todayFocusMinutes / 60)}h {todayFocusMinutes % 60}m
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-[10px] text-neutral-400">Total XP</div>
                  <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">
                    {xp} XP
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-left">
                <div className="text-[10px] text-neutral-400 font-semibold uppercase">Primary Mission</div>
                <div className="text-xs text-neutral-200 line-clamp-2 mt-0.5 font-medium">
                  {profile.mainGoal}
                </div>
              </div>
            </div>

            {/* Bottom Footer Tag */}
            <div className="relative z-10 text-center border-t border-neutral-800/80 pt-3">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                Built with ElevateOS • Peak Performance
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-black"
            style={{ backgroundColor: theme.primaryAccent }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Story Card</span>
          </button>
        </div>
      </div>
    </div>
  );
}
