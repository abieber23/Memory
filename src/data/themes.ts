import type { Theme, ThemeName } from '../types/game.types';

const OCEAN_SYMBOLS = [
  '🐠','🐙','🦈','🐳','🦀','🐡','🐬','🦑',
  '🐚','🦞','🐟','🦭','🌊','🐋','🦐','🪸','🐌','🦔',
];

const FOREST_SYMBOLS = [
  '🦊','🐺','🦌','🐻','🍄','🌿','🌲','🐦',
  '🦉','🐗','🌱','🍃','🦋','🐿️','🦝','🐝','🍀','🌻',
];

export const THEMES: Record<ThemeName, Theme> = {
  ocean: {
    name: 'ocean',
    label: 'Code vibes theme',
    symbols: OCEAN_SYMBOLS,
    colors: {
      primary: '#0369A1',
      secondary: '#0EA5E9',
      background: '#0C4A6E',
      cardBack: '#075985',
      cardFront: '#E0F2FE',
      accent: '#38BDF8',
    },
  },
  forest: {
    name: 'forest',
    label: 'Gaming theme',
    symbols: FOREST_SYMBOLS,
    colors: {
      primary: '#15803D',
      secondary: '#22C55E',
      background: '#14532D',
      cardBack: '#166534',
      cardFront: '#DCFCE7',
      accent: '#4ADE80',
    },
  },
};

export function getTheme(name: ThemeName): Theme {
  return THEMES[name];
}
