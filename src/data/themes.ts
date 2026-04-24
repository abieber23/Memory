import type { Theme, ThemeName } from '../types/game.types';
import codingBackImg from '../img/CodingVibeTheme/Coding_front.png';
import gamingBackImg from '../img/GamingTheme/Gaming_front.png';

const rawCodingCards = import.meta.glob<string>(
  '../img/CodingVibeTheme/Coding_Card_*.png',
  { eager: true, query: '?url', import: 'default' },
);

const rawGamingCards = import.meta.glob<string>(
  '../img/GamingTheme/Gaming_Card_*.png',
  { eager: true, query: '?url', import: 'default' },
);

function sortedSymbols(raw: Record<string, string>, prefix: string): string[] {
  return Object.entries(raw)
    .sort(([a], [b]) => {
      const num = (s: string) => parseInt(s.match(new RegExp(`${prefix}_(\\d+)`))?.[1] ?? '0');
      return num(a) - num(b);
    })
    .map(([, url]) => url);
}

export const THEMES: Record<ThemeName, Theme> = {
  ocean: {
    name: 'ocean',
    label: 'Code vibes theme',
    symbols: sortedSymbols(rawCodingCards, 'Coding_Card'),
    cardBackImage: codingBackImg,
    colors: {
      primary: '#29b8b0',
      secondary: '#3dd9d0',
      background: '#303030',
      cardBack: '#29b8b0',
      cardFront: '#f0f0f0',
      accent: '#29b8b0',
    },
  },
  forest: {
    name: 'forest',
    label: 'Gaming theme',
    symbols: sortedSymbols(rawGamingCards, 'Gaming_Card'),
    cardBackImage: gamingBackImg,
    colors: {
      primary: '#b040a0',
      secondary: '#d060c0',
      background: '#2a4a5c',
      cardBack: '#2a4a5c',
      cardFront: '#2a4a5c',
      accent: '#d060c0',
    },
  },
};

export function getTheme(name: ThemeName): Theme {
  return THEMES[name];
}
