import React, { useEffect, useRef } from 'react';

// Floating particles: hearts, rose petals, stars, sparkles
export default function FloatingParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Check for reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const COUNT = prefersReducedMotion ? 10 : 55;

    const TYPES = ['heart', 'petal', 'star', 'sparkle', 'circle'];
    const COLORS = [
      '#ff7eb3', '#ff4d6d', '#ffd700', '#c39bd3',
      '#fff5f5', '#f9ca24', '#ff7597', '#e91e8c'
    ];

    class Particle {
      constructor() { this.reset(true); }

      reset(init = false) {
        this.x    = Math.random() * canvas.width;
        this.y    = init ? Math.random() * canvas.height : canvas.height + 20;
        this.size = Math.random() * 10 + 4;
        this.speed = Math.random() * 0.6 + 0.2;
        this.opacity  = Math.random() * 0.6 + 0.15;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.type  = TYPES[Math.floor(Math.random() * TYPES.length)];
        this.drift = (Math.random() - 0.5) * 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.swayAmp   = Math.random() * 1.5;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.tick = 0;
      }

      update() {
        this.tick++;
        this.y -= this.speed;
        this.x += Math.sin(this.tick * this.swaySpeed + this.swayOffset) * this.swayAmp * 0.3 + this.drift;
        this.rotation += this.rotSpeed;
        if (this.y < -20) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle   = this.color;
        ctx.strokeStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.type === 'heart') {
          drawHeart(ctx, this.size);
        } else if (this.type === 'petal') {
          drawPetal(ctx, this.size);
        } else if (this.type === 'star') {
          drawStar(ctx, this.size);
        } else if (this.type === 'sparkle') {
          drawSparkle(ctx, this.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    function drawHeart(ctx, s) {
      const r = s * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.5);
      ctx.bezierCurveTo(-r, -r * 0.3, -r * 1.6, r * 0.8, 0, r * 1.8);
      ctx.bezierCurveTo(r * 1.6, r * 0.8, r, -r * 0.3, 0, r * 0.5);
      ctx.fill();
    }

    function drawPetal(ctx, s) {
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.4, s * 0.25, s * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawStar(ctx, s) {
      const r1 = s * 0.5, r2 = s * 0.2, pts = 5;
      ctx.beginPath();
      for (let i = 0; i < pts * 2; i++) {
        const r = i % 2 === 0 ? r1 : r2;
        const angle = (i * Math.PI) / pts - Math.PI / 2;
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
    }

    function drawSparkle(ctx, s) {
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * s * 0.6, Math.sin(a) * s * 0.6);
      }
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" />;
}
