import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeddyBear from '../components/TeddyBear';
import HeartBurst from '../components/HeartBurst';
import { CONFIG } from '../data/config';

const CORRECT_PASSCODE = CONFIG.passcode; // default: "1905"

// Scene transitions
const sceneVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5, ease: 'easeIn' } },
};

export default function LockScreen({ onUnlock }) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [status, setStatus] = useState('idle'); // idle | wrong | correct

  // Custom states for wrong-password cinematic scene
  const [showWrongPasswordScene, setShowWrongPasswordScene] = useState(false);
  const [wrongPasswordMessage, setWrongPasswordMessage] = useState('');
  const [isLockScreenBlurred, setIsLockScreenBlurred] = useState(false);

  const [heartBurst, setHeartBurst] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Focus helper
  const focusFirst = () => {
    setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 100);
  };

  // Focus first input on load
  useEffect(() => {
    focusFirst();
  }, []);

  // Keyboard Escape listener to dismiss wrong password overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showWrongPasswordScene) {
        closeWrongPasswordScene();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWrongPasswordScene]);

  const handleInput = (idx, value) => {
    const v = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = v;
    setDigits(next);

    // Focus next box
    if (v && idx < 3) {
      setTimeout(() => inputRefs[idx + 1].current?.focus(), 0);
    }

    // Auto evaluate when 4th digit entered
    if (v && idx === 3) {
      const code = [...next.slice(0, 3), v].join('');
      setTimeout(() => evaluate(code, [...next.slice(0, 3), v]), 100);
    }
  };

  const handleKeyDownInput = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const next = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);

    if (pasted.length === 4) {
      setTimeout(() => evaluate(pasted, next), 100);
    } else {
      inputRefs[Math.min(pasted.length, 3)].current?.focus();
    }
  };

  const evaluate = (code, digitArr) => {
    if (code === CORRECT_PASSCODE) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const handleWrong = () => {
    setStatus('wrong');
    setIsLockScreenBlurred(true);
    setWrongPasswordMessage('Aiyo! Incorrect Password 😝\nTry again, cutie! ❤️');

    // Smooth delay before centering teddy and blurring card
    setTimeout(() => {
      setShowWrongPasswordScene(true);
    }, 150);
  };

  const closeWrongPasswordScene = () => {
    setShowWrongPasswordScene(false);
    setIsLockScreenBlurred(false);
    setStatus('idle');
    setDigits(['', '', '', '']);
    focusFirst();
  };

  const handleCorrect = () => {
    setStatus('correct');
    setHeartBurst(true);
    setTimeout(() => {
      onUnlock();
    }, 2000);
  };

  const handleUnlockBtn = () => {
    const code = digits.join('');
    if (code.length < 4) {
      setStatus('wrong');
      setTimeout(() => setStatus('idle'), 600);
      return;
    }
    evaluate(code, digits);
  };

  // Background stars
  const bgStars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 1,
    delay: Math.random() * 3,
    dur: Math.random() * 2.5 + 1.5,
  }));

  return (
    <motion.div
      className="scene bg-lock"
      variants={sceneVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Background stars */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {bgStars.map(s => (
          <motion.circle
            key={s.id}
            cx={`${s.x}%`} cy={`${s.y}%`} r={s.size}
            fill="white" opacity={0.15}
            animate={{ opacity: [0.05, 0.6, 0.05], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: s.dur, delay: s.delay }}
          />
        ))}
      </svg>

      {/* Decorative Orbs / Cinematic Lights */}
      <div className="bg-light-beam" />
      <div className="bg-orb pink-orb" />
      <div className="bg-orb purple-orb" />

      {/* Main Lock Screen Card Wrapper */}
      <motion.div
        className={`lock-card-container ${isLockScreenBlurred ? 'blurred-main-content' : ''}`}
        animate={status === 'wrong' && !showWrongPasswordScene ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Left Side: Photo Frame Section */}
        <div className="lock-photo-section">
          {/* Blurred romantic background spotlights behind photo */}
          <div className="lock-photo-bg" />
          
          {/* Faint heart-shaped glow in background */}
          <svg className="lock-heart-glow" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>

          <div className="lock-photo-frame-wrap">
            {/* Elegant premium floating elements (hearts, petals, sparkles) */}
            {/* Sparkles */}
            {[[12, 18], [88, 25], [15, 82], [85, 78]].map(([lx, ty], i) => (
              <motion.div
                key={`spark-${i}`}
                style={{ position: 'absolute', left: `${lx}%`, top: `${ty}%`, zIndex: 10, pointerEvents: 'none' }}
                animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0], rotate: [0, 180, 360] }}
                transition={{ repeat: Infinity, duration: 2.2 + i * 0.4, delay: i * 0.3 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" fill="#ffd166" />
                </svg>
              </motion.div>
            ))}

            {/* Glowing Hearts */}
            {[[8, 48], [92, 50]].map(([lx, ty], i) => (
              <motion.div
                key={`heart-${i}`}
                style={{ position: 'absolute', left: `${lx}%`, top: `${ty}%`, zIndex: 10, pointerEvents: 'none' }}
                animate={{ y: [0, -14, 0], opacity: [0.3, 0.9, 0.3], scale: [0.9, 1.1, 0.9] }}
                transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.6, ease: 'easeInOut' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#ff4d6d" opacity="0.8">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </motion.div>
            ))}

            {/* Falling Rose Petals */}
            {[[25, -12], [70, -10]].map(([lx, ty], i) => (
              <motion.div
                key={`petal-${i}`}
                style={{ position: 'absolute', left: `${lx}%`, top: `${ty}%`, zIndex: 10, pointerEvents: 'none' }}
                animate={{ 
                  y: [0, 360], 
                  x: [0, (i === 0 ? 30 : -30)], 
                  rotate: [0, 360],
                  opacity: [0, 0.8, 0] 
                }}
                transition={{ repeat: Infinity, duration: 4.5 + i, delay: i * 1.5, ease: 'linear' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff9eb5" opacity="0.85">
                  <path d="M12 2 C18 2 22 6 22 12 C22 18 16 22 12 22 C6 22 2 18 2 12 C2 6 6 2 12 2 Z" />
                </svg>
              </motion.div>
            ))}

            {/* Double-layer Tilted Polaroid Photo Card */}
            <div className="lock-photo-card">
              <div className="lock-photo-frame">
                {/* Responsive photo overlay & image */}
                <img src="/images/romantic img.jpg" alt="My Favorite Person" />
                <div className="lock-photo-overlay" />
              </div>
            </div>

            {/* Soft reflection below */}
            <div className="lock-photo-reflection" />
          </div>

          {/* Caption Container with gold glowing underline & rose icon */}
          <div className="lock-caption-container">
            <div className="lock-photo-caption">My Favorite Person ❤️</div>
            <div className="lock-photo-underline" />
          </div>
        </div>

        {/* Soft glowing vertical divider */}
        <div className="lock-divider" />

        {/* Right Side: Passcode input section */}
        <div className="lock-passcode-section">
          {/* Heart Lock Icon */}
          <motion.div
            className="heart-lock-icon"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21 C12 21 3 13.5 3 7.5 C3 4.5 5.5 2 8.5 2 C10.5 2 12 4.5 12 4.5 C12 4.5 13.5 2 15.5 2 C18.5 2 21 4.5 21 7.5 C21 13.5 12 21 12 21Z" fill="#ff4d6d" stroke="#ff4d6d" />
              <rect x="9" y="8" width="6" height="5" rx="1" fill="#fff" />
              <path d="M10 8 V6 A2 2 0 0 1 14 6 V8" stroke="#fff" strokeWidth="1.5" />
            </svg>
          </motion.div>

          <h1 className="lock-heading">
            A Little Surprise Is Waiting For You 💖
          </h1>

          <p className="lock-subtitle">
            Enter the secret 4-digit passcode to unlock your birthday surprise.
          </p>

          {/* OTP boxes */}
          <div className="otp-wrapper" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                className={`otp-box ${status === 'wrong' && !showWrongPasswordScene ? 'shake' : ''} ${status === 'correct' ? 'success-glow' : ''}`}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={d}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDownInput(i, e)}
                autoComplete="off"
              />
            ))}
          </div>

          {/* Unlock Button */}
          <motion.button
            type="button"
            className="btn-primary unlock-btn pulse-glow"
            onClick={handleUnlockBtn}
            disabled={status === 'correct' || showWrongPasswordScene}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Unlock My Surprise 🎁</span>
          </motion.button>

          <p className="lock-hint">
            Hint: It's our favorite number 🤫
          </p>
        </div>
      </motion.div>

      {/* Normal corner teddy bear (hidden during cinematic wrong password scene) */}
      {!showWrongPasswordScene && (
        <TeddyBear
          mood={status === 'correct' ? 'excited' : 'playful'}
          position={{ bottom: 20, right: 24 }}
          size={100}
          showBubble={status === 'correct'}
          speechText="Yay! Ready when you are! 🥰"
        />
      )}

      {/* ── WRONG PASSWORD POPUP OVERLAY (Cinematic Teddy Bear Error Scene) ── */}
      <AnimatePresence>
        {showWrongPasswordScene && (
          <motion.div
            className="wrong-password-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWrongPasswordScene}
          >
            {/* Spotlight behind teddy */}
            <div className="spotlight-glow" />

            <motion.div
              className="center-teddy-container"
              initial={{ y: 150, scale: 0.8, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 150, scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Teddy Bear SVG centered and large */}
              <TeddyBear
                mood="playful"
                size={280}
                style={{ position: 'relative', bottom: 'auto', right: 'auto' }}
                speechText={wrongPasswordMessage}
                showBubble={true}
              />

              {/* Broken Hearts & Tears background decorative flow */}
              <div className="broken-heart-particles">
                {['💔', '💧', '✨', '💧', '💔'].map((e, idx) => (
                  <motion.span
                    key={idx}
                    className="error-particle"
                    animate={{
                      y: [-10, -80],
                      x: [0, (idx - 2) * 30],
                      opacity: [0, 1, 0],
                      scale: [0.6, 1.2, 0.6]
                    }}
                    transition={{
                      duration: 1.6 + idx * 0.2,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>

              {/* Retry button */}
              <motion.button
                type="button"
                className="btn-primary retry-btn"
                onClick={closeWrongPasswordScene}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Okay, I'll Try Again"
              >
                Okay, I'll Try Again 💕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart Burst Canvas Overlay */}
      <HeartBurst active={heartBurst} onDone={() => setHeartBurst(false)} />
    </motion.div>
  );
}
