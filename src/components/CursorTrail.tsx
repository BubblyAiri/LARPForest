import { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const colors = ['#ff0040', '#ff1493', '#ff69b4', '#ffffff', '#ff4466'];

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        sparksRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - 0.8,
          life: 1,
          size: 1.5 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      if (sparksRef.current.length > 120) {
        sparksRef.current.splice(0, sparksRef.current.length - 120);
      }
    };
    window.addEventListener('mousemove', onMove);

    let animId: number;

    function animate() {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.06;
        s.life -= 0.035;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, s.life);
        ctx!.fillStyle = s.color;
        ctx!.shadowColor = s.color;
        ctx!.shadowBlur = 6;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
      // cursor dot
      const { x, y } = mouseRef.current;
      if (x > -900) {
        ctx!.save();
        ctx!.fillStyle = '#ff0040';
        ctx!.shadowColor = '#ff0040';
        ctx!.shadowBlur = 14;
        ctx!.beginPath();
        ctx!.arc(x, y, 4, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }}
    />
  );
}
