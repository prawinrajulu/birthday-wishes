import React, { useState, useEffect, useRef } from 'react';
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

/* ── Confetti Particle Rain ──────────────────────────────────── */
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

/* ── Realistic 3D Birthday Cake SVG ────────────────── */
function BirthdayCakeSVG({ candleStates, candleCount, blowing, toggleCandle }) {
  return (
    <svg viewBox="0 0 320 360" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        {/* Stand Shimmer */}
        <linearGradient id="standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#eaeaea" />
          <stop offset="100%" stopColor="#8c8c8c" />
        </linearGradient>

        {/* 3D Cylindrical Cake Gradients */}
        <linearGradient id="cakeBottomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e04e6b" />
          <stop offset="25%" stopColor="#ff8ea8" />
          <stop offset="50%" stopColor="#ffb6c9" />
          <stop offset="75%" stopColor="#ff8ea8" />
          <stop offset="100%" stopColor="#ba354f" />
        </linearGradient>
        <linearGradient id="cakeBottomTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb6c9" />
          <stop offset="100%" stopColor="#ff8ea8" />
        </linearGradient>

        <linearGradient id="cakeMiddleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7652c7" />
          <stop offset="25%" stopColor="#a98bf2" />
          <stop offset="50%" stopColor="#c39bd3" />
          <stop offset="75%" stopColor="#a98bf2" />
          <stop offset="100%" stopColor="#553896" />
        </linearGradient>
        <linearGradient id="cakeMiddleTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c39bd3" />
          <stop offset="100%" stopColor="#a98bf2" />
        </linearGradient>

        <linearGradient id="cakeTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#bfa38e" />
          <stop offset="25%" stopColor="#f5e6d3" />
          <stop offset="50%" stopColor="#fffcf7" />
          <stop offset="75%" stopColor="#f5e6d3" />
          <stop offset="100%" stopColor="#9e8473" />
        </linearGradient>
        <linearGradient id="cakeTopTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fffcf7" />
          <stop offset="100%" stopColor="#eae0d5" />
        </linearGradient>

        {/* Shadow Filter */}
        <filter id="cakeShadow" x="-10%" y="-15%" width="120%" height="135%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.4)" />
        </filter>
        
        {/* Flame Shimmer */}
        <filter id="flameGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ── 3D Plate Stand ── */}
      <ellipse cx="160" cy="308" rx="95" ry="15" fill="url(#standGrad)" filter="url(#cakeShadow)" />
      <path d="M 144 308 L 176 308 L 184 340 L 136 340 Z" fill="#7a7a7a" />
      <ellipse cx="160" cy="340" rx="55" ry="7" fill="#525252" />

      {/* ── BOTTOM LAYER (3D Cylinder) ── */}
      {/* Side walls */}
      <path d="M 50 240 A 110 18 0 0 0 270 240 L 270 300 A 110 18 0 0 1 50 300 Z" fill="url(#cakeBottomGrad)" filter="url(#cakeShadow)" />
      {/* Top cap */}
      <ellipse cx="160" cy="240" rx="110" ry="18" fill="url(#cakeBottomTopGrad)" />
      {/* Bottom layer frosting dots */}
      {[65, 92, 119, 146, 173, 200, 227, 255].map((cx, i) => (
        <circle key={`frost-b-${i}`} cx={cx} cy="254 + (i%2)*2" r="5" fill="#fff" opacity="0.9" />
      ))}

      {/* ── MIDDLE LAYER (3D Cylinder) ── */}
      {/* Side walls */}
      <path d="M 75 178 A 85 14 0 0 0 245 178 L 245 230 A 85 14 0 0 1 75 230 Z" fill="url(#cakeMiddleGrad)" filter="url(#cakeShadow)" />
      {/* Top cap */}
      <ellipse cx="160" cy="178" rx="85" ry="14" fill="url(#cakeMiddleTopGrad)" />
      {/* Middle layer sprinkles */}
      {[90, 115, 140, 165, 190, 215, 230].map((cx, i) => (
        <g key={`swirl-m-${i}`}>
          <ellipse cx={cx} cy={186 + (i%3)*2} rx="4" ry="2" fill="#ff4d6d" />
          <line x1={cx-2} y1={188} x2={cx+2} y2={190} stroke="#FFD166" strokeWidth="1.5" />
        </g>
      ))}

      {/* ── TOP LAYER (3D Cylinder) ── */}
      {/* Side walls */}
      <path d="M 100 120 A 60 10 0 0 0 220 120 L 220 166 A 60 10 0 0 1 100 166 Z" fill="url(#cakeTopGrad)" filter="url(#cakeShadow)" />
      {/* Top cap */}
      <ellipse cx="160" cy="120" rx="60" ry="10" fill="url(#cakeTopTopGrad)" />
      {/* Chocolate drips on the top cylinder lip */}
      <path d="M 100 120 
               Q 110 134 116 120 
               Q 125 138 132 120 
               Q 145 140 152 120 
               Q 165 136 172 120 
               Q 185 142 192 120 
               Q 205 132 210 120 
               Q 216 128 220 120
               A 60 10 0 0 1 100 120 Z" fill="#5c3826" />

      {/* Strawberries sitting flat on the top layer cap */}
      {[[130, 116], [160, 118], [190, 116]].map(([cx, cy], i) => (
        <g key={`straw-${i}`} transform={`translate(${cx - 8}, ${cy - 12})`}>
          <path d="M 8 0 C 14 0 15 11 8 16 C 1 11 2 0 8 0 Z" fill="#ff4d6d" />
          <circle cx="5" cy="5" r="0.6" fill="#ffd166" />
          <circle cx="11" cy="6" r="0.6" fill="#ffd166" />
          <circle cx="8" cy="10" r="0.6" fill="#ffd166" />
          <polygon points="5,1 11,1 8,-3" fill="#2d6a4f" />
        </g>
      ))}

      {/* Sprinkles on middle & bottom */}
      <ellipse cx="120" cy="275" rx="3.5" ry="1.5" fill="#FFD166" />
      <ellipse cx="195" cy="270" rx="3" ry="1.5" fill="#B99CFF" />
      <ellipse cx="150" cy="285" rx="3" ry="1.5" fill="#FFD166" />
      <ellipse cx="215" cy="205" rx="3.5" ry="1.5" fill="#ff4d6d" />
      <ellipse cx="105" cy="210" rx="3" ry="1.5" fill="#FFF" />

      {/* ── CANDLES & FLAMES ── */}
      {Array.from({ length: candleCount }).map((_, i) => {
        // Positioned flat on the top cylinder top surface (from x=115 to x=205)
        const cx = 118 + (i * (84 / (candleCount - 1)));
        // Adjust candle base height to match ellipse curvature
        const cyBase = 118 + Math.pow(Math.abs(cx - 160) / 60, 2) * 5;
        const state = candleStates[i] || 'lit';
        const color = ['#FFB6C9', '#FFD166', '#B99CFF', '#ff7eb3', '#c39bd3', '#ff8ea8', '#87ceeb'][i % 7];

        return (
          <g key={i} style={{ cursor: 'pointer' }} onClick={() => toggleCandle(i)}>
            {/* Candle Body */}
            <rect x={cx - 3.5} y={cyBase - 36} width="7" height="36" rx="2" fill={color} />
            {/* Spiral ribbon decoration on candle */}
            <path d={`M ${cx - 3.5} ${cyBase - 30} L ${cx + 3.5} ${cyBase - 24} 
                     M ${cx - 3.5} ${cyBase - 20} L ${cx + 3.5} ${cyBase - 14} 
                     M ${cx - 3.5} ${cyBase - 10} L ${cx + 3.5} ${cyBase - 4}`} 
                  stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" fill="none" />
            {/* Wick */}
            <line x1={cx} y1={cyBase - 36} x2={cx} y2={cyBase - 42} stroke="#333" strokeWidth="1.2" />

            {/* Lit Flame */}
            {state === 'lit' && (
              <motion.g
                animate={{
                  scaleX: blowing ? [0.6, 0.4, 0.6] : [1, 0.88, 1.1, 1],
                  scaleY: blowing ? [0.7, 0.9, 0.7] : [1, 1.15, 0.9, 1],
                  skewX: blowing ? -22 : [0, 3, -3, 0],
                }}
                transition={{ repeat: Infinity, duration: 0.15 + (i * 0.02) }}
                style={{ transformOrigin: `${cx}px ${cyBase - 42}px` }}
              >
                {/* Outer Flame Glow */}
                <ellipse cx={cx} cy={cyBase - 52} rx="7.5" ry="11.5" fill="url(#flameOuter)" filter="url(#flameGlow)" opacity="0.95" />
                {/* Inner Core */}
                <ellipse cx={cx} cy={cyBase - 50} rx="4.2" ry="7.5" fill="#ffd166" />
                <ellipse cx={cx} cy={cyBase - 47} rx="1.8" ry="3.8" fill="#fff" />
              </motion.g>
            )}

            {/* Smoke Rise on Extinction */}
            {state === 'out' && (
              <motion.g
                initial={{ opacity: 0.8, y: 0 }}
                animate={{ opacity: 0, y: -25, scaleX: [1, 1.6, 2.2] }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                <ellipse cx={cx} cy={cyBase - 44} rx="2.5" ry="4.5" fill="rgba(210, 210, 210, 0.6)" />
              </motion.g>
            )}
          </g>
        );
      })}

      {/* Flame Outer Gradient definitions inside SVG */}
      <defs>
        <radialGradient id="flameOuter" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
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
  const [micActive, setMicActive]       = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const confettiColors = ['#ff7eb3', '#FFB6C9', '#B99CFF', '#ff4d6d', '#87ceeb', '#ffd166', '#fff'];
  const confettiPieces = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 1.5,
  }));

  // Toggle individual candle on tap/click
  const toggleCandle = (index) => {
    setCandleStates(prev => {
      const next = [...prev];
      next[index] = next[index] === 'lit' ? 'out' : 'lit';
      return next;
    });
  };

  // Check if all candles are blown out
  useEffect(() => {
    const isAllOut = candleStates.every(s => s === 'out');
    if (isAllOut && !allOut) {
      setAllOut(true);
      setShowConfetti(true);
      setHeartBurst(true);
      setBubbleText('I hope all your dreams come true! ✨');
      setShowBubble(true);
      stopMicDetection();
    } else if (!isAllOut && allOut) {
      setAllOut(false);
      setShowConfetti(false);
    }
  }, [candleStates]);

  // Handle Blow button trigger (staggered)
  const handleBlow = () => {
    if (blowing) return;
    setBlowing(true);

    candleStates.forEach((state, i) => {
      if (state === 'lit') {
        setTimeout(() => {
          setCandleStates(prev => {
            const next = [...prev];
            next[i] = 'out';
            return next;
          });
        }, i * 260 + 350);
      }
    });

    setTimeout(() => {
      setBlowing(false);
    }, CANDLE_COUNT * 260 + 500);
  };

  // Handle Relight button trigger (staggered)
  const handleRelight = () => {
    if (relighting) return;
    setRelighting(true);
    setAllOut(false);
    setShowConfetti(false);
    setShowBubble(false);

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

  // ── Microphone Blowing Detection ──
  const startMicDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      setMicActive(true);
      setBubbleText('Blow into your microphone to extinguish them! 🌬️');
      setShowBubble(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const detectBlow = () => {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume in higher frequency range (blow sound signature)
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Blow threshold detected (roughly average > 70)
        if (average > 75) {
          setBlowing(true);
          // Extinguish candles staggered based on volume
          setCandleStates(prev => {
            const next = [...prev];
            const litIndices = [];
            next.forEach((s, idx) => {
              if (s === 'lit') litIndices.push(idx);
            });
            
            if (litIndices.length > 0) {
              // Extinguish 1 or 2 random candles per detection tick
              const numToExtinguish = Math.min(litIndices.length, Math.random() > 0.5 ? 2 : 1);
              for (let k = 0; k < numToExtinguish; k++) {
                const randIndex = litIndices[Math.floor(Math.random() * litIndices.length)];
                next[randIndex] = 'out';
              }
            }
            return next;
          });
        } else {
          setBlowing(false);
        }

        animationFrameRef.current = requestAnimationFrame(detectBlow);
      };

      detectBlow();
    } catch (err) {
      console.error('Microphone access denied or unsupported:', err);
      setBubbleText('Could not access microphone. Use the blow button instead! 😊');
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 4000);
    }
  };

  const stopMicDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setMicActive(false);
  };

  useEffect(() => {
    return () => {
      stopMicDetection();
    };
  }, []);

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
          
          <BirthdayCakeSVG 
            candleStates={candleStates} 
            candleCount={CANDLE_COUNT} 
            blowing={blowing} 
            toggleCandle={toggleCandle}
          />
        </motion.div>

        {/* Blow / Relight / Mic controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 10 }}>
          <AnimatePresence mode="wait">
            {!allOut ? (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
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

               
              </div>
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
