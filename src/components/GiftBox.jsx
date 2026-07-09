import React from 'react';
import { motion } from 'framer-motion';

const RIBBON_CONFIGS = {
  1: { box: '#c0392b', lid: '#922b21', ribbon: '#ffd700', bow: '#f9ca24' },
  2: { box: '#8e44ad', lid: '#6c3483', ribbon: '#ff7eb3', bow: '#ff4d6d' },
  3: { box: '#1a5276', lid: '#154360', ribbon: '#f7d794', bow: '#ffd700' },
};

const GLOW_COLORS = {
  1: 'rgba(255,77,109,0.55)',
  2: 'rgba(249,202,36,0.55)',
  3: 'rgba(155,89,182,0.55)',
};

export default function GiftBox({ id, label, emoji, onClick }) {
  const cfg = RIBBON_CONFIGS[id] || RIBBON_CONFIGS[1];
  const glow = GLOW_COLORS[id] || GLOW_COLORS[1];

  return (
    <motion.div
      className={`gift-card gift-${id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 16, delay: (id - 1) * 0.12 }}
      whileHover={{ scale: 1.06, y: -14 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Floating hearts on hover */}
      <div className="gift-sparkle">
        {['💕','✨','🌸','💖'].map((e, i) => (
          <motion.span
            key={i}
            style={{
              position: 'absolute',
              fontSize: 14,
              top: `${15 + i * 18}%`,
              left: `${8 + i * 22}%`,
              pointerEvents: 'none',
            }}
            animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.4 + i * 0.3, delay: i * 0.2 }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      {/* Cinematic spotlight glow overlay on card */}
      <div className="card-spotlight" />

      {/* SVG Gift Box */}
      <div className="gift-box-wrapper">
        <svg className="gift-box-svg" viewBox="0 0 100 110" fill="none">
          <rect x="10" y="52" width="80" height="52" rx="4" fill={cfg.box} />
          <rect x="6"  y="36" width="88" height="20" rx="4" fill={cfg.lid} />
          <rect x="45" y="52" width="10" height="52" fill={cfg.ribbon} opacity="0.85" />
          <rect x="6"  y="43" width="88" height="6"  fill={cfg.ribbon} opacity="0.85" />
          
          <motion.ellipse
            cx="36" cy="30" rx="16" ry="10"
            fill={cfg.bow}
            transform="rotate(-30 36 30)"
            animate={{ rotate: [-30, -25, -30] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <motion.ellipse
            cx="64" cy="30" rx="16" ry="10"
            fill={cfg.bow}
            transform="rotate(30 64 30)"
            animate={{ rotate: [30, 25, 30] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.1 }}
          />
          <circle cx="50" cy="32" r="7" fill={cfg.bow} />
          <ellipse cx="25" cy="65" rx="6" ry="3" fill="rgba(255,255,255,0.15)" transform="rotate(-20 25 65)" />
          <text x="20" y="95" fontSize="10" fill="rgba(255,255,255,0.3)">✦</text>
          <text x="65" y="85" fontSize="8"  fill="rgba(255,255,255,0.25)">✦</text>
        </svg>
      </div>

      <div className="gift-info">
        <span className="gift-emoji">{emoji}</span>
        <p className="gift-label">{label}</p>
      </div>

      {/* Modern explicit Open Gift button */}
      <div className="gift-open-btn-container">
        <button type="button" className="gift-open-btn">
          Open Gift 🎁
        </button>
      </div>

      {/* Floor reflection effect */}
      <div className="card-reflection" />
    </motion.div>
  );
}
