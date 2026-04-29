export type PlayerColor = 'blue' | 'orange';
export type BoardSize = '4x4' | '4x6' | '6x6';
export type ThemeName = 'ocean' | 'forest';

export interface Player {
  id: 1 | 2;
  color: PlayerColor;
  score: number;
}

export interface CardData {
  id: number;
  pairId: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  cardBack: string;
  cardFront: string;
  accent: string;
}

export interface PlayerIcons {
  blue: string;
  orange: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  symbols: string[];
  cardBackImage?: string;
  playerIcons?: PlayerIcons;
  colors: ThemeColors;
}

export interface GameConfig {
  player1Color: PlayerColor;
  player2Color: PlayerColor;
  boardSize: BoardSize;
  theme: ThemeName;
}

export interface GameState {
  cards: CardData[];
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  flippedCards: CardData[];
  matchedPairs: number;
  totalPairs: number;
  isLocked: boolean;
}
