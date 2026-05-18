import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, PenTool, Eraser, RotateCcw, Download } from "lucide-react";

export function SketchPadModal({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#06b6d4'); // Cyan to match theme

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup for High DPI/Retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Must call setPointerCapture so the pointer remains tracked if it leaves the element bounds briefly
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    
    // Draw a single dot if they just tap
    draw(e); 
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Use e.getCoalescedEvents for higher frequency updates if available (often for Apple Pencil)
    const events = (e.getCoalescedEvents && e.getCoalescedEvents()) || [e];
    
    for (let i = 0; i < events.length; i++) {
      const ev = events[i];
      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;

      // Extract pressure, defaulting to 0.5 if unsupported
      // The Apple Pencil typically sends pointerType === 'pen' with a valid pressure between 0.0 and 1.0
      const pressure = (ev.pointerType === 'pen' && ev.pressure) ? ev.pressure : 0.5;
      
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 30; // Eraser size
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        // Base pen width scales dynamically with pressure (Apple Pencil support)
        const baseWidth = 2;
        ctx.lineWidth = baseWidth + (pressure * 6);
        ctx.strokeStyle = color;
      }

      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'sketch.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl h-[80vh] bg-zinc-900 border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.15)] rounded-sm overflow-hidden z-10 flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-pink-500/20 bg-zinc-800/50">
          <div className="flex items-center gap-2 text-pink-400 font-bold">
            <PenTool size={16} />
            Sketchpad (Apple Pencil Supported)
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900/80 p-1 rounded-sm border border-zinc-700">
              <button 
                onClick={() => setTool('pen')}
                className={`p-1.5 rounded-sm transition-colors ${tool === 'pen' ? 'bg-pink-500/20 text-pink-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <PenTool size={14} />
              </button>
              <button 
                onClick={() => setTool('eraser')}
                className={`p-1.5 rounded-sm transition-colors ${tool === 'eraser' ? 'bg-pink-500/20 text-pink-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Eraser size={14} />
              </button>
              
              <div className="w-px h-4 bg-zinc-700 mx-1" />
              
              {/* Color Swatches */}
              <div className="flex gap-1.5 px-1">
                {['#06b6d4', '#ec4899', '#a855f7', '#10b981', '#f59e0b', '#f4f4f5'].map(c => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); setTool('pen'); }}
                    className={`w-4 h-4 rounded-full transition-transform ${color === c && tool === 'pen' ? 'scale-125 ring-1 ring-white/50' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              
              <div className="w-px h-4 bg-zinc-700 mx-1" />
              
              <button 
                onClick={clearCanvas}
                title="Clear Canvas"
                className="p-1.5 rounded-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <RotateCcw size={14} />
              </button>
              <button 
                onClick={downloadSketch}
                title="Download"
                className="p-1.5 rounded-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Download size={14} />
              </button>
            </div>

            <button onClick={onClose} className="text-zinc-500 hover:text-pink-400 transition-colors ml-2">
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-zinc-950 relative overflow-hidden cursor-crosshair">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full touch-none"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>
      </motion.div>
    </div>
  );
}
