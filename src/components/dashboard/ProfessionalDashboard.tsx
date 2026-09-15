import { useState, FormEvent } from 'react';
import { Briefcase, FileText, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useWellnessStore } from '../../stores/useWellnessStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { TaskKanbanAndEisenhower } from '../widgets/TaskKanbanAndEisenhower';
import { PomodoroTimer } from '../widgets/PomodoroTimer';
import { HabitHeatmap } from '../widgets/HabitHeatmap';
import { GamificationCard } from '../widgets/GamificationCard';

export function ProfessionalDashboard({ onOpenRewardStore }: { onOpenRewardStore: () => void }) {
  const { meetingNotes, addMeetingNote, deleteMeetingNote } = useWellnessStore();
  const { theme } = useThemeStore();

  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [title, setTitle] = useState('');
  const [attendees, setAttendees] = useState('');
  const [decisions, setDecisions] = useState('');

  const handleCreateMeeting = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMeetingNote(title.trim(), attendees.trim() || 'Core Team', decisions.trim() || 'Execution agreed', ['Review roadmap items']);
    setTitle('');
    setAttendees('');
    setDecisions('');
    setShowAddMeeting(false);
  };

  return (
    <div className="space-y-8">
      <GamificationCard onOpenRewardStore={onOpenRewardStore} />

      {/* Eisenhower & Kanban First Priority */}
      <TaskKanbanAndEisenhower />

      {/* Sessional Time Tracker & Pomodoro */}
      <PomodoroTimer />

      {/* Professional Meeting Notes & Action Tracker */}
      <div
        className="p-6 rounded-2xl border shadow-xl space-y-4"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-base text-white">Executive Meeting & Decision Log</h3>
            </div>
            <p className="text-xs text-neutral-400">Capture critical takeaways and action item commitments.</p>
          </div>

          <button
            onClick={() => setShowAddMeeting(!showAddMeeting)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-black"
            style={{ backgroundColor: theme.primaryAccent }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Meeting Memo</span>
          </button>
        </div>

        {showAddMeeting && (
          <form onSubmit={handleCreateMeeting} className="p-4 rounded-xl bg-neutral-900 border border-neutral-700 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Architecture Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Attendees</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Arch, DevOps, Product"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">Key Decisions & Outcome</label>
              <textarea
                rows={2}
                placeholder="What was officially approved or committed to..."
                value={decisions}
                onChange={(e) => setDecisions(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddMeeting(false)}
                className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg font-bold text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                Save Memo
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {meetingNotes.map((m) => (
            <div key={m.id} className="p-4 rounded-xl border bg-neutral-900/60 border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-white">{m.title}</h4>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {m.date} • Attendees: {m.attendees}
                  </div>
                </div>
                <button
                  onClick={() => deleteMeetingNote(m.id)}
                  className="p-1 rounded text-neutral-600 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-neutral-300 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                <strong className="text-cyan-400">Decisions: </strong>
                {m.keyDecisions}
              </div>
            </div>
          ))}
        </div>
      </div>

      <HabitHeatmap onOpenRewardStore={onOpenRewardStore} />
    </div>
  );
}
