import type { CardData } from '../types/game.types';

export function createCardElement(
  card: CardData,
  backImage: string | null,
  onClick: (card: CardData) => void,
): HTMLElement {
  const el = document.createElement('div');
  el.className = buildCardClass(card);
  el.dataset['id'] = String(card.id);
  el.appendChild(createCardInner(card.symbol, backImage));
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

function createCardInner(symbol: string, backImage: string | null): HTMLElement {
  const inner = document.createElement('div');
  inner.className = 'card__inner';
  inner.appendChild(createBack(backImage));
  inner.appendChild(createFront(symbol));
  return inner;
}

function createBack(backImage: string | null): HTMLElement {
  const face = document.createElement('div');
  face.className = 'card__back';
  if (backImage) {
    face.classList.add('card__back--image');
    const img = document.createElement('img');
    img.src = backImage;
    img.className = 'card__img';
    img.alt = '';
    face.appendChild(img);
  }
  return face;
}

function createFront(symbol: string): HTMLElement {
  const face = document.createElement('div');
  face.className = 'card__front';
  if (isImageUrl(symbol)) {
    const img = document.createElement('img');
    img.src = symbol;
    img.className = 'card__img';
    img.alt = '';
    face.appendChild(img);
  } else {
    face.textContent = symbol;
  }
  return face;
}

function isImageUrl(s: string): boolean {
  return s.startsWith('/') || s.startsWith('data:') || s.startsWith('http');
}
