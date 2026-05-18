import { motion } from "motion/react";
import { CheckSquare, X, ExternalLink, Check, Circle } from "lucide-react";
import { Note } from "./types";

export function TasksModal({ 
  notes, 
  onClose,
  onNavigateToNote
}: { 
  notes: Note[], 
  onClose: () => void,
  onNavigateToNote: (id: string) => void
}) {
  const tasks = notes.flatMap(note => {
    const lines = note.content.split('\n');
    return lines
      .filter(l => l.trim().startsWith('- [ ]') || l.trim().startsWith('- [x]') || l.trim().startsWith('- [X]'))
      .map((line, index) => {
        const isDone = line.toLowerCase().includes('- [x]');
        const text = line.replace(/^- \[(x|X| )\] /, '').trim();
        return {
          id: `${note.id}-${index}`,
          noteId: note.id,
          noteTitle: note.title,
          text,
          isDone
        };
      });
  });

  const pendingTasks = tasks.filter(t => !t.isDone);
  const completedTasks = tasks.filter(t => t.isDone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-zinc-900 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] rounded-sm overflow-hidden z-10 flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-500/20 bg-zinc-800/50">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckSquare size={16} />
            Global Task Tracker
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-emerald-400 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Pending ({pendingTasks.length})</h3>
            <div className="space-y-2">
              {pendingTasks.length > 0 ? pendingTasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 bg-zinc-800/30 p-3 rounded-sm border border-zinc-700/50">
                  <Circle size={16} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-200">{task.text}</div>
                    <div className="text-[10px] text-emerald-500/70 mt-1 cursor-pointer hover:text-emerald-400 inline-flex items-center gap-1 transition-colors" onClick={() => onNavigateToNote(task.noteId)}>
                      From: {task.noteTitle || "Untitled"} <ExternalLink size={10} />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-zinc-600 italic">No pending tasks.</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Completed ({completedTasks.length})</h3>
            <div className="space-y-2 opacity-60">
              {completedTasks.length > 0 ? completedTasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 bg-zinc-800/30 p-3 rounded-sm border border-zinc-700/50">
                  <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-400 line-through">{task.text}</div>
                    <div className="text-[10px] text-zinc-500 mt-1 inline-flex items-center gap-1 cursor-pointer hover:text-zinc-400 transition-colors" onClick={() => onNavigateToNote(task.noteId)}>
                      From: {task.noteTitle || "Untitled"} <ExternalLink size={10} />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-zinc-600 italic">No completed tasks.</div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
