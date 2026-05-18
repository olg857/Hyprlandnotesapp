import { useState, useEffect, useRef } from "react";
import { Note } from "./types";

export function Editor({ note, onUpdate }: { note: Note, onUpdate: (content: string, title: string) => void }) {
  const [content, setContent] = useState(note.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(note.content);
  }, [note.id]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Auto-extract title from first line if it's a heading
    const lines = newContent.split("\n");
    let title = note.title;
    if (lines.length > 0 && lines[0].startsWith("# ")) {
      title = lines[0].replace("# ", "").trim() || "Untitled Note";
    }

    onUpdate(newContent, title);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent">
      <div className="p-2 border-b border-cyan-500/10 flex justify-between items-center text-xs text-zinc-500 bg-zinc-900/60">
        <span className="flex items-center gap-2">
          <span className="text-cyan-400">NORMAL</span>
          <span className="text-zinc-700">|</span>
          <span>{note.id}.md</span>
        </span>
        <span>
          {note.content.length} bytes
        </span>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex">
        {/* Line numbers mock */}
        <div className="w-8 text-right pr-4 text-zinc-600 text-sm select-none opacity-50 flex flex-col pt-1">
          {content.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          className="flex-1 bg-transparent resize-none outline-none text-zinc-300 text-sm leading-relaxed custom-scrollbar"
          spellCheck={false}
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
}
