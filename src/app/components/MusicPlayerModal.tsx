import { useState } from "react";
import { motion } from "motion/react";
import { X, Music, Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";

export function MusicPlayerModal({ 
  onClose 
}: { 
  onClose: () => void 
}) {
  const [provider, setProvider] = useState<null | 'spotify' | 'apple'>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-zinc-900 border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] rounded-sm overflow-hidden z-10 flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/20 bg-zinc-800/50">
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Music size={16} />
            Media Player
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-purple-400 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          {!provider ? (
            <div className="flex flex-col gap-4">
              <div className="text-sm text-zinc-400 text-center mb-2">Connect a music provider to control playback</div>
              <button 
                onClick={() => setProvider('spotify')}
                className="flex items-center justify-center gap-3 w-full py-3 bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/30 hover:bg-[#1DB954]/20 transition-colors rounded-sm font-medium"
              >
                Connect Spotify
              </button>
              <button 
                onClick={() => setProvider('apple')}
                className="flex items-center justify-center gap-3 w-full py-3 bg-[#FA243C]/10 text-[#FA243C] border border-[#FA243C]/30 hover:bg-[#FA243C]/20 transition-colors rounded-sm font-medium"
              >
                Connect Apple Music
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  {provider === 'spotify' ? 'Spotify' : 'Apple Music'} Connected
                </span>
                <button 
                  onClick={() => setProvider(null)}
                  className="text-[10px] text-zinc-500 hover:text-purple-400 underline decoration-purple-500/30"
                >
                  Disconnect
                </button>
              </div>

              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-sm overflow-hidden bg-zinc-800 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop" alt="Album Cover" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <div className="text-zinc-100 font-medium truncate text-lg">Midnight Vibe</div>
                  <div className="text-zinc-400 text-sm truncate">Lofi Dreamer</div>
                  <div className="text-purple-400/80 text-xs mt-1">Chillhop Essentials</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-1/3" />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>1:24</span>
                  <span>3:45</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  <Volume2 size={18} />
                </button>
                <div className="flex items-center gap-6">
                  <button className="text-zinc-400 hover:text-purple-400 transition-colors">
                    <SkipBack size={20} />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 flex items-center justify-center bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full hover:bg-purple-500/20 hover:scale-105 transition-all"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  <button className="text-zinc-400 hover:text-purple-400 transition-colors">
                    <SkipForward size={20} />
                  </button>
                </div>
                <div className="w-4" /> {/* Spacer for balance */}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
