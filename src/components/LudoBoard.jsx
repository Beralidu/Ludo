import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BOARD_SIZE,
  MAIN_TRACK,
  HOME_PATHS,
  HOME_BASES,
  CENTER,
  PLAYER_COLORS,
  SAFE_POSITIONS_GLOBAL,
  PLAYER_START,
} from '../game/constants';

// Determine which "zone" a cell belongs to
function getCellZone(row, col) {
  // Home bases
  if (row >= 0 && row <= 5 && col >= 0 && col <= 5) return 0; // Red
  if (row >= 0 && row <= 5 && col >= 9 && col <= 14) return 1; // Green
  if (row >= 9 && row <= 14 && col >= 9 && col <= 14) return 2; // Yellow
  if (row >= 9 && row <= 14 && col >= 0 && col <= 5) return 3; // Blue
  // Center
  if (row >= 6 && row <= 8 && col >= 6 && col <= 8) return 'center';
  // Track cells
  return 'track';
}

// Check if a cell is on the main track
function getTrackIndex(row, col) {
  for (let i = 0; i < MAIN_TRACK.length; i++) {
    if (MAIN_TRACK[i][0] === row && MAIN_TRACK[i][1] === col) return i;
  }
  return -1;
}

// Check if a cell is on any home path
function getHomePathInfo(row, col) {
  for (let p = 0; p < HOME_PATHS.length; p++) {
    for (let i = 0; i < HOME_PATHS[p].length; i++) {
      if (HOME_PATHS[p][i][0] === row && HOME_PATHS[p][i][1] === col) {
        return { playerIndex: p, position: i };
      }
    }
  }
  return null;
}

