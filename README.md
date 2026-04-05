# 🎲 Ludo Elite

A premium, modern interpretation of the classic Ludo board game. Built with a focus on immersive visuals, smooth animations, and robust game logic.

![Ludo Elite](https://img.shields.io/badge/Ludo-Elite-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer--Motion-11.x-FF0055?style=for-the-badge&logo=framer)

---

## ✨ Features

-   **Premium Visuals**: Dark-themed UI with glassmorphism, glowing accents, and high-fidelity gradients.
-   **Smooth Animations**: Dynamic token movement, dice rolls, and UI transitions powered by Framer Motion.
-   **Complete Game Logic**:
    -   15x15 classic cross-shaped board.
    -   Full token movement rules, including captures and home stretches.
    -   Safe zones (star cells) to protect tokens from capture.
    -   Turn-based mechanics with rule-based bonuses (roll a 6 or capture to get an extra turn).
    -   Automatic turn advancement for simplified gameplay.
-   **Interactive UI**:
    -   Dynamic splash screen to start the game.
    -   Real-time player panels showing token progress.
    -   Context-aware game messages and winner announcements.
-   **Responsive Design**: Optimized for different screen sizes with a flexible grid layout.

## 🚀 Tech Stack

-   **Frontend**: [React](https://reactjs.org/) (Hooks & Functional Components)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Icons**: Custom SVG & Lucide-inspired iconography

## 🛠️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository (if applicable) or navigate to the project folder.
2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Build for production:
    ```bash
    npm run build
    ```

## 🎮 How to Play

Ludo is a strategy board game for 4 players (controlled via turns). The goal is to move all four of your tokens from the home base to the center of the board.

### Game Rules

1.  **Starting**: You must roll a **6** to move a token from your home base onto the starting square.
2.  **Movement**: Move your tokens clockwise around the board based on the dice roll.
3.  **Capturing**: If your token lands on a square occupied by an opponent's token, the opponent's token is captured and sent back to their home base. You receive an extra turn.
4.  **Safe Zones**: Tokens on squares marked with a **star** icon (safe zones) cannot be captured.
5.  **Extra Turns**:
    -   Rolling a **6** grants an extra turn.
    -   Capturing an opponent's token grants an extra turn.
    -   *Challenge*: Rolling three 6s in a row results in the current turn being forfeited.
6.  **Home Stretch**: Once a token completes a full circuit, it enters the colored home path.
7.  **Winning**: The first player to get all 4 tokens into the center home area wins!

---

Built with ❤️ by [Antigravity](https://github.com/google-deepmind) and the USER.
