import type { BoardSize, CardData } from '../types/game.types';

export function getBoardDimensions(size: BoardSize): [number, number] {
  const map: Record<BoardSize, [number, number]> = {
    '4x4': [4, 4],
    '4x6': [4, 6],
    '6x6': [6, 6],
  };
  return map[size];
}

export function getTotalPairs(size: BoardSize): number {
  const [cols, rows] = getBoardDimensions(size);
  return (cols * rows) / 2;
}

export function checkMatch(card1: CardData, card2: CardData): boolean {
  return card1.pairId === card2.pairId;
}

function createPair(pairId: number, symbol: string, offset: number): [CardData, CardData] {
  const base = { pairId, symbol, isFlipped: false, isMatched: false };
  return [{ ...base, id: offset }, { ...base, id: offset + 1 }];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createCards(symbols: string[], totalPairs: number): CardData[] {
  const selected = symbols.slice(0, totalPairs);
  const pairs = selected.flatMap((sym, i) => createPair(i, sym, i * 2));
  return shuffle(pairs);
}
