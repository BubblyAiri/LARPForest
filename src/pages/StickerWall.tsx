import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, type Sticker } from '../lib/supabase';
import BackButton from '../components/BackButton';

type Page = 'home' | 'about' | 'sticker-wall' | 'playlist' | 'anon-inbox';
interface Props { navigate: (page: Page) => void; }

const PALETTE = [
  '#ff0040','#ff1493','#ff69b4','#ffffff','#000000',
  '#ff6600','#ffcc00','#00ff88','#00ccff','#9966ff',
  '#663300','#1a1a2e','#8b0000','#006600','#003366',
];

export default function StickerWall({ navigate }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const lastPos    = useRef<{ x: number; y: number } | null>(null);
  const [stickers, setStickers]   = useState<Sticker[]>([]);
  const [color, setColor]         = useState('#ff0040');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser]   = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { loadStickers(); }, []);

  async function loadStickers() {
    setLoading(true);
    const { data } = await supabase
      .from('stickers').select('*')
      .order('created_at', { ascending: false }).limit(60);
    if (data) setStickers(data as Sticker[]);
    setLoading(false);
  }

  useEffect(() => {
    if (!showCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [showCanvas]);

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const t = (e as React.TouchEvent).touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    const me = e as React.MouseEvent;
    return { x: (me.clientX - rect.left) * scaleX, y: (me.clientY - rect.top) * scaleY };
  }

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e, canvas);
    lastPos.current = pos;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (isEraser ? brushSize * 3 : brushSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#ffffff' : color;
    ctx.fill();
  }, [color, brushSize, isEraser]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvas);
    if (!lastPos.current) { lastPos.current = pos; return; }
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth   = isEraser ? brushSize * 3 : brushSize;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
    lastPos.current = pos;
  }, [isDrawing, color, brushSize, isEraser]);

  const endDraw = useCallback(() => { setIsDrawing(false); lastPos.current = null; }, []);

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  async function addSticker() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    const imageData = canvas.toDataURL('image/png');
    const rotation  = (Math.random() - 0.5) * 14;
    const { data } = await supabase
      .from('stickers').insert({ image_data: imageData, rotation })
      .select().single();
    if (data) setStickers((prev) => [data as Sticker, ...prev]);
    setSaving(false);
    setShowCanvas(false);
    clearCanvas();
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 16px 16px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <p className="font-mono-pixel" style={{ fontSize: '0.65rem', color: 'var(--red)', opacity: 0.65, marginBottom: 4 }}>
              // draw.leave.forget
            </p>
            <h1 className="font-gothic neon-pink" style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Sticker Wall</h1>
          </div>
          <button className="btn-glitch btn-pink" onClick={() => setShowCanvas(true)}>
            + Draw Sticker
          </button>
        </div>

        {/* drawing modal */}
        {showCanvas && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setShowCanvas(false); }}
            style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          >
            <div className="glass-panel" style={{ width: '100%', maxWidth: 440, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 className="font-gothic neon-pink" style={{ fontSize: '1.1rem', margin: 0 }}>Draw Your Sticker</h2>
                <button className="btn-glitch" style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={() => setShowCanvas(false)}>✕</button>
              </div>

              <canvas
                ref={canvasRef}
                width={380} height={240}
                className="drawing-canvas"
                style={{ display: 'block', width: '100%', border: '1px solid rgba(255,0,64,0.3)', background: '#fff' }}
                onMouseDown={startDraw}  onMouseMove={draw}  onMouseUp={endDraw}  onMouseLeave={endDraw}
                onTouchStart={startDraw} onTouchMove={draw}  onTouchEnd={endDraw}
              />

              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* palette */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {PALETTE.map((c) => (
                    <button
                      key={c} title={c}
                      onClick={() => { setColor(c); setIsEraser(false); }}
                      style={{
                        width: 22, height: 22, borderRadius: 2, background: c, cursor: 'pointer', flexShrink: 0,
                        border: color === c && !isEraser ? '2.5px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                        boxShadow: color === c && !isEraser ? `0 0 8px ${c}` : 'none',
                      }}
                    />
                  ))}
                </div>

                {/* controls row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <label className="font-mono-pixel" style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Brush
                    <input type="range" min={1} max={20} value={brushSize}
                      onChange={(e) => setBrushSize(+e.target.value)}
                      className="track-slider" style={{ width: 80 }}
                    />
                    <span style={{ color: 'var(--red)', minWidth: 28 }}>{brushSize}px</span>
                  </label>
                  <button className={`btn-glitch ${isEraser ? 'btn-pink' : ''}`} style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={() => setIsEraser((v) => !v)}>
                    {isEraser ? '✕ ON' : '◎ Erase'}
                  </button>
                  <button className="btn-glitch" style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={clearCanvas}>
                    Clear
                  </button>
                </div>

                <button className="btn-glitch" style={{ width: '100%', padding: '10px' }} onClick={addSticker} disabled={saving}>
                  {saving ? 'Uploading...' : 'Add Sticker to Wall'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* sticker wall */}
        {loading ? (
          <p className="font-mono-pixel" style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', paddingTop: 80 }}>
            Loading stickers...
          </p>
        ) : stickers.length === 0 ? (
          <p className="font-mono-pixel" style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', paddingTop: 80 }}>
            The wall is empty. Be the first to leave a mark.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {stickers.map((s) => (
              <div
                key={s.id}
                className="sticker-item"
                style={{
                  transform: `rotate(${s.rotation}deg)`,
                  width: 128, height: 96,
                  border: '2px solid rgba(255,255,255,0.88)',
                  boxShadow: '2px 4px 12px rgba(0,0,0,0.6)',
                  background: '#fff',
                  overflow: 'hidden',
                  flexShrink: 0,
                  zIndex: 1,
                  position: 'relative',
                }}
              >
                <img src={s.image_data} alt="sticker" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>
      <BackButton onClick={() => navigate('home')} />
    </div>
  );
}
