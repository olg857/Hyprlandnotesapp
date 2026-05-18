import { motion } from "motion/react";
import { Extension } from "./types";
import { Terminal, GitBranch, CheckSquare, Eye, X, Settings2 } from "lucide-react";

const iconMap: Record<string, any> = {
  terminal: Terminal,
  git: GitBranch,
  check: CheckSquare,
  eye: Eye,
};

export function ExtensionsModal({ 
  extensions, 
  onClose,
  onToggle
}: { 
  extensions: Extension[], 
  onClose: () => void,
  onToggle: (id: string) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-zinc-900 border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] rounded-sm overflow-hidden z-10 flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/20 bg-zinc-800/50">
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Settings2 size={16} />
            Extension Manager
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-purple-400 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar">
          {extensions.map(ext => {
            const Icon = iconMap[ext.icon] || Settings2;
            return (
              <div 
                key={ext.id}
                className={`flex flex-col p-4 border rounded-sm transition-all ${ext.enabled ? 'bg-purple-500/10 border-purple-500/40 shadow-[inset_2px_0_0_rgba(168,85,247,1)]' : 'bg-zinc-800/30 border-zinc-700/50 opacity-70'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={ext.enabled ? "text-purple-400" : "text-zinc-500"} />
                    <span className={`font-bold ${ext.enabled ? "text-purple-100" : "text-zinc-400"}`}>{ext.name}</span>
                  </div>
                  <button 
                    onClick={() => onToggle(ext.id)}
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm transition-colors ${ext.enabled ? 'bg-purple-500 text-white' : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'}`}
                  >
                    {ext.enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {ext.description}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="p-3 border-t border-purple-500/20 bg-zinc-800/30 text-xs text-zinc-500 text-center">
          Extensions are loaded via WASM or WebWorkers (mocked)
        </div>
      </motion.div>
    </div>
  );
}
