// ─── Player Colors ───────────────────────────────────────────────
export const PLAYER_COLORS = [
  {
    id: 'red',
    name: 'Red',
    bg: '#EF4444',
    bgLight: '#FEE2E2',
    bgMid: '#FCA5A5',
    text: '#991B1B',
    glow: 'rgba(239, 68, 68, 0.5)',
    home: 'rgba(239, 68, 68, 0.15)',
  },
  {
    id: 'green',
    name: 'Green',
    bg: '#22C55E',
    bgLight: '#DCFCE7',
    bgMid: '#86EFAC',
    text: '#166534',
    glow: 'rgba(34, 197, 94, 0.5)',
    home: 'rgba(34, 197, 94, 0.15)',
  },
  {
    id: 'yellow',
    name: 'Yellow',
    bg: '#EAB308',
    bgLight: '#FEF9C3',
    bgMid: '#FDE047',
    text: '#854D0E',
    glow: 'rgba(234, 179, 8, 0.5)',
    home: 'rgba(234, 179, 8, 0.15)',
  },
  {
    id: 'blue',
    name: 'Blue',
    bg: '#3B82F6',
    bgLight: '#DBEAFE',
    bgMid: '#93C5FD',
    text: '#1E40AF',
    glow: 'rgba(59, 130, 246, 0.5)',
    home: 'rgba(59, 130, 246, 0.15)',
  },
];

export const TOKENS_PER_PLAYER = 4;
export const BOARD_SIZE = 15;
export const PATH_LENGTH = 52; // Total cells around the board
export const HOME_STRETCH_LENGTH = 5; // 5 cells in the home column before center

// Safe positions on the main track (0-indexed into each player's path)
// Position 0 (start) and position 8 (star) are safe for each player
export const SAFE_POSITIONS_GLOBAL = [0, 8, 13, 21, 26, 34, 39, 47];

// ─── Board cell coordinates (row, col) for the 52-cell main track ──
// Numbered 0..51 going clockwise starting from Red's start
// The board is 15x15. Rows and cols are 0-indexed.
// Top-left home = Red (rows 0-5, cols 0-5)
// Top-right home = Green (rows 0-5, cols 9-14)
// Bottom-right home = Yellow (rows 9-14, cols 9-14)
// Bottom-left home = Blue (rows 9-14, cols 0-5)

export const MAIN_TRACK = [
  // Red start zone → going up column 6
  [6, 1], // 0  - Red start
  [6, 2], // 1
  [6, 3], // 2
  [6, 4], // 3
  [6, 5], // 4
  // Top cross arm → going right along row 5..0 then col 6→7→8
  [5, 6], // 5
  [4, 6], // 6
  [3, 6], // 7
  [2, 6], // 8  - Safe (star)
  [1, 6], // 9
  [0, 6], // 10
  // Top-right corner → going right
  [0, 7], // 11
  [0, 8], // 12
  // Green start zone → going down column 8
  [1, 8], // 13 - Green start
  [2, 8], // 14
  [3, 8], // 15
  [4, 8], // 16
  [5, 8], // 17
  // Right cross arm → going right along col 9..14 then row 6→7→8
  [6, 9], // 18
  [6, 10], // 19
  [6, 11], // 20
  [6, 12], // 21 - Safe (star)
  [6, 13], // 22
  [6, 14], // 23
  // Bottom-right corner → going down
  [7, 14], // 24
  [8, 14], // 25
  // Yellow start zone → going left column 8 (bottom)
  [8, 13], // 26 - Yellow start
  [8, 12], // 27
  [8, 11], // 28
  [8, 10], // 29
  [8, 9], // 30
  // Bottom cross arm → going down along row 9..14 then col 8→7→6
  [9, 8], // 31
  [10, 8], // 32
  [11, 8], // 33
  [12, 8], // 34 - Safe (star)
  [13, 8], // 35
  [14, 8], // 36
  // Bottom-left corner → going left
  [14, 7], // 37
  [14, 6], // 38
  // Blue start zone → going up column 6 (left side)
  [13, 6], // 39 - Blue start
  [12, 6], // 40
  [11, 6], // 41
  [10, 6], // 42
  [9, 6], // 43
  // Left cross arm → going left along col 5..0 then row 8→7→6
  [8, 5], // 44
  [8, 4], // 45
  [8, 3], // 46
  [8, 2], // 47 - Safe (star)
  [8, 1], // 48
  [8, 0], // 49
  // Top-left corner → going up
  [7, 0], // 50
  [6, 0], // 51 (wraps back to 0 area for Red)
];

// Each player's start position on the main track
export const PLAYER_START = [0, 13, 26, 39];

// Home stretch paths (the colored column leading to center)
// 5 cells each, not including the center winning cell
export const HOME_PATHS = [
  // Red: enters from position 51, goes right along row 7
  [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  // Green: enters from position 12, goes down along col 7
  [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  // Yellow: enters from position 38, goes left along row 7
  [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  // Blue: enters from position 25, goes up along col 7
  [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
];

// Position on main track where player enters home stretch
// (the cell BEFORE the home path, i.e., the last main-track cell)
export const HOME_ENTRY = [51, 12, 25, 38];

// Home base token positions (4 tokens in each corner)
export const HOME_BASES = [
  // Red (top-left)
  [[1.5, 1.5], [1.5, 3.5], [3.5, 1.5], [3.5, 3.5]],
  // Green (top-right)
  [[1.5, 10.5], [1.5, 12.5], [3.5, 10.5], [3.5, 12.5]],
  // Yellow (bottom-right)
  [[10.5, 10.5], [10.5, 12.5], [12.5, 10.5], [12.5, 12.5]],
  // Blue (bottom-left)
  [[10.5, 1.5], [10.5, 3.5], [12.5, 1.5], [12.5, 3.5]],
];

// Center triangle zone (the winning area)
export const CENTER = [7, 7];
