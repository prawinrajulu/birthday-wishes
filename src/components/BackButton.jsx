import React from 'react';
import { motion } from 'framer-motion';

/**
 * BackButton — fixed bottom-center button to return to gift selection.
 * Props:
 *   onClick  function
 *   label    string (optional)
 */
export default function BackButton({ onClick, label = '← Back to Gifts' }) {
  return (
    <motion.div
      className="back-btn"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <button className="btn-secondary" onClick={onClick}>
        {label}
      </button>
    </motion.div>
  );
}
