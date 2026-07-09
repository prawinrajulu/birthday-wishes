import React, { useEffect, useRef } from 'react';

/**
 * HeartBurst — fires a canvas burst of hearts and sparkles from a center point.
 * Props:
 *   active   {boolean} — whether to render/fire the burst
 *   onDone   {function} — called when animation is complete
 *   origin   {[x,y]?}  — optional [x, y] in px (defaults to screen center)
 */
export default function HeartBurst({ active, onDone, origin }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const ox = origin ? origin[0] : canvas.width  / 2;
    const oy = origin ? origin[1] : canvas.height / 2;

    const COLORS = ['#ff7eb3','#ff4d6d','#ffd700','#c39bd3','#fff','#e91e8c','#f9ca24'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.push({
        x: ox, y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 14 + 5,
        alpha: 1,
        type: Math.random() < 0.5 ? 'heart' : (Math.random() < 0.5 ? 'star' : 'circle'),
        gravity: Math.random() * 0.2 + 0.1,
      });
    }

    let animId;
    let done = false;

    const drawHeart = (ctx, x, y, s, color, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = color;
      ctx.translate(x, y);
      ctx.beginPath();
      const r = s * 0.5;
      ctx.moveTo(0, r * 0.5);
      ctx.bezierCurveTo(-r, -r * 0.3, -r * 1.6, r * 0.8, 0, r * 1.8);
      ctx.bezierCurveTo(r * 1.6, r * 0.8, r, -r * 0.3, 0, r * 0.5);
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (ctx, x, y, s, color, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = color;
      ctx.translate(x, y);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? s * 0.5 : s * 0.2;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      particles.forEach(p => {
        if (p.alpha <= 0) return;
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= 0.014;

        if (p.type === 'heart')   drawHeart(ctx, p.x, p.y, p.size, p.color, Math.max(0, p.alpha));
        else if (p.type === 'star') drawStar(ctx, p.x, p.y, p.size, p.color, Math.max(0, p.alpha));
        else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive > 0) {
        animId = requestAnimationFrame(loop);
      } else if (!done) {
        done = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onDone && onDone();
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="heart-burst-canvas"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }}
    />
  );
}
