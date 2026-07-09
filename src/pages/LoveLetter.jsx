import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeddyBear from '../components/TeddyBear';
import BackButton from '../components/BackButton';
import HeartBurst from '../components/HeartBurst';
import { CONFIG } from '../data/config';

const sceneVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit:    { opacity: 0, transition: { duration: 0.45 } },
};

// ── Stars scattered in background ────────────────────────────
function Stars() {
  const stars = Array.from({ length: 35 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2.5 + 0.8,
    delay: Math.random() * 4,
    dur: Math.random() * 2 + 1.5,
  }));
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {stars.map((s, i) => (
        <motion.circle
          key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.size}
          fill="white"
          animate={{ opacity: [0.08, 0.55, 0.08] }}
          transition={{ repeat: Infinity, duration: s.dur, delay: s.delay }}
        />
      ))}
    </svg>
  );
}

// ── Moonlight glow at top ─────────────────────────────────────
function Moon() {
  return (
    <motion.div
      style={{
        position: 'fixed', top: -40, left: '50%', transform: 'translateX(-50%)',
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, rgba(255,253,220,0.22), rgba(255,248,200,0.06) 60%, transparent)',
        pointerEvents: 'none', zIndex: 0,
        boxShadow: '0 0 80px 30px rgba(255,253,200,0.07)',
      }}
      animate={{ scale: [1, 1.04, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ repeat: Infinity, duration: 5 }}
    />
  );
}

// ── SVG Envelope ──────────────────────────────────────────────
function EnvelopeSVG({ opened }) {
  return (
    <svg viewBox="0 0 300 220" style={{ width: '100%' }}>
      <defs>
        <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f3e5f5" />
          <stop offset="50%"  stopColor="#fce4ec" />
          <stop offset="100%" stopColor="#e8eaf6" />
        </linearGradient>
        <filter id="envShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgba(155,89,182,0.35)" />
        </filter>
      </defs>

      {/* Envelope body */}
      <rect x="10" y="60" width="280" height="155" rx="10" fill="url(#envGrad)" filter="url(#envShadow)" />

      {/* Bottom fold lines */}
      <path d="M10 215 L150 138 L290 215Z" fill="#e1bee7" opacity="0.7" />
      <line x1="10" y1="215" x2="150" y2="138" stroke="#ce93d8" strokeWidth="1" opacity="0.5" />
      <line x1="290" y1="215" x2="150" y2="138" stroke="#ce93d8" strokeWidth="1" opacity="0.5" />

      {/* Left fold */}
      <path d="M10 60 L150 138 L10 215Z" fill="#d1c4e9" opacity="0.55" />
      {/* Right fold */}
      <path d="M290 60 L150 138 L290 215Z" fill="#d1c4e9" opacity="0.55" />

      {/* Top flap — animates open */}
      <motion.path
        d={opened ? "M10 60 Q150 0 290 60 L150 108Z" : "M10 60 Q150 140 290 60 L150 138Z"}
        fill="#e8eaf6"
        stroke="#ce93d8" strokeWidth="1"
        animate={{ d: opened ? "M10 60 Q150 -20 290 60 L150 100Z" : "M10 60 Q150 140 290 60 L150 138Z" }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ transformOrigin: '150px 60px' }}
      />

      {/* Shimmer on envelope */}
      <ellipse cx="80" cy="90" rx="30" ry="10" fill="rgba(255,255,255,0.15)" transform="rotate(-20 80 90)" />

      {/* Decorative border */}
      <rect x="10" y="60" width="280" height="155" rx="10" fill="none"
        stroke="rgba(206,147,216,0.4)" strokeWidth="1.5" />

      {/* Tiny hearts on envelope */}
      <text x="40"  y="185" fontSize="10" fill="rgba(233,30,140,0.3)">♥</text>
      <text x="248" y="185" fontSize="10" fill="rgba(233,30,140,0.3)">♥</text>
      <text x="40"  y="85"  fontSize="8"  fill="rgba(233,30,140,0.2)">♥</text>
      <text x="252" y="85"  fontSize="8"  fill="rgba(233,30,140,0.2)">♥</text>
    </svg>
  );
}

