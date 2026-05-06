import type { CardData, GameConfig, GameState } from '../types/game.types';
import { createCardElement } from './Card';
import { ScoreBoard } from './ScoreBoard';
import { GameOverScreen } from './GameOverScreen';
import { WinnerScreen } from './WinnerScreen';
import { createInitialState, flipCard, markMatched, unflipCards, isGameOver } from '../services/GameState';
import { getBoardDimensions, checkMatch } from '../services/CardLogic';
import { getTheme } from '../data/themes';

/** Manages the active game session: card grid, turn logic and end-game transitions. */
export class GameBoard {
  private container: HTMLElement;
  private config: GameConfig;
  private state: GameState;
  private scoreBoard: ScoreBoard;
  private onExit: () => void;
  private grid!: HTMLElement;
  private cardElements = new Map<number, HTMLElement>();
  private backImage: string | null = null;

  /**
   * @param container - Element to render the game into.
   * @param config - Settings chosen on the setup screen.
   * @param onExit - Called when the player leaves the game (e.g. from the winner screen).
   */
  constructor(container: HTMLElement, config: GameConfig, onExit: () => void) {
    this.container = container;
    this.config = config;
    this.onExit = onExit;
    this.state = createInitialState(config);
    this.backImage = getTheme(config.theme).cardBackImage ?? null;
    this.scoreBoard = new ScoreBoard(this.appendDiv(), getTheme(config.theme), onExit);
    this.applyTheme();
    this.buildGrid();
    this.scoreBoard.update(this.state);
  }

  /** Appends a blank div to the container and returns it (used to reserve slots for child components). */
  private appendDiv(): HTMLElement {
    const el = document.createElement('div');
    this.container.appendChild(el);
    return el;
  }

  /** Reads the active theme's colours and writes them as CSS custom properties on the root element. */
  private applyTheme(): void {
    const { colors } = getTheme(this.config.theme);
    const r = document.documentElement;
    r.style.setProperty('--color-primary', colors.primary);
    r.style.setProperty('--color-secondary', colors.secondary);
    r.style.setProperty('--color-background', colors.background);
    r.style.setProperty('--color-card-back', colors.cardBack);
    r.style.setProperty('--color-card-front', colors.cardFront);
    r.style.setProperty('--color-accent', colors.accent);
    this.container.dataset['theme'] = this.config.theme;
  }

  /** Builds the card grid once and stores references for targeted updates. */
  private buildGrid(): void {
    this.grid = document.createElement('div');
    this.grid.className = 'game-grid';
    const [cols] = getBoardDimensions(this.config.boardSize);
    this.grid.style.setProperty('--grid-cols', String(cols));
    this.state.cards.forEach(card => {
      const el = createCardElement(card, this.backImage, c => this.handleClick(c), false);
      this.cardElements.set(card.id, el);
      this.grid.appendChild(el);
    });
    this.container.appendChild(this.grid);
  }

  /** Replaces only the card elements whose IDs are listed, then updates the scoreboard. */
  private updateCards(ids: number[], animate = false): void {
    this.scoreBoard.update(this.state);
    for (const id of ids) {
      const card = this.state.cards.find(c => c.id === id)!;
      const oldEl = this.cardElements.get(id)!;
      const newEl = createCardElement(card, this.backImage, c => this.handleClick(c), animate);
      oldEl.replaceWith(newEl);
      this.cardElements.set(id, newEl);
    }
  }

  /**
   * Handles a card click: validates the move, flips the card with animation,
   * then triggers pair evaluation when two cards are face-up.
   */
  private handleClick(card: CardData): void {
    if (this.state.isLocked || this.state.flippedCards.length >= 2) return;
    const current = this.state.cards.find(c => c.id === card.id);
    if (!current || current.isFlipped || current.isMatched) return;
    this.state = flipCard(this.state, card.id);
    this.updateCards([card.id], true);
    if (this.state.flippedCards.length === 2) this.evaluate();
  }

  /** Checks whether the two face-up cards are a matching pair and routes to the appropriate handler. */
  private evaluate(): void {
    const [c1, c2] = this.state.flippedCards;
    checkMatch(c1, c2) ? this.onMatch() : this.onMismatch();
  }

  /**
   * Handles a successful match: updates the state, waits for the flip animation
   * to finish before re-rendering, then checks for game over.
   */
  private onMatch(): void {
    const [c1, c2] = this.state.flippedCards;
    this.state = markMatched(this.state);
    setTimeout(() => {
      this.updateCards([c1.id, c2.id]);
      if (isGameOver(this.state)) setTimeout(() => this.showGameOver(), 600);
    }, 650);
  }

  /** Handles a mismatch: locks the board, plays the flip-back animation, then unflips. */
  private onMismatch(): void {
    const [c1, c2] = this.state.flippedCards;
    this.state = { ...this.state, isLocked: true };
    setTimeout(() => {
      this.cardElements.get(c1.id)?.classList.add('card--unflipping');
      this.cardElements.get(c2.id)?.classList.add('card--unflipping');
      setTimeout(() => {
        this.state = unflipCards(this.state);
        this.updateCards([c1.id, c2.id]);
      }, 500);
    }, 600);
  }

  /** Replaces the game board with the game-over screen, which auto-transitions to the winner screen. */
  private showGameOver(): void {
    const theme = getTheme(this.config.theme);
    const state = this.state;
    new GameOverScreen(this.container, state, theme, () => {
      new WinnerScreen(this.container, state, theme, this.onExit).show();
    }).show();
  }
}
