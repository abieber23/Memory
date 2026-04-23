import type { CardData, GameConfig, GameState, Player } from '../types/game.types';
import { createCards, getTotalPairs } from './CardLogic';
import { getTheme } from '../data/themes';

function createPlayers(config: GameConfig): [Player, Player] {
  return [
    { id: 1, color: config.player1Color, score: 0 },
    { id: 2, color: config.player2Color, score: 0 },
  ];
}

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

export function flipCard(state: GameState, cardId: number): GameState {
  const cards = state.cards.map(c =>
    c.id === cardId ? { ...c, isFlipped: true } : c
  );
  const flippedCards = cards.filter(c => c.isFlipped && !c.isMatched);
  return { ...state, cards, flippedCards };
}

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

export function unflipCards(state: GameState): GameState {
  const ids = new Set(state.flippedCards.map(c => c.id));
  const cards = state.cards.map(c => ids.has(c.id) ? { ...c, isFlipped: false } : c);
  const next = (state.currentPlayerIndex === 0 ? 1 : 0) as 0 | 1;
  return { ...state, cards, flippedCards: [], currentPlayerIndex: next, isLocked: false };
}

export function isGameOver(state: GameState): boolean {
  return state.matchedPairs === state.totalPairs;
}

export function getWinner(state: GameState): Player | null {
  const [p1, p2] = state.players;
  if (p1.score === p2.score) return null;
  return p1.score > p2.score ? p1 : p2;
}
