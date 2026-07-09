import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PhotoModal — full-screen romantic photo popup.
 * Props:
 *   photo   { src, caption, alt } | null
 *   onClose function
 */
export default function PhotoModal({ photo, onClose }) {
  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Decorative floating hearts behind the photo */}
        {['❤️','💕','🌸','✨','💖'].map((e, i) => (
          <motion.span
            key={i}
            style={{
              position: 'absolute',
              fontSize: `${Math.random() * 16 + 14}px`,
              left: `${10 + i * 18}%`,
              top: `${20 + (i % 3) * 20}%`,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            animate={{ y: [0, -16, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.2 }}
          >
            {e}
          </motion.span>
        ))}

        <motion.div
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
          initial={{ scale: 0.5, opacity: 0, y: 60 }}
          animate={{ scale: 1,   opacity: 1, y: 0 }}
          exit={{ scale: 0.5,    opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          <img
            className="modal-photo"
            src={photo.src}
            alt={photo.alt}
            onError={(e) => {
              // Fallback gradient if image not found
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Placeholder shown when image fails */}
          <div style={{
            display: 'none',
            width: 280,
            height: 280,
            background: 'linear-gradient(135deg,#ff7eb3,#9b59b6)',
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            flexDirection: 'column',
            gap: 8,
          }}>
            📸
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter,sans-serif' }}>
              Add your photo here
            </span>
          </div>

          <p className="modal-caption">{photo.caption}</p>
        </motion.div>

        {/* Close button */}
        <button className="modal-close" onClick={onClose} title="Close">
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
