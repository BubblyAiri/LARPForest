import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  type: 'crystal' | 'petal';
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const colors = ['#ff0040', '#ff1493', '#ff69b4', '#ffffff', '#ffb3cc'];

    function spawnParticle(): Particle {
      const isPetal = Math.random() > 0.5;
      return {
        x: Math.random() * width,
        y: -20,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.4 + Math.random() * 0.8,
        size: isPetal ? 3 + Math.random() * 5 : 2 + Math.random() * 3,
        alpha: 0.4 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        type: isPetal ? 'petal' : 'crystal',
      };
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 65; i++) {
      const p = spawnParticle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    function drawCrystal(p: Particle) {
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.globalAlpha = p.alpha;
      ctx!.fillStyle = p.color;
      ctx!.shadowColor = p.color;
      ctx!.shadowBlur = 8;
      ctx!.beginPath();
      const s = p.size;
      ctx!.moveTo(0, -s);
      ctx!.lineTo(s * 0.4, 0);
      ctx!.lineTo(0, s);
      ctx!.lineTo(-s * 0.4, 0);
      ctx!.closePath();
      ctx!.fill();
      ctx!.restore();
    }

    function drawPetal(p: Particle) {
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.globalAlpha = p.alpha * 0.65;
      ctx!.fillStyle = p.color;
      ctx!.shadowColor = p.color;
      ctx!.shadowBlur = 12;
      ctx!.beginPath();
      ctx!.ellipse(0, 0, p.size * 0.45, p.size, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    let animId: number;

    function animate() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = '#080810';
      ctx!.fillRect(0, 0, width, height);

      // vignette
      const grad = ctx!.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.72
      );
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (p.y > height + 24) {
          particles[i] = spawnParticle();
          continue;
        }
        if (p.type === 'crystal') drawCrystal(p);
        else drawPetal(p);
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
      <div className="scanlines" />
      <div className="grid-overlay" />
    </>
  );
}
