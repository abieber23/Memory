# Memory Card Game

A browser-based memory card game built with TypeScript, SCSS and Vite. Two players take turns flipping cards to find matching pairs. The player with the most pairs at the end wins.

## Features

- Two playable themes: **Code Vibes** and **Gaming**
- 2-player turn-based gameplay
- Animated card flips
- Game over screen with final scores
- Winner screen with confetti (Code Vibes theme)
- Exit confirmation dialog

## Tech Stack

- TypeScript
- SCSS
- Vite

## Getting Started

### Prerequisites

- Node.js

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

The output will be in the `dist/` folder. Upload its contents (not the folder itself) to the root of your web server.

## Project Structure

```
src/
├── components/       # UI components (screens, modals, cards)
├── services/         # Game logic and state management
├── data/             # Theme definitions and image imports
├── types/            # TypeScript type definitions
├── styles/           # SCSS stylesheets
└── main.ts           # App entry point
```

## Deployment

Upload the contents of `dist/` to the webroot of your server (e.g. `public_html/`). Make sure `index.html` and the `assets/` folder are at the root level, not inside a subfolder.
