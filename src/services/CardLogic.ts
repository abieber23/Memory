import type { BoardSize, CardData } from '../types/game.types';

/** Returns the [columns, rows] dimensions for a given board size. */
export function getBoardDimensions(size: BoardSize): [number, number] {
  const map: Record<BoardSize, [number, number]> = {
    '4x4': [4, 4],
    '4x6': [4, 6],
    '6x6': [6, 6],
  };
  return map[size];
}

/** Returns the total number of pairs on a board of the given size. */
export function getTotalPairs(size: BoardSize): number {
  const [cols, rows] = getBoardDimensions(size);
  return (cols * rows) / 2;
}

/** Returns true when two cards share the same pairId. */
export function checkMatch(card1: CardData, card2: CardData): boolean {
  return card1.pairId === card2.pairId;
}

/**
 * Creates two CardData objects that form a matching pair.
 * @param pairId - Shared identifier that links the two cards.
 * @param symbol - Front-face image URL or emoji for both cards.
 * @param offset - Starting ID value; the second card gets offset + 1.
 */
function createPair(pairId: number, symbol: string, offset: number): [CardData, CardData] {
  const base = { pairId, symbol, isFlipped: false, isMatched: false };
  return [{ ...base, id: offset }, { ...base, id: offset + 1 }];
}

/**
 * Returns a new array with elements in random order (Fisher-Yates).
 * @param arr - The array to shuffle; the original is not mutated.
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Picks the required number of symbols, creates a pair for each, and
 * returns all cards in a shuffled order ready to be placed on the board.
 * @param symbols - Full symbol list from the active theme.
 * @param totalPairs - How many distinct pairs to include.
 */
export function createCards(symbols: string[], totalPairs: number): CardData[] {
  const selected = symbols.slice(0, totalPairs);
  const pairs = selected.flatMap((sym, i) => createPair(i, sym, i * 2));
  return shuffle(pairs);
}