export default function LoveLetter({ onBack, onReplay }) {
  const [stage, setStage]             = useState('envelope'); // envelope | letter | final
  const [opened, setOpened]           = useState(false);
  const [typedText, setTypedText]     = useState('');
  const [typingDone, setTypingDone]   = useState(false);
  const [showBubble, setShowBubble]   = useState(true);
  const [heartBurst, setHeartBurst]   = useState(false);
  const [finalBurst, setFinalBurst]   = useState(false);
  const letterRef = useRef(null);
  const typingRef = useRef(null);

  // ── Full letter text from config ─────────────────────────────
  // 📝 CHANGE LETTER TEXT: Edit CONFIG.letterMessage in src/data/config.js
  const fullText = CONFIG.letterMessage;

  const handleSealClick = () => {
    if (stage !== 'envelope') return;
    setOpened(true);
    setTimeout(() => {
      setStage('letter');
      startTyping();
    }, 900);
  };

  const startTyping = () => {
    let i = 0;
    const speed = 28; // ms per character — lower = faster
    const type = () => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
        // Auto-scroll letter paper
        if (letterRef.current) {
          letterRef.current.scrollTop = letterRef.current.scrollHeight;
        }
        typingRef.current = setTimeout(type, speed);
      } else {
        setTypingDone(true);
      }
    };
    typingRef.current = setTimeout(type, 400);
  };

  const handleSendLove = () => {
    setHeartBurst(true);
    setFinalBurst(true);
    setTimeout(() => setStage('final'), 1400);
  };

  useEffect(() => {
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, []);

  // Floating rose petals (fixed decorations)
  const petals = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${5 + i * 9}%`,
    top: `${10 + (i % 4) * 20}%`,
    delay: i * 0.4,
  }));

  return (
    <motion.div
      className="scene bg-letter"
      variants={sceneVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Stars />
      <Moon />

      {/* Rose petals */}
      {petals.map(p => (
        <motion.span
          key={p.id}
          style={{
            position: 'fixed', left: p.left, top: p.top,
            fontSize: 16, pointerEvents: 'none', zIndex: 1, opacity: 0.35,
          }}
          animate={{ y: [0, 14, 0], rotate: [0, 20, -10, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 4 + p.id * 0.3, delay: p.delay }}
        >
          🌹
        </motion.span>
      ))}

      {/* Fairy lights top strip */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 8px', zIndex: 2, pointerEvents: 'none' }}>
        {['#ff7eb3','#ffd700','#c39bd3','#ff4d6d','#ffd700','#ff7eb3','#c39bd3','#ffd700','#ff4d6d','#c39bd3','#ff7eb3','#ffd700'].map((c, i) => (
          <motion.div
            key={i}
            style={{ width: 8, height: 8, borderRadius: '50%', background: c }}
            animate={{ opacity: [1, 0.2, 1], scale: [1, 0.7, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 + (i % 4) * 0.3, delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* ── ENVELOPE STAGE ── */}
      <AnimatePresence mode="wait">
        {stage === 'envelope' && (
          <motion.div
            key="env"
            style={{
              position: 'relative', zIndex: 2,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 24,
              padding: '60px 20px 80px',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="letter-heading">
              One Last Gift… Straight From My Heart 💌
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', textAlign: 'center', fontStyle: 'italic' }}>
              Tap the heart seal to open your letter
            </p>

            {/* Floating envelope */}
            <motion.div
              className="envelope-wrap"
              style={{ position: 'relative', maxWidth: 300, width: '90vw' }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              onClick={handleSealClick}
            >
              <EnvelopeSVG opened={opened} />

              {/* Heart seal button */}
              <motion.button
                className="heart-seal"
                style={{
                  position: 'absolute', top: '55%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 52, height: 52,
                  background: 'linear-gradient(135deg, #ff4d6d, #ff7eb3)',
                  border: 'none', borderRadius: '50%',
                  cursor: 'pointer', zIndex: 5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: '0 0 20px rgba(255,77,109,0.6), 0 0 50px rgba(255,77,109,0.25)',
                }}
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSealClick}
              >
                💝
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── LETTER STAGE ── */}
        {stage === 'letter' && (
          <motion.div
            key="ltr"
            style={{
              position: 'relative', zIndex: 2,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 16,
              width: '100%',
              padding: '50px 20px 90px',
              maxWidth: 560,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontFamily: 'Dancing Script, cursive',
              fontSize: 'clamp(1.1rem,3vw,1.5rem)',
              color: 'var(--lavender)',
              textAlign: 'center',
            }}>
              A Letter Just For You 💌
            </h2>

            {/* Letter paper */}
            <motion.div
              ref={letterRef}
              className="letter-paper"
              initial={{ opacity: 0, scaleY: 0.4, y: -30 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ transformOrigin: 'top center' }}
            >
              {/* Decorative header on paper */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 22 }}>🌸💌🌸</span>
              </div>

              <p className="letter-text">
                {typedText}
                {!typingDone && <span className="cursor-blink" />}
              </p>
            </motion.div>

            {/* Skip typing button */}
            {!typingDone && (
              <motion.button
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '8px 20px' }}
                onClick={() => {
                  if (typingRef.current) clearTimeout(typingRef.current);
                  setTypedText(fullText);
                  setTypingDone(true);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                whileHover={{ opacity: 1 }}
              >
                Read full letter instantly →
              </motion.button>
            )}

            {/* "Send More Love" button after typing done */}
            <AnimatePresence>
              {typingDone && (
                <motion.div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                >
                  <motion.button
                    className="btn-love"
                    onClick={handleSendLove}
                    animate={{
                      boxShadow: [
                        '0 6px 24px rgba(155,89,182,0.5)',
                        '0 6px 40px rgba(255,126,179,0.7)',
                        '0 6px 24px rgba(155,89,182,0.5)',
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    ❤️ Send You More Love
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── FINAL STAGE ── */}
        {stage === 'final' && (
          <motion.div
            key="final"
            className="final-message"
            style={{ position: 'relative', zIndex: 2, padding: '60px 24px 80px', maxWidth: 560, width: '100%' }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 140, damping: 16 }}
          >
            {/* Big animated heart */}
            <motion.div
              style={{ fontSize: 64, textAlign: 'center', marginBottom: 16 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              💖
            </motion.div>

            <h1 className="final-heading">
              {/* 🎂 CHANGE BIRTHDAY GIRL NAME in config.js */}
              Happy Birthday, {CONFIG.birthdayGirlName} ❤️
              <br />
              <span style={{ fontSize: '0.65em', opacity: 0.8 }}>
                You deserve every beautiful thing in this world.
              </span>
            </h1>

            {/* Floating emojis */}
            {['💕','🌸','✨','💖','🌹','💫','🎀','⭐'].map((e, i) => (
              <motion.span
                key={i}
                style={{
                  position: 'absolute',
                  fontSize: `${16 + i * 3}px`,
                  left: `${8 + i * 11}%`,
                  top: `${15 + (i % 4) * 18}%`,
                  pointerEvents: 'none',
                }}
                animate={{ y: [0, -14, 0], opacity: [0.4, 0.9, 0.4], rotate: [0, 10, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 + i * 0.3, delay: i * 0.2 }}
              >
                {e}
              </motion.span>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 32 }}>
              <motion.button
                className="btn-primary"
                onClick={onReplay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔁 Watch This Surprise Again
              </motion.button>

              <button className="btn-secondary" onClick={onBack}>
                ← Back to Gifts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Romantic teddy — holds rose, gives hug */}
      <TeddyBear
        mood="romantic"
        size={90}
        style={{ position: 'fixed', bottom: 64, right: 20, zIndex: 6 }}
        speechText={stage === 'final' ? 'Big hugs for you! 🤗💖' : 'This letter is full of love just for you 🌹'}
        showBubble={showBubble}
      />

      {/* Heart burst on "Send Love" click */}
      <HeartBurst active={heartBurst} onDone={() => setHeartBurst(false)} />
      {/* Second bigger burst for final reveal */}
      {finalBurst && (
        <HeartBurst
          active={finalBurst}
          onDone={() => setFinalBurst(false)}
          origin={[window.innerWidth / 2, window.innerHeight / 2]}
        />
      )}

      {stage !== 'final' && <BackButton onClick={onBack} />}
    </motion.div>
  );
}
