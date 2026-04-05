import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LudoBoard from './components/LudoBoard';
import Dice from './components/Dice';
import PlayerPanel from './components/PlayerPanel';
import { PLAYER_COLORS } from './game/constants';
import {
  createInitialState,
  rollDice,
  moveToken,
  advanceTurn,
  getMovableTokens,
} from './game/engine';

export default function App() {
  const [gameState, setGameState] = useState(createInitialState);
  const [diceRolling, setDiceRolling] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const autoAdvanceRef = useRef(null);

  const { players, currentPlayer, dice, message, winner, mustMove } = gameState;
  const currentColor = PLAYER_COLORS[currentPlayer];
  const movableTokens = getMovableTokens(gameState);

  // Auto-advance turn when no moves available
  useEffect(() => {
    if (gameState.autoAdvance) {
      autoAdvanceRef.current = setTimeout(() => {
        setGameState((prev) => advanceTurn(prev));
      }, 1200);
      return () => clearTimeout(autoAdvanceRef.current);
    }
  }, [gameState.autoAdvance]);

  const handleRoll = useCallback(() => {
    if (dice !== null || winner || diceRolling) return;

    setDiceRolling(true);
    setTimeout(() => {
      setDiceRolling(false);
      setGameState((prev) => rollDice(prev));
    }, 600);
  }, [dice, winner, diceRolling]);

  const handleTokenClick = useCallback(
    (tokenId) => {
      if (!mustMove || winner) return;
      setGameState((prev) => moveToken(prev, tokenId));
    },
    [mustMove, winner]
  );

  const handleReset = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  if (showSplash) {
    return (
      <div className="splash-screen">
        <motion.div
          className="splash-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="splash-logo">
            <div className="splash-dice">
              <div className="splash-dice-dot" />
              <div className="splash-dice-dot" />
              <div className="splash-dice-dot" />
              <div className="splash-dice-dot" />
            </div>
          </div>
          <h1 className="splash-title">LUDO</h1>
          <p className="splash-subtitle">The Classic Board Game</p>
          <motion.button
            className="splash-play-btn"
            onClick={() => setShowSplash(false)}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            Play Now
          </motion.button>
          <div className="splash-colors">
            {PLAYER_COLORS.map((c) => (
              <motion.div
                key={c.id}
                className="splash-color-dot"
                style={{ backgroundColor: c.bg }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: PLAYER_COLORS.indexOf(c) * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Header */}
      <header className="game-header">
        <h1 className="game-title">
          <span className="game-title-icon">🎲</span>
          LUDO
        </h1>
        <button className="reset-btn" onClick={handleReset}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          New Game
        </button>
      </header>

      {/* Main Layout */}
      <div className="game-layout">
        {/* Left: Player Panel */}
        <aside className="game-sidebar">
          <PlayerPanel
            players={players}
            currentPlayer={currentPlayer}
            winner={winner}
          />
        </aside>

        {/* Center: Board */}
        <main className="game-main">
          <LudoBoard
            players={players}
            movableTokens={movableTokens}
            onTokenClick={handleTokenClick}
            currentPlayer={currentPlayer}
          />
        </main>

        {/* Right: Controls */}
        <aside className="game-controls">
          {/* Dice */}
          <div className="controls-section">
            <div className="controls-label">
              <span
                className="controls-dot"
                style={{ backgroundColor: currentColor.bg }}
              />
              {currentColor.name}'s Turn
            </div>
            <Dice
              value={dice}
              rolling={diceRolling}
              onRoll={handleRoll}
              disabled={dice !== null || !!winner}
              playerColor={currentColor.glow}
            />
          </div>

          {/* Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={message}
              className="game-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {message}
            </motion.div>
          </AnimatePresence>

          {/* Winner Overlay */}
          <AnimatePresence>
            {winner && (
              <motion.div
                className="winner-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ '--winner-color': PLAYER_COLORS[players.indexOf(winner)]?.bg }}
              >
                <div className="winner-trophy">🏆</div>
                <h2 className="winner-title">{winner.name} Wins!</h2>
                <p className="winner-sub">All tokens reached home</p>
                <button className="winner-replay-btn" onClick={handleReset}>
                  Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rules */}
          <div className="rules-card">
            <h3 className="rules-title">How to Play</h3>
            <ul className="rules-list">
              <li>Roll <strong>6</strong> to move a token out of home</li>
              <li>Land on an opponent to capture & send them home</li>
              <li>Roll 6 or capture = extra turn</li>
              <li>Three 6s in a row = turn forfeited</li>
              <li>First to get all 4 tokens home wins!</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
