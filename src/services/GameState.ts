import type { GameConfig, GameState, Player } from '../types/game.types';
import { createCards, getTotalPairs } from './CardLogic';
import { getTheme } from '../data/themes';

/** Creates the initial two-player array from a game configuration. */
function createPlayers(config: GameConfig): [Player, Player] {
  return [
    { id: 1, color: config.player1Color, score: 0 },
    { id: 2, color: config.player2Color, score: 0 },
  ];
}

/**
 * Builds a fresh GameState from the given configuration.
 * Cards are generated from the active theme and shuffled.
 */
export function createInitialState(config: GameConfig): GameState {
  const theme = getTheme(config.theme);
  const totalPairs = getTotalPairs(config.boardSize);
  return {
    cards: createCards(theme.symbols, totalPairs),
    players: createPlayers(config),
    currentPlayerIndex: 0,
    flippedCards: [],
    matchedPairs: 0,
    totalPairs,
    isLocked: false,
  };
}

/**
 * Returns a new state where the card with the given ID is face-up
 * and added to the flippedCards list.
 */
export function flipCard(state: GameState, cardId: number): GameState {
  const cards = state.cards.map(c =>
    c.id === cardId ? { ...c, isFlipped: true } : c
  );
  const flippedCards = cards.filter(c => c.isFlipped && !c.isMatched);
  return { ...state, cards, flippedCards };
}

/**
 * Returns a new state where the currently flipped pair is marked as matched
 * and the active player's score is incremented by one.
 */
export function markMatched(state: GameState): GameState {
  const [c1] = state.flippedCards;
  const cards = state.cards.map(c =>
    c.pairId === c1.pairId ? { ...c, isMatched: true, isFlipped: true } : c
  );
  const players = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, score: p.score + 1 } : p
  ) as [Player, Player];
  return { ...state, cards, players, matchedPairs: state.matchedPairs + 1, flippedCards: [] };
}

/**
 * Returns a new state where the two flipped (unmatched) cards are turned
 * face-down, the turn passes to the other player, and the lock is released.
 */
export function unflipCards(state: GameState): GameState {
  const ids = new Set(state.flippedCards.map(c => c.id));
  const cards = state.cards.map(c => ids.has(c.id) ? { ...c, isFlipped: false } : c);
  const next: 0 | 1 = state.currentPlayerIndex === 0 ? 1 : 0;
  return { ...state, cards, flippedCards: [], currentPlayerIndex: next, isLocked: false };
}

/** Returns true when every pair on the board has been matched. */
export function isGameOver(state: GameState): boolean {
  return state.matchedPairs === state.totalPairs;
}

/**
 * Returns the player with the higher score, or null when the scores are tied.
 */
export function getWinner(state: GameState): Player | null {
  const [p1, p2] = state.players;
  if (p1.score === p2.score) return null;
  return p1.score > p2.score ? p1 : p2;
}
