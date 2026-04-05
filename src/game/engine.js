import {
  TOKENS_PER_PLAYER,
  PATH_LENGTH,
  PLAYER_START,
  HOME_ENTRY,
  HOME_STRETCH_LENGTH,
  SAFE_POSITIONS_GLOBAL,
  PLAYER_COLORS,
} from './constants';

// ─── Create initial game state ──────────────────────────────────
export function createInitialState() {
  const players = PLAYER_COLORS.map((color, index) => ({
    ...color,
    index,
    finished: 0,
    tokens: Array.from({ length: TOKENS_PER_PLAYER }, (_, i) => ({
      id: `${color.id}-${i}`,
      state: 'home', // 'home' | 'active' | 'homeStretch' | 'finished'
      mainPos: -1, // Position on the 52-cell main track (-1 = not on track)
      homePos: -1, // Position on the home stretch (0-4, -1 = not on home stretch)
    })),
  }));

  return {
    players,
    currentPlayer: 0,
    dice: null,
    diceRolling: false,
    message: 'Roll the dice to begin!',
    winner: null,
    mustMove: false,
    consecutiveSixes: 0,
    moveHistory: [],
  };
}

// ─── Convert player-relative steps to global main track position ─
export function toGlobalPos(playerIndex, localSteps) {
  return (PLAYER_START[playerIndex] + localSteps) % PATH_LENGTH;
}

// ─── Check if a global position is safe ─────────────────────────
export function isSafePosition(globalPos) {
  return SAFE_POSITIONS_GLOBAL.includes(globalPos);
}

// ─── Get all tokens on a given global position ──────────────────
export function getTokensAtPosition(players, globalPos, excludePlayerIndex = -1) {
  const tokens = [];
  players.forEach((player, pIndex) => {
    if (pIndex === excludePlayerIndex) return;
    player.tokens.forEach((token) => {
      if (token.state === 'active' && token.mainPos === globalPos) {
        tokens.push({ ...token, playerIndex: pIndex });
      }
    });
  });
  return tokens;
}

// ─── Get movable tokens for current player ──────────────────────
export function getMovableTokens(state) {
  const { players, currentPlayer, dice, winner } = state;
  if (dice == null || winner) return [];

  const player = players[currentPlayer];
  const movable = [];

  player.tokens.forEach((token) => {
    if (token.state === 'finished') return;

    if (token.state === 'home') {
      // Need a 6 to leave home
      if (dice === 6) movable.push(token);
      return;
    }

    if (token.state === 'homeStretch') {
      // Can move forward in home stretch if within bounds
      const newHomePos = token.homePos + dice;
      if (newHomePos <= HOME_STRETCH_LENGTH) {
        movable.push(token);
      }
      return;
    }

    if (token.state === 'active') {
      // Calculate how many steps from start
      const startPos = PLAYER_START[currentPlayer];
      let localSteps = (token.mainPos - startPos + PATH_LENGTH) % PATH_LENGTH;
      const newLocalSteps = localSteps + dice;

      // Check if entering home stretch
      const entryPos = HOME_ENTRY[currentPlayer];
      const entryLocal = (entryPos - startPos + PATH_LENGTH) % PATH_LENGTH;

      if (localSteps <= entryLocal && newLocalSteps > entryLocal) {
        // Token is passing the home entry point
        const stepsIntoHome = newLocalSteps - entryLocal - 1;
        if (stepsIntoHome <= HOME_STRETCH_LENGTH) {
          movable.push(token);
        }
      } else if (newLocalSteps < PATH_LENGTH) {
        // Normal move on main track
        movable.push(token);
      }
      return;
    }
  });

  return movable;
}

// ─── Roll the dice ──────────────────────────────────────────────
export function rollDice(state) {
  if (state.dice !== null || state.winner) return state;

  const value = Math.floor(Math.random() * 6) + 1;
  const newState = { ...state, dice: value, diceRolling: false };

  const movable = getMovableTokens({ ...newState });

  if (movable.length === 0) {
    const player = state.players[state.currentPlayer];
    newState.message = `${player.name} rolled ${value}. No valid moves!`;
    newState.mustMove = false;
    newState.consecutiveSixes = 0;
    // Auto-advance turn
    newState.autoAdvance = true;
  } else {
    const player = state.players[state.currentPlayer];
    newState.message = `${player.name} rolled ${value}. Pick a token!`;
    newState.mustMove = true;
  }

  return newState;
}

