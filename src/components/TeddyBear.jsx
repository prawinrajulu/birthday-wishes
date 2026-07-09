import React from 'react';
import { motion } from 'framer-motion';

/**
 * TeddyBear — Reusable animated SVG teddy bear component.
 *
 * Props:
 *   mood         'playful' | 'excited' | 'nostalgic' | 'celebrate' | 'romantic'
 *   position     style object (e.g., { bottom: 20, right: 24 }) — all in px
 *   speechText   string | null — if provided, shows speech bubble
 *   showBubble   boolean — controls bubble visibility
 *   size         number (default 100) — width/height in px
 *   style        extra inline styles on the wrapper
 */
export default function TeddyBear({
  mood = 'playful',
  position = {},
  speechText = null,
  showBubble = false,
  size = 100,
  style = {},
}) {
  // Map moods to CSS animation class
  const moodClass = {
    playful:   'teddy-playful',
    excited:   'teddy-excited',
    nostalgic: 'teddy-nostalgic',
    celebrate: 'teddy-celebrate',
    romantic:  'teddy-romantic',
  }[mood] || 'teddy-playful';

  // Framer-motion wrapper animation variants
  const wrapVariants = {
    hidden:  { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } },
  };

  // Party hat (for celebrate mood)
  const hat = mood === 'celebrate';
  // Rose (for romantic mood)
  const rose = mood === 'romantic';

  return (
    <motion.div
      className="teddy-wrap"
      style={{ ...position, ...style, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5 }}
      variants={wrapVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Speech bubble */}
      {showBubble && speechText && (
        <motion.div
          className="speech-bubble"
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7 }}
          style={{ bottom: 'calc(100% + 14px)', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
        >
          {speechText}
        </motion.div>
      )}

      {/* SVG Teddy */}
      <svg
        className={`teddy-svg ${moodClass}`}
        width={size}
        height={size}
        viewBox="0 0 120 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Party hat */}
        {hat && (
          <g transform="translate(38,-10)">
            <polygon points="22,0 0,36 44,36" fill="#ff4d6d" />
            <polygon points="22,0 0,36 44,36" fill="url(#hatStripe)" />
            <circle cx="22" cy="0" r="4" fill="#ffd700" />
            <line x1="0" y1="36" x2="44" y2="36" stroke="#ffd700" strokeWidth="3" />
            <defs>
              <pattern id="hatStripe" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <rect width="4" height="8" fill="rgba(255,255,255,0.2)" />
              </pattern>
            </defs>
          </g>
        )}

        {/* Ears */}
        <circle cx="25" cy="28" r="16" fill="#c8a07e" />
        <circle cx="25" cy="28" r="10" fill="#e8c5a0" />
        <circle cx="95" cy="28" r="16" fill="#c8a07e" />
        <circle cx="95" cy="28" r="10" fill="#e8c5a0" />

        {/* Head */}
        <ellipse cx="60" cy="46" rx="38" ry="36" fill="#d4a574" />

        {/* Face */}
        <ellipse cx="60" cy="56" rx="22" ry="16" fill="#e8c5a0" />

        {/* Eyes */}
        <circle cx="47" cy="40" r="6" fill="#2c1810" />
        <circle cx="73" cy="40" r="6" fill="#2c1810" />
        <circle cx="49" cy="38" r="2" fill="white" />
        <circle cx="75" cy="38" r="2" fill="white" />

        {/* Nose */}
        <ellipse cx="60" cy="51" rx="5" ry="3.5" fill="#8b5e3c" />

        {/* Mouth — changes by mood */}
        {(mood === 'playful' || mood === 'excited') && (
          <path d="M 50 59 Q 60 68 70 59" stroke="#8b5e3c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {mood === 'nostalgic' && (
          <path d="M 50 62 Q 60 68 70 62" stroke="#8b5e3c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {mood === 'celebrate' && (
          <>
            <path d="M 48 58 Q 60 72 72 58" stroke="#8b5e3c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="60" cy="66" rx="7" ry="5" fill="#ff7eb3" opacity="0.4" />
          </>
        )}
        {mood === 'romantic' && (
          <path d="M 50 60 Q 60 70 70 60" stroke="#8b5e3c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* Cheek blush */}
        <circle cx="38" cy="50" r="8" fill="#ffb6c1" opacity="0.5" />
        <circle cx="82" cy="50" r="8" fill="#ffb6c1" opacity="0.5" />

        {/* Body */}
        <ellipse cx="60" cy="100" rx="32" ry="30" fill="#c8a07e" />

        {/* Tummy */}
        <ellipse cx="60" cy="104" rx="20" ry="18" fill="#e8c5a0" />

        {/* Belly heart */}
        <path
          d="M60 103 C60 103 54 97 50 100 C46 103 48 110 60 116 C72 110 74 103 70 100 C66 97 60 103 60 103Z"
          fill="#ff7eb3"
          opacity="0.7"
        />

        {/* Arms */}
        {/* Left arm — waves when excited */}
        <motion.g
          animate={
            mood === 'excited'
              ? { rotate: [0, -25, 0, -20, 0], originX: '30px', originY: '82px' }
              : mood === 'celebrate'
              ? { rotate: [0, -30, 0], originX: '30px', originY: '82px' }
              : {}
          }
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <ellipse cx="28" cy="94" rx="14" ry="10" fill="#c8a07e" transform="rotate(-30 28 94)" />
          <circle cx="18" cy="102" r="9" fill="#c8a07e" />
        </motion.g>

        {/* Right arm */}
        <motion.g
          animate={
            mood === 'celebrate'
              ? { rotate: [0, 30, 0], originX: '92px', originY: '82px' }
              : {}
          }
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }}
        >
          <ellipse cx="92" cy="94" rx="14" ry="10" fill="#c8a07e" transform="rotate(30 92 94)" />
          <circle cx="102" cy="102" r="9" fill="#c8a07e" />
        </motion.g>

        {/* Rose held in right paw (romantic) */}
        {rose && (
          <g transform="translate(102,96)">
            <rect x="-2" y="0" width="4" height="18" fill="#2d7a2d" rx="2" />
            <circle cx="0" cy="0" r="7" fill="#e91e8c" />
            <circle cx="-3" cy="-2" r="4" fill="#ff7eb3" />
            <circle cx="3" cy="-1" r="3.5" fill="#c2185b" />
          </g>
        )}

        {/* Legs */}
        <ellipse cx="46" cy="124" rx="12" ry="9" fill="#c8a07e" />
        <ellipse cx="74" cy="124" rx="12" ry="9" fill="#c8a07e" />
        <circle cx="44" cy="130" r="8" fill="#a07050" />
        <circle cx="76" cy="130" r="8" fill="#a07050" />

        {/* Pointing arm (nostalgic) */}
        {mood === 'nostalgic' && (
          <motion.g
            animate={{ rotate: [0, -10, 0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ originX: '28px', originY: '94px' }}
          >
            <line x1="16" y1="100" x2="-10" y2="80" stroke="#c8a07e" strokeWidth="8" strokeLinecap="round" />
          </motion.g>
        )}

        {/* Tears (playful error) */}
        {mood === 'playful' && (
          <>
            <motion.ellipse
              cx="40" cy="54"
              rx="2" ry="3"
              fill="#87ceeb"
              animate={{ y: [0, 8, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
            />
            <motion.ellipse
              cx="80" cy="54"
              rx="2" ry="3"
              fill="#87ceeb"
              animate={{ y: [0, 8, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}