export default function LudoBoard({ players, movableTokens, onTokenClick, currentPlayer }) {
  // Build a map of all tokens by their visual position
  const tokenMap = useMemo(() => {
    const map = {};

    players.forEach((player, pIndex) => {
      player.tokens.forEach((token, tIndex) => {
        let key = null;

        if (token.state === 'home') {
          // In home base
          const [r, c] = HOME_BASES[pIndex][tIndex];
          key = `home-${pIndex}-${tIndex}`;
          if (!map[key]) map[key] = { tokens: [], row: r, col: c, type: 'home' };
          map[key].tokens.push({ ...token, playerIndex: pIndex, tokenIndex: tIndex });
        } else if (token.state === 'active') {
          // On main track
          const pos = token.mainPos;
          key = `track-${pos}`;
          const [r, c] = MAIN_TRACK[pos];
          if (!map[key]) map[key] = { tokens: [], row: r, col: c, type: 'track' };
          map[key].tokens.push({ ...token, playerIndex: pIndex, tokenIndex: tIndex });
        } else if (token.state === 'homeStretch') {
          // On home path
          const pos = token.homePos;
          key = `homepath-${pIndex}-${pos}`;
          const [r, c] = HOME_PATHS[pIndex][pos];
          if (!map[key]) map[key] = { tokens: [], row: r, col: c, type: 'homePath' };
          map[key].tokens.push({ ...token, playerIndex: pIndex, tokenIndex: tIndex });
        } else if (token.state === 'finished') {
          // In center
          key = `center-${pIndex}`;
          if (!map[key]) map[key] = { tokens: [], row: CENTER[0], col: CENTER[1], type: 'center' };
          map[key].tokens.push({ ...token, playerIndex: pIndex, tokenIndex: tIndex });
        }
      });
    });

    return map;
  }, [players]);

  // Build list of movable token IDs
  const movableIds = useMemo(() => new Set(movableTokens.map((t) => t.id)), [movableTokens]);

  // Render a token piece
  const renderToken = (token, index, total) => {
    const color = PLAYER_COLORS[token.playerIndex];
    const isMovable = movableIds.has(token.id);
    const offset = total > 1 ? (index - (total - 1) / 2) * 22 : 0;

    return (
      <motion.div
        key={token.id}
        className={`token ${isMovable ? 'token--movable' : ''}`}
        style={{
          '--token-color': color.bg,
          '--token-glow': color.glow,
          transform: `translate(${offset}%, ${total > 2 ? (index % 2) * 20 - 10 : 0}%)`,
          zIndex: isMovable ? 10 : 5,
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isMovable) onTokenClick(token.id);
        }}
        layout
        initial={{ scale: 0 }}
        animate={{
          scale: isMovable ? [1, 1.15, 1] : 1,
          transition: isMovable
            ? { scale: { repeat: Infinity, duration: 0.8 } }
            : { duration: 0.3 },
        }}
        whileHover={isMovable ? { scale: 1.3 } : {}}
        whileTap={isMovable ? { scale: 0.9 } : {}}
      >
        <div className="token-inner" />
      </motion.div>
    );
  };

  // Render the 15x15 grid
  const cells = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const zone = getCellZone(row, col);
      const trackIdx = getTrackIndex(row, col);
      const homeInfo = getHomePathInfo(row, col);
      const isCenter = row >= 6 && row <= 8 && col >= 6 && col <= 8;

      let cellClass = 'board-cell';
      let cellStyle = {};
      let cellContent = null;
      let isPlayable = false;

      if (typeof zone === 'number') {
        // Home base zone
        cellClass += ` board-cell--home board-cell--home-${PLAYER_COLORS[zone].id}`;
        cellStyle.backgroundColor = PLAYER_COLORS[zone].home;
      } else if (isCenter) {
        cellClass += ' board-cell--center';
        // Color the center triangles
        if (row === 6 && col === 7) cellStyle.backgroundColor = PLAYER_COLORS[1].bgLight; // Green
        else if (row === 7 && col === 6) cellStyle.backgroundColor = PLAYER_COLORS[0].bgLight; // Red
        else if (row === 7 && col === 8) cellStyle.backgroundColor = PLAYER_COLORS[2].bgLight; // Yellow
        else if (row === 8 && col === 7) cellStyle.backgroundColor = PLAYER_COLORS[3].bgLight; // Blue
        else if (row === 7 && col === 7) {
          cellClass += ' board-cell--center-star';
        } else {
          cellStyle.backgroundColor = '#1e1b3a';
        }
      } else if (trackIdx >= 0) {
        isPlayable = true;
        cellClass += ' board-cell--track';
        const isSafe = SAFE_POSITIONS_GLOBAL.includes(trackIdx);
        const isStart = PLAYER_START.includes(trackIdx);

        if (isSafe) cellClass += ' board-cell--safe';
        if (isStart) {
          const startPlayerIdx = PLAYER_START.indexOf(trackIdx);
          cellClass += ` board-cell--start board-cell--start-${PLAYER_COLORS[startPlayerIdx].id}`;
          cellStyle.backgroundColor = PLAYER_COLORS[startPlayerIdx].bgLight;
        }
      } else if (homeInfo) {
        isPlayable = true;
        cellClass += ` board-cell--homepath board-cell--homepath-${PLAYER_COLORS[homeInfo.playerIndex].id}`;
        cellStyle.backgroundColor = PLAYER_COLORS[homeInfo.playerIndex].bgMid;
      } else {
        // Empty cell (not part of the board)
        cellClass += ' board-cell--empty';
      }

      // Find tokens on this cell
      let tokensHere = [];
      if (trackIdx >= 0) {
        const entry = tokenMap[`track-${trackIdx}`];
        if (entry) tokensHere = entry.tokens;
      }
      if (homeInfo) {
        const entry = tokenMap[`homepath-${homeInfo.playerIndex}-${homeInfo.position}`];
        if (entry) tokensHere = entry.tokens;
      }
      if (isCenter && row === 7 && col === 7) {
        // Show finished tokens in center
        PLAYER_COLORS.forEach((_, pIdx) => {
          const entry = tokenMap[`center-${pIdx}`];
          if (entry) tokensHere = [...tokensHere, ...entry.tokens];
        });
      }

      cellContent = tokensHere.length > 0 && (
        <div className="token-stack">
          {tokensHere.map((t, i) => renderToken(t, i, tokensHere.length))}
        </div>
      );

      cells.push(
        <div
          key={`${row}-${col}`}
          className={cellClass}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
            ...cellStyle,
          }}
        >
          {cellContent}
        </div>
      );
    }
  }

  // Render home base decorations (the circular areas in corners)
  const homeDecorations = HOME_BASES.map((bases, pIndex) => {
    const color = PLAYER_COLORS[pIndex];
    return bases.map((pos, tIndex) => {
      const entry = tokenMap[`home-${pIndex}-${tIndex}`];
      const tokens = entry ? entry.tokens : [];

      return (
        <div
          key={`homebase-${pIndex}-${tIndex}`}
          className="home-spot"
          style={{
            gridRow: `${Math.floor(pos[0]) + 1} / span 1`,
            gridColumn: `${Math.floor(pos[1]) + 1} / span 1`,
            '--spot-color': color.bg,
          }}
        >
          <div className="home-spot-ring" />
          {tokens.map((t, i) => renderToken(t, i, tokens.length))}
        </div>
      );
    });
  });

  return (
    <div className="ludo-board-wrapper">
      <div className="ludo-board">
        {cells}
        {homeDecorations}
      </div>
    </div>
  );
}