// ─── Move a token ───────────────────────────────────────────────
export function moveToken(state, tokenId) {
  if (!state.mustMove || state.winner || state.dice == null) return state;

  const { currentPlayer, dice } = state;
  const movable = getMovableTokens(state);
  if (!movable.find((t) => t.id === tokenId)) return state;

  // Deep clone players
  const players = state.players.map((p) => ({
    ...p,
    tokens: p.tokens.map((t) => ({ ...t })),
  }));

  const player = players[currentPlayer];
  const token = player.tokens.find((t) => t.id === tokenId);
  let extraTurn = dice === 6;
  let captured = false;
  let finished = false;
  let msg = '';

  if (token.state === 'home') {
    // Move to start position
    token.state = 'active';
    token.mainPos = PLAYER_START[currentPlayer];
    msg = `${player.name} moved a token out!`;

    // Check for capture at start position
    const victims = getTokensAtPosition(players, token.mainPos, currentPlayer);
    if (victims.length > 0 && !isSafePosition(token.mainPos)) {
      victims.forEach((v) => {
        const victimToken = players[v.playerIndex].tokens.find((t) => t.id === v.id);
        victimToken.state = 'home';
        victimToken.mainPos = -1;
      });
      captured = true;
      msg = `${player.name} captured ${players[victims[0].playerIndex].name}'s token!`;
    }
  } else if (token.state === 'homeStretch') {
    const newHomePos = token.homePos + dice;
    if (newHomePos === HOME_STRETCH_LENGTH) {
      token.state = 'finished';
      token.homePos = HOME_STRETCH_LENGTH;
      player.finished += 1;
      finished = true;
      msg = `${player.name} scored a token home! 🎉`;
    } else {
      token.homePos = newHomePos;
      msg = `${player.name} moved in home stretch.`;
    }
  } else if (token.state === 'active') {
    const startPos = PLAYER_START[currentPlayer];
    let localSteps = (token.mainPos - startPos + PATH_LENGTH) % PATH_LENGTH;
    const newLocalSteps = localSteps + dice;

    const entryPos = HOME_ENTRY[currentPlayer];
    const entryLocal = (entryPos - startPos + PATH_LENGTH) % PATH_LENGTH;

    if (localSteps <= entryLocal && newLocalSteps > entryLocal) {
      // Entering home stretch
      const stepsIntoHome = newLocalSteps - entryLocal - 1;
      token.state = 'homeStretch';
      token.mainPos = -1;

      if (stepsIntoHome === HOME_STRETCH_LENGTH) {
        token.state = 'finished';
        token.homePos = HOME_STRETCH_LENGTH;
        player.finished += 1;
        finished = true;
        msg = `${player.name} scored a token home! 🎉`;
      } else {
        token.homePos = stepsIntoHome;
        msg = `${player.name} entered home stretch!`;
      }
    } else {
      // Normal move
      const newGlobalPos = toGlobalPos(currentPlayer, newLocalSteps);
      token.mainPos = newGlobalPos;
      msg = `${player.name} moved ${dice} step${dice > 1 ? 's' : ''}.`;

      // Check capture
      const victims = getTokensAtPosition(players, newGlobalPos, currentPlayer);
      if (victims.length > 0 && !isSafePosition(newGlobalPos)) {
        victims.forEach((v) => {
          const victimToken = players[v.playerIndex].tokens.find((t) => t.id === v.id);
          victimToken.state = 'home';
          victimToken.mainPos = -1;
        });
        captured = true;
        extraTurn = true;
        msg = `${player.name} captured ${players[victims[0].playerIndex].name}'s token!`;
      }
    }
  }

  // Check win
  const hasWon = player.finished === TOKENS_PER_PLAYER;

  // Handle consecutive sixes
  let consecutiveSixes = dice === 6 ? state.consecutiveSixes + 1 : 0;
  if (consecutiveSixes >= 3) {
    // Three sixes in a row — lose turn
    msg = `${player.name} rolled three 6s! Turn forfeited.`;
    extraTurn = false;
    consecutiveSixes = 0;
  }

  if (captured) extraTurn = true;
  if (finished) extraTurn = true;

  const newState = {
    ...state,
    players,
    dice: null,
    mustMove: false,
    message: msg,
    consecutiveSixes,
    moveHistory: [...state.moveHistory, { player: currentPlayer, tokenId, dice }],
  };

  if (hasWon) {
    newState.winner = player;
    newState.message = `🏆 ${player.name} wins the game!`;
    return newState;
  }

  if (!extraTurn) {
    newState.currentPlayer = (currentPlayer + 1) % players.length;
    newState.consecutiveSixes = 0;
  }

  return newState;
}

// ─── Advance turn (when no moves available) ─────────────────────
export function advanceTurn(state) {
  return {
    ...state,
    dice: null,
    mustMove: false,
    autoAdvance: false,
    consecutiveSixes: 0,
    currentPlayer: (state.currentPlayer + 1) % state.players.length,
  };
}

// ─── Reset game ─────────────────────────────────────────────────
export function resetGame() {
  return createInitialState();
}
