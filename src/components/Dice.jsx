import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DOT_POSITIONS = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
};

export default function Dice({ value, rolling, onRoll, disabled, playerColor }) {
  const [displayValue, setDisplayValue] = useState(value || 1);

  useEffect(() => {
    if (rolling) {
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 80);
      return () => clearInterval(interval);
    } else if (value) {
      setDisplayValue(value);
    }
  }, [rolling, value]);

  const dots = DOT_POSITIONS[displayValue] || DOT_POSITIONS[1];
  const glowColor = playerColor || 'rgba(255,255,255,0.3)';

  return (
    <motion.button
      className="dice-container"
      onClick={onRoll}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.08 } : {}}
      whileTap={!disabled ? { scale: 0.92 } : {}}
      style={{
        '--glow-color': glowColor,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={rolling ? 'rolling' : displayValue}
          className="dice-face"
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg viewBox="0 0 100 100" className="dice-svg">
            {dots.map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="10"
                fill="currentColor"
              />
            ))}
          </svg>
        </motion.div>
      </AnimatePresence>
      {!disabled && !rolling && (
        <div className="dice-hint">Click to roll</div>
      )}
    </motion.button>
  );
}
