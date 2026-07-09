import React from 'react';
import { motion } from 'framer-motion';
import GiftBox from '../components/GiftBox';
import TeddyBear from '../components/TeddyBear';

const sceneVariants = {
  initial:  { opacity: 0, scale: 1.05 },
  animate:  { opacity: 1, scale: 1, transition: { duration: 0.7 } },
  exit:     { opacity: 0, y: -30,   transition: { duration: 0.45 } },
};

const GIFTS = [
  { id: 1, label: 'A little surprise awaits...', emoji: '💖' },
  { id: 2, label: 'Tap to discover...', emoji: '🕯️' },
  { id: 3, label: 'Something special is waiting for you...', emoji: '✉️' },
];

// Fairy lights across the top
function FairyLights() {
  return (
    <div className="fairy-lights" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="light-dot"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 + (i % 4) * 0.3, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

// Floating balloon decorations
function Balloons() {
  const balloons = [
    { color: '#ff7eb3', left: '5%',  bottom: '10%', size: 55, dur: 5 },
    { color: '#c39bd3', left: '88%', bottom: '15%', size: 48, dur: 6.5 },
    { color: '#ffd700', left: '92%', bottom: '45%', size: 40, dur: 4.5 },
    { color: '#ff4d6d', left: '2%',  bottom: '55%', size: 44, dur: 7 },
  ];

  return (
    <>
      {balloons.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: b.left,
            bottom: b.bottom,
            width: b.size,
            height: b.size * 1.2,
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3), ${b.color})`,
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          animate={{ y: [0, -18, 0], rotate: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: b.dur, ease: 'easeInOut' }}
        >
          {/* Balloon string */}
          <svg style={{ position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)' }} width="2" height="24">
            <line x1="1" y1="0" x2="1" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

export default function GiftSelection({ onSelectGift }) {
  return (
    <motion.div
      className="scene bg-gifts"
      variants={sceneVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FairyLights />
      <Balloons />

      {/* Moonlight top glow */}
      <div style={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 200,
        background: 'radial-gradient(ellipse, rgba(255,248,220,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Content */}
      <motion.div
        style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        {/* Heading */}
        <motion.h1
          className="gifts-heading"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          Choose Your Birthday Surprise 🎁
        </motion.h1>

        <p className="gifts-subtitle">Three luxury boxes made specially for you.</p>

        {/* Gift boxes */}
        <div className="gifts-grid">
          {GIFTS.map((g) => (
            <GiftBox
              key={g.id}
              id={g.id}
              label={g.label}
              emoji={g.emoji}
              onClick={() => onSelectGift(g.id)}
            />
          ))}
        </div>
      </motion.div>

      {/* Excited waving teddy */}
      <TeddyBear
        mood="excited"
        size={100}
        style={{ position: 'absolute', bottom: 16, left: 20, zIndex: 5 }}
        speechText="Choose one to unlock its mystery! 🌟"
        showBubble={true}
      />

      {/* Floating stars scattered */}
      {['✨','⭐','💫','🌟','✦'].map((s, i) => (
        <motion.span
          key={i}
          style={{
            position: 'absolute',
            fontSize: `${14 + i * 4}px`,
            left: `${12 + i * 18}%`,
            top: `${10 + (i % 3) * 25}%`,
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.4,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.7, 0.2], rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 + i * 0.4, delay: i * 0.3 }}
        >
          {s}
        </motion.span>
      ))}
    </motion.div>
  );
}
