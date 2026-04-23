import type { CardData } from '../types/game.types';

export function createCardElement(card: CardData, onClick: (card: CardData) => void): HTMLElement {
  const el = document.createElement('div');
  el.className = buildCardClass(card);
  el.dataset['id'] = String(card.id);
  el.appendChild(createCardInner(card.symbol));
  if (!card.isFlipped && !card.isMatched) {
    el.addEventListener('click', () => onClick(card));
  }
  return el;
}

function buildCardClass(card: CardData): string {
  const flipped = card.isFlipped ? ' card--flipped' : '';
  const matched = card.isMatched ? ' card--matched' : '';
  return `card${flipped}${matched}`;
}

function createCardInner(symbol: string): HTMLElement {
  const inner = document.createElement('div');
  inner.className = 'card__inner';
  inner.appendChild(createFace('card__back', ''));
  inner.appendChild(createFace('card__front', symbol));
  return inner;
}

function createFace(className: string, text: string): HTMLElement {
  const face = document.createElement('div');
  face.className = className;
  face.textContent = text;
  return face;
}
