import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Search, FileText, Plus } from "lucide-react";
import { Note } from "./types";

export function CommandPalette({ 
  onClose, 
  notes, 
  onSelectNote, 
  onCreateNote 
}: { 
  onClose: () => void, 
  notes: Note[],
  onSelectNote: (id: string) => void,
  onCreateNote: () => void
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = notes.filter(n => 
    n.title.toLowerCase().includes(query.toLowerCase()) || 
    n.content.toLowerCase().includes(query.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="w-full max-w-xl bg-zinc-900 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-sm overflow-hidden z-10 flex flex-col"
      >
        <div className="flex items-center px-4 py-3 border-b border-cyan-500/20">
          <Search className="text-cyan-400 mr-3" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes or type a command..."
            className="flex-1 bg-transparent outline-none text-zinc-200 placeholder:text-zinc-600"
          />
          <div className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-sm">ESC</div>
        </div>
        
        <div className="max-h-[40vh] overflow-y-auto custom-scrollbar p-2">
          {query.toLowerCase() === "new" && (
            <div 
              onClick={onCreateNote}
              className="flex items-center px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/10 cursor-pointer rounded-sm"
            >
              <Plus size={14} className="mr-2" />
              Create new note
            </div>
          )}
          
          <div className="px-3 py-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Notes</div>
          {filtered.length > 0 ? (
            filtered.map(note => (
              <div 
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className="flex items-center px-3 py-2 text-sm text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-100 cursor-pointer rounded-sm group"
              >
                <FileText size={14} className="mr-2 text-zinc-500 group-hover:text-cyan-400" />
                <span className="flex-1 truncate">{note.title || "Untitled"}</span>
                {note.tags.length > 0 && (
                  <span className="text-[10px] text-cyan-500/50 group-hover:text-cyan-400">#{note.tags[0]}</span>
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-sm text-zinc-600">
              No results found. Type "new" to create a note.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
