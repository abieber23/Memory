/** Color assigned to a player. */
export type PlayerColor = 'blue' | 'orange';

/** Available board configurations (columns × rows). */
export type BoardSize = '4x4' | '4x6' | '6x6';

/** Identifier for a selectable theme. */
export type ThemeName = 'coding' | 'gaming';

/** Represents one of the two players in a game session. */
export interface Player {
  id: 1 | 2;
  color: PlayerColor;
  score: number;
}

/** State of a single card on the board. */
export interface CardData {
  id: number;
  pairId: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

/** CSS custom-property values that define a theme's colour palette. */
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  cardBack: string;
  cardFront: string;
  accent: string;
}

/** Paths to player-specific icon images used in the scoreboard. */
export interface PlayerIcons {
  blue: string;
  orange: string;
}

/** Full definition of a visual theme. */
export interface Theme {
  name: ThemeName;
  label: string;
  symbols: string[];
  cardBackImage?: string;
  playerIcons?: PlayerIcons;
  colors: ThemeColors;
}

/** Configuration chosen by the players before a game starts. */
export interface GameConfig {
  player1Color: PlayerColor;
  player2Color: PlayerColor;
  boardSize: BoardSize;
  theme: ThemeName;
}

/** Full snapshot of the game at any point in time. */
export interface GameState {
  cards: CardData[];
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  flippedCards: CardData[];
  matchedPairs: number;
  totalPairs: number;
  isLocked: boolean;
}
