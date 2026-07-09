import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeddyBear from '../components/TeddyBear';
import BackButton from '../components/BackButton';
import HeartBurst from '../components/HeartBurst';
import { CONFIG } from '../data/config';

const sceneVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  exit:    { opacity: 0, y: 30,    transition: { duration: 0.45 } },
};

// ── Confetti Particle Rain ────────────────────────────────────
function ConfettiPiece({ x, color, delay }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: -15,
        left: `${x}%`,
        width: Math.random() * 8 + 6,
        height: Math.random() * 8 + 6,
        background: color,
        borderRadius: Math.random() > 0.55 ? '50%' : '2px',
        pointerEvents: 'none',
        zIndex: 10,
      }}
      initial={{ y: 0, opacity: 1, rotate: 0 }}
      animate={{ y: '110vh', opacity: [1, 1, 0], rotate: Math.random() * 720 - 360 }}
      transition={{ duration: 3 + Math.random() * 2, delay, ease: 'easeIn' }}
    />
  );
}

// ── Realistic Multi-Layer Birthday Cake SVG ──────────────────
function BirthdayCakeSVG({ candleStates, candleCount, blowing }) {
  return (
    <svg viewBox="0 0 320 340" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        {/* Frosting Gradients */}
        <linearGradient id="layerPink" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f36a8a" />
          <stop offset="45%" stopColor="#ffb6c9" />
          <stop offset="85%" stopColor="#ff8da9" />
          <stop offset="100%" stopColor="#d13f61" />
        </linearGradient>
        <linearGradient id="layerCream" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#eae0d5" />
          <stop offset="40%" stopColor="#fffcf7" />
          <stop offset="80%" stopColor="#f7ebd9" />
          <stop offset="100%" stopColor="#d5bdaf" />
        </linearGradient>
        <linearGradient id="layerLavender" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9a7fdb" />
          <stop offset="50%" stopColor="#c39bd3" />
          <stop offset="100%" stopColor="#7659b8" />
        </linearGradient>
        <linearGradient id="standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fcfcfc" />
          <stop offset="40%" stopColor="#eaeaea" />
          <stop offset="100%" stopColor="#b5b5b5" />
        </linearGradient>
        
        {/* Glow Filters */}
        <filter id="cakeGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="rgba(0,0,0,0.3)" />
        </filter>
        <filter id="flameGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Glossy Cake Stand & Stem */}
      <ellipse cx="160" cy="298" rx="88" ry="12" fill="url(#standGrad)" filter="url(#cakeGlow)" />
      <path d="M 148 298 L 172 298 L 180 328 L 140 328 Z" fill="#b5b5b5" opacity="0.8" />
      <ellipse cx="160" cy="328" rx="48" ry="6" fill="#9e9e9e" />

      {/* ── BOTTOM CAKE LAYER (Pink) ── */}
      <rect x="50" y="222" width="220" height="76" rx="14" fill="url(#layerPink)" filter="url(#cakeGlow)" />
      <rect x="50" y="222" width="220" height="20" rx="14" fill="rgba(255,255,255,0.35)" />
      {/* Decorative pearls & white frosting drops */}
      {[75,100,125,150,175,200,225,245].map((cx, i) => (
        <circle key={`pearl-b-${i}`} cx={cx} cy="242" r="5" fill="#fff" opacity="0.85" filter="url(#cakeGlow)" />
      ))}
      {[87,112,137,162,187,212,237].map((cx, i) => (
        <circle key={`pearl-b-sm-${i}`} cx={cx} cy="265" r="3" fill="#FFD166" />
      ))}

      {/* ── MIDDLE CAKE LAYER (Lavender) ── */}
      <rect x="75" y="160" width="170" height="64" rx="12" fill="url(#layerLavender)" filter="url(#cakeGlow)" />
      <rect x="75" y="160" width="170" height="16" rx="12" fill="rgba(255,255,255,0.3)" />
      {/* Frosting Swirls & Sprinkles */}
      {[95,120,145,170,195,225].map((cx, i) => (
        <g key={`swirl-m-${i}`}>
          <path d={`M ${cx - 6} 176 Q ${cx} 168 ${cx + 6} 176 Z`} fill="#fff" opacity="0.9" />
          <circle cx={cx} cy="184" r="3.5" fill="#ff4d6d" />
        </g>
      ))}

      {/* ── TOP CAKE LAYER (Cream) ── */}
      <rect x="100" y="106" width="120" height="56" rx="10" fill="url(#layerCream)" filter="url(#cakeGlow)" />
      <rect x="100" y="106" width="120" height="12" rx="10" fill="rgba(255,255,255,0.4)" />
      {/* Chocolate drips and strawberries */}
      {[120, 140, 160, 180, 200].map((cx, i) => (
        <path key={`drip-${i}`} d={`M ${cx - 4} 118 Q ${cx} ${128 + (i % 2) * 4} ${cx + 4} 118 Z`} fill="#5c3826" />
      ))}

      {/* Strawberries on Top */}
      {[125, 160, 195].map((cx, i) => (
        <g key={`strawberry-${i}`} transform={`translate(${cx - 8}, 88)`}>
          <path d="M 8 0 C 15 0 16 12 8 18 C 0 12 1 0 8 0 Z" fill="#ff4d6d" />
          <circle cx="5" cy="6" r="0.8" fill="#ffd166" />
          <circle cx="11" cy="7" r="0.8" fill="#ffd166" />
          <circle cx="8" cy="12" r="0.8" fill="#ffd166" />
          {/* Green leaf cap */}
          <polygon points="4,2 12,2 8,-2" fill="#2d6a4f" />
        </g>
      ))}

      {/* Gold sprinkles on the sides */}
      <circle cx="115" cy="275" r="2.5" fill="#FFD166" />
      <circle cx="205" cy="270" r="2" fill="#FFD166" />
      <circle cx="150" cy="282" r="2" fill="#FFD166" />
      <circle cx="230" cy="190" r="2.5" fill="#FFD166" />
      <circle cx="95"  cy="195" r="2" fill="#FFD166" />

      {/* ── CANDLES & FLAMES ── */}
      {Array.from({ length: candleCount }).map((_, i) => {
        // Spaced across top tier surface (width 120, from x=100 to x=220)
        const cx = 115 + (i * (90 / (candleCount - 1)));
        const state = candleStates[i] || 'lit';
        const color = ['#FFB6C9', '#FFD166', '#B99CFF', '#ff7eb3', '#87ceeb'][i % 5];

        return (
          <g key={i}>
            {/* Candle Body */}
            <rect x={cx - 4} y="72" width="8" height="34" rx="2.5" fill={color} />
            <rect x={cx - 1.5} y="74" width="2" height="26" fill="rgba(255, 255, 255, 0.45)" rx="0.5" />
            
            {/* Wick */}
            <line x1={cx} y1="72" x2={cx} y2="65" stroke="#333" strokeWidth="1.5" />

            {/* Lit Flame */}
            {state === 'lit' && (
              <motion.g
                animate={{
                  scaleX: blowing ? [0.65, 0.5, 0.65] : [1, 0.85, 1.1, 1],
                  scaleY: blowing ? [0.7, 0.9, 0.7] : [1, 1.12, 0.9, 1],
                  skewX: blowing ? -24 : [0, 2, -2, 0],
                }}
                transition={{ repeat: Infinity, duration: 0.15 }}
                style={{ transformOrigin: `${cx}px 65px` }}
              >
                {/* Outer Flame Glow */}
                <ellipse cx={cx} cy="55" rx="8" ry="12" fill="url(#flameOuter)" filter="url(#flameGlow)" opacity="0.95" />
                {/* Inner Core */}
                <ellipse cx={cx} cy="57" rx="4.5" ry="8" fill="#ffd166" />
                <ellipse cx={cx} cy="60" rx="2" ry="4" fill="#fff" />
              </motion.g>
            )}

            {/* Smoke Rise */}
            {state === 'out' && (
              <motion.g
                initial={{ opacity: 0.8, y: 0 }}
                animate={{ opacity: 0, y: -20, scaleX: [1, 1.6, 2.2] }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              >
                <ellipse cx={cx} cy="60" rx="3" ry="5" fill="rgba(200, 200, 200, 0.7)" />
              </motion.g>
            )}
          </g>
        );
      })}

      {/* Flame Outer Gradient definitions inside SVG */}
      <defs>
        <radialGradient id="flameOuter" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#fff8c0" />
          <stop offset="25%" stopColor="#ffd166" />
          <stop offset="60%" stopColor="#ff4d6d" />
          <stop offset="100%" stopColor="rgba(255, 77, 109, 0)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function BirthdayCake({ onBack }) {
  const CANDLE_COUNT = 7;
  const [candleStates, setCandleStates] = useState(Array(CANDLE_COUNT).fill('lit'));
  const [allOut, setAllOut]             = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [heartBurst, setHeartBurst]     = useState(false);
  const [showBubble, setShowBubble]     = useState(false);
  const [bubbleText, setBubbleText]     = useState('');
  const [blowing, setBlowing]           = useState(false);
  const [relighting, setRelighting]     = useState(false);

  const confettiColors = ['#ff7eb3', '#FFB6C9', '#B99CFF', '#ff4d6d', '#87ceeb', '#ffd166', '#fff'];
  const confettiPieces = Array.from({ length: 65 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 1.5,
  }));

  const handleBlow = () => {
    if (blowing) return;
    setBlowing(true);

    // Staggered flame extinction
    candleStates.forEach((_, i) => {
      setTimeout(() => {
        setCandleStates(prev => {
          const next = [...prev];
          next[i] = 'out';
          return next;
        });
      }, i * 260 + 350);
    });

    // All extinguished
    setTimeout(() => {
      setAllOut(true);
      setShowConfetti(true);
      setHeartBurst(true);
      setBubbleText('Wish pannitiya? I hope all your dreams come true! ✨');
      setShowBubble(true);
      setBlowing(false);
    }, CANDLE_COUNT * 260 + 900);
  };

  const handleRelight = () => {
    if (relighting) return;
    setRelighting(true);
    setAllOut(false);
    setShowConfetti(false);
    setShowBubble(false);

    // Staggered candle ignition
    Array.from({ length: CANDLE_COUNT }).forEach((_, i) => {
      setTimeout(() => {
        setCandleStates(prev => {
          const next = [...prev];
          next[i] = 'lit';
          return next;
        });
      }, i * 220 + 200);
    });

    setTimeout(() => {
      setRelighting(false);
      setBubbleText('Yay! They are shining again! 🕯️✨');
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 3000);
    }, CANDLE_COUNT * 220 + 500);
  };

  // Heart balloons decorations (moving background)
  const balloons = [
    { color: '#FFB6C9', left: '4%',  bottom: '12%', size: 52, dur: 5.8 },
    { color: '#FFD166', left: '88%', bottom: '10%', size: 45, dur: 6.5 },
    { color: '#B99CFF', left: '92%', bottom: '52%', size: 38, dur: 4.6 },
    { color: '#FF4D6D', left: '2%',  bottom: '48%', size: 40, dur: 7.2 },
  ];

  return (
    <motion.div
      className="scene bg-cake"
      variants={sceneVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Background Fairy Lights */}
      <div className="fairy-lights" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="light-dot"
            animate={{ opacity: [1, 0.2, 1], scale: [1, 0.7, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 + (i % 4) * 0.25, delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Floating balloons */}
      {balloons.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: b.left, bottom: b.bottom,
            width: b.size, height: b.size * 1.25,
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), ${b.color})`,
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            pointerEvents: 'none', zIndex: 1,
          }}
          animate={{ y: [0, -22, 0], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: b.dur, ease: 'easeInOut' }}
        >
          <svg style={{ position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)' }} width="2" height="28">
            <line x1="1" y1="0" x2="1" y2="28" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          </svg>
        </motion.div>
      ))}

      {/* Confetti Rain Layer */}
      <AnimatePresence>
        {showConfetti && confettiPieces.map(p => (
          <ConfettiPiece key={p.id} x={p.x} color={p.color} delay={p.delay} />
        ))}
      </AnimatePresence>

      {/* Spotlight centered on cake stand */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(255, 209, 102, 0.12) 0%, transparent 60%)',
        filter: 'blur(30px)',
        pointerEvents: 'none', zIndex: 2
      }} />

      {/* Soft Fog layers */}
      <div className="fog-overlay" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, background: 'linear-gradient(0deg, rgba(26,18,8,0.3) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />

      {/* Main Cake Box Container */}
      <div className="cake-scene-inner" style={{ position: 'relative', zIndex: 3 }}>
        <motion.h1
          className="cake-heading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
        >
          {allOut
            ? 'Your Wish Has Been Made! 🌟'
            : 'Make a Wish Before You Blow the Candles 🎂'}
        </motion.h1>

        {/* Cinematic Zoom Cake Frame */}
        <motion.div
          animate={blowing ? { scale: 1.14 } : { scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          style={{ width: '100%', maxWidth: 280, position: 'relative', display: 'flex', justifyContent: 'center' }}
        >
          {/* Cake Stand Reflection */}
          <div style={{
            position: 'absolute', bottom: -5, left: '15%', right: '15%',
            height: 15,
            background: 'radial-gradient(ellipse, rgba(249, 202, 36, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          
          <BirthdayCakeSVG candleStates={candleStates} candleCount={CANDLE_COUNT} blowing={blowing} />
        </motion.div>

        {/* Blow / Relight controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 10 }}>
          <AnimatePresence mode="wait">
            {!allOut ? (
              <motion.button
                key="blow"
                type="button"
                className="btn-primary"
                onClick={handleBlow}
                disabled={blowing}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💨 Blow the Candles
              </motion.button>
            ) : (
              <motion.button
                key="relight"
                type="button"
                className="btn-gold"
                onClick={handleRelight}
                disabled={relighting}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🕯️ Light the Candles Again
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Success Wish Text */}
        <AnimatePresence>
          {allOut && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: 'Dancing Script, cursive',
                fontSize: '1.25rem',
                color: 'var(--pink)',
                textAlign: 'center',
                marginTop: 8,
                textShadow: '0 2px 10px rgba(255, 77, 109, 0.5)',
              }}
            >
              ✨ May all your wishes come true this year ✨
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Celebrating Teddy Bear holding tiny birthday flag */}
      <TeddyBear
        mood="celebrate"
        size={95}
        style={{ position: 'fixed', bottom: 60, right: 20, zIndex: 6 }}
        speechText={bubbleText}
        showBubble={showBubble}
      />

      {/* Heart Burst Canvas Effect */}
      <HeartBurst active={heartBurst} onDone={() => setHeartBurst(false)} />

      <BackButton onClick={onBack} />
    </motion.div>
  );
}
