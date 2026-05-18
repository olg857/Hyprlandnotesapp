import { useState, useEffect } from "react";
import { Editor } from "./Editor";
import { CommandPalette } from "./CommandPalette";
import { ExtensionsModal } from "./ExtensionsModal";
import { MusicPlayerModal } from "./MusicPlayerModal";
import { Note, Extension } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, LayoutGrid, Music } from "lucide-react";

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "Hyprland Config Notes",
    content: "# Hyprland Config\n\nRemember to set `blur = yes` in the config.\n\n```\nwindowrulev2 = opacity 0.9 0.8,class:^(kitty)$\n```\n\nNeed to update the keybinds for the new scripts.",
    tags: ["linux", "config", "hyprland"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Project Ideas",
    content: "## Rust CLI Tool\n- A tool to manage dotfiles\n- Use `clap` for arg parsing\n- Support symlinks natively\n\n## Neovim Plugin\n- Statusline written in Lua\n- Minimalist design",
    tags: ["ideas", "dev"],
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Daily Tasks",
    content: "- [x] Update system packages\n- [ ] Clean up `~/.config`\n- [ ] Push dotfiles to git",
    tags: ["todo"],
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

const INITIAL_EXTENSIONS: Extension[] = [
  { id: "ext1", name: "Vim Motions", description: "Enable vim-like keybindings in the editor", enabled: true, icon: "terminal" },
  { id: "ext2", name: "Git Sync", description: "Automatically sync notes to a git repository", enabled: false, icon: "git" },
  { id: "ext3", name: "Task Tracker", description: "Extract checkboxes from notes into a global task list", enabled: true, icon: "check" },
  { id: "ext4", name: "Live Preview", description: "Split pane markdown live preview", enabled: false, icon: "eye" },
];

export function AppLayout() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string>("1");
  const [extensions, setExtensions] = useState<Extension[]>(INITIAL_EXTENSIONS);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [extensionsOpen, setExtensionsOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const filteredNotes = activeTag 
    ? notes.filter(n => n.tags.includes(activeTag))
    : notes;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'k')) {
        e.preventDefault();
        setCmdPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCmdPaletteOpen(false);
        setExtensionsOpen(false);
        setMusicOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateNote = (id: string, content: string, title: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content, title, updatedAt: new Date().toISOString() } : n));
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      tags: activeTag ? [activeTag] : [],
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  return (
    <div 
      className="min-h-screen bg-zinc-950 text-zinc-300 font-['JetBrains_Mono'] overflow-hidden flex flex-col relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1557264322-b44d383a2906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYWJzdHJhY3QlMjBkaWdpdGFsJTIwYXJ0fGVufDF8fHx8MTc3OTE0MTg1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl z-0" />

      <div className="h-8 z-10 bg-zinc-900/60 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Terminal size={14} />
            <span>HyprNotes</span>
          </div>
          <div className="flex gap-2 text-zinc-500">
            <span className="px-2 py-0.5 bg-zinc-800/50 rounded-sm hover:bg-zinc-700/50 cursor-pointer transition-colors" onClick={() => setActiveTag(null)}>
              [All]
            </span>
            {Array.from(new Set(notes.flatMap(n => n.tags))).map(tag => (
              <span 
                key={tag} 
                className={`px-2 py-0.5 rounded-sm cursor-pointer transition-colors ${activeTag === tag ? 'bg-cyan-500/20 text-cyan-300' : 'bg-zinc-800/50 hover:bg-zinc-700/50'}`}
                onClick={() => setActiveTag(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors" onClick={() => setMusicOpen(true)}>
            <Music size={14} />
            <span>Music</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => setExtensionsOpen(true)}>
            <LayoutGrid size={14} />
            <span>Extensions</span>
          </div>
          <div className="text-zinc-500">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex p-4 gap-4 z-10 h-[calc(100vh-2rem)]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 flex flex-col bg-zinc-900/40 backdrop-blur-md border border-cyan-500/20 rounded-sm overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.1)]"
        >
          <div className="p-3 border-b border-cyan-500/20 flex justify-between items-center bg-zinc-900/60">
            <span className="text-sm font-bold text-cyan-400">~/notes</span>
            <button 
              onClick={handleCreateNote}
              className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-sm transition-colors"
            >
              + New
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {filteredNotes.map(note => (
              <div 
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3 rounded-sm cursor-pointer border transition-all ${activeNoteId === note.id ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[inset_2px_0_0_rgba(6,182,212,1)]' : 'bg-zinc-800/20 border-transparent hover:bg-zinc-800/50 hover:border-zinc-700'}`}
              >
                <div className="font-medium text-sm truncate">{note.title || "Untitled"}</div>
                <div className="text-xs text-zinc-500 mt-1 truncate">{note.content || "Empty note..."}</div>
                <div className="flex gap-1 mt-2">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1 bg-zinc-800 text-zinc-400 rounded-sm">#{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col bg-zinc-900/40 backdrop-blur-md border border-cyan-500/20 rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.1)] overflow-hidden"
        >
          {activeNote ? (
            <Editor 
              note={activeNote} 
              onUpdate={(content, title) => handleUpdateNote(activeNote.id, content, title)} 
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-600">
              Select a note or create a new one
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {cmdPaletteOpen && (
          <CommandPalette 
            onClose={() => setCmdPaletteOpen(false)} 
            notes={notes}
            onSelectNote={(id) => {
              setActiveNoteId(id);
              setCmdPaletteOpen(false);
            }}
            onCreateNote={() => {
              handleCreateNote();
              setCmdPaletteOpen(false);
            }}
          />
        )}
        {extensionsOpen && (
          <ExtensionsModal 
            extensions={extensions}
            onClose={() => setExtensionsOpen(false)}
            onToggle={(id) => setExtensions(extensions.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e))}
          />
        )}
        {musicOpen && (
          <MusicPlayerModal onClose={() => setMusicOpen(false)} />
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.4);
        }
      `}</style>
    </div>
  );
}
