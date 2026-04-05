import React from 'react';
import { motion } from 'framer-motion';
import { PLAYER_COLORS, TOKENS_PER_PLAYER } from '../game/constants';

export default function PlayerPanel({ players, currentPlayer, winner }) {
  return (
    <div className="player-panel">
      {players.map((player, idx) => {
        const color = PLAYER_COLORS[idx];
        const isActive = idx === currentPlayer && !winner;
        const isWinner = winner && winner.id === player.id;

        return (
          <motion.div
            key={player.id}
            className={`player-card ${isActive ? 'player-card--active' : ''} ${isWinner ? 'player-card--winner' : ''}`}
            style={{
              '--player-color': color.bg,
              '--player-glow': color.glow,
              '--player-light': color.bgLight,
            }}
            animate={isActive ? { borderColor: color.bg } : { borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div className="player-card-header">
              <div className="player-dot" style={{ backgroundColor: color.bg }} />
              <span className="player-name">{player.name}</span>
              {isActive && <span className="player-turn-badge">YOUR TURN</span>}
              {isWinner && <span className="player-winner-badge">🏆 WINNER</span>}
            </div>
            <div className="player-tokens-row">
              {player.tokens.map((token, tIdx) => (
                <div
                  key={token.id}
                  className={`player-token-indicator ${token.state}`}
                  style={{ '--token-color': color.bg }}
                  title={`Token ${tIdx + 1}: ${token.state}`}
                >
                  <div className="player-token-dot" />
                  <span className="player-token-label">
                    {token.state === 'home' ? '🏠' : token.state === 'finished' ? '⭐' : '🏃'}
                  </span>
                </div>
              ))}
            </div>
            <div className="player-progress">
              <div className="player-progress-bar">
                <motion.div
                  className="player-progress-fill"
                  style={{ backgroundColor: color.bg }}
                  animate={{ width: `${(player.finished / TOKENS_PER_PLAYER) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
              <span className="player-score">{player.finished}/{TOKENS_PER_PLAYER}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
