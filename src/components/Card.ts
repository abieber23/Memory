import type { CardData } from '../types/game.types';

/**
 * Creates and returns a fully built card DOM element.
 * @param card - Data describing the card's current state.
 * @param backImage - URL of the card-back image, or null to use the CSS fallback.
 * @param onClick - Called with the card data when a face-down card is clicked.
 * @param animate - When true the flip animation plays; false renders the flipped state instantly.
 */
export function createCardElement(
  card: CardData,
  backImage: string | null,
  onClick: (card: CardData) => void,
  animate = false,
): HTMLElement {
  const el = document.createElement('div');
  el.className = buildCardClass(card, animate);
  el.dataset['id'] = String(card.id);
  el.appendChild(createCardInner(card.symbol, backImage));
  if (!card.isFlipped && !card.isMatched) {
    el.addEventListener('click', () => onClick(card));
  }
  return el;
}

/**
 * Builds the CSS class string for a card element.
 * Adds `card--no-animate` to already-flipped/matched cards when animation is suppressed.
 */
function buildCardClass(card: CardData, animate: boolean): string {
  const flipped = card.isFlipped ? ' card--flipped' : '';
  const matched = card.isMatched ? ' card--matched' : '';
  const noAnim = (card.isFlipped || card.isMatched) && !animate ? ' card--no-animate' : '';
  return `card${flipped}${matched}${noAnim}`;
}

/** Creates the inner wrapper containing both the back and front faces. */
function createCardInner(symbol: string, backImage: string | null): HTMLElement {
  const inner = document.createElement('div');
  inner.className = 'card__inner';
  inner.appendChild(createBack(backImage));
  inner.appendChild(createFront(symbol));
  return inner;
}

/**
 * Creates the card-back face element.
 * When a backImage is provided it is displayed as a full-cover image;
 * otherwise the CSS `::after` pseudo-element shows a fallback glyph.
 */
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

/**
 * Creates the card-front face element.
 * Renders an `<img>` when the symbol is a URL, otherwise uses text content.
 */
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

/** Returns true when the string is a URL rather than a plain emoji or text symbol. */
function isImageUrl(s: string): boolean {
  return s.startsWith('/') || s.startsWith('data:') || s.startsWith('http');
}
