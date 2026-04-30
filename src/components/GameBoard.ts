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
  private lastFlippedId: number | null = null;

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
    this.scoreBoard = new ScoreBoard(this.appendDiv(), getTheme(config.theme), onExit);
    this.applyTheme();
    this.render();
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

  /** Updates the scoreboard and replaces the card grid to reflect the current state. */
  private render(): void {
    this.scoreBoard.update(this.state);
    this.container.querySelector('.game-grid')?.remove();
    this.container.appendChild(this.buildGrid());
  }

  /** Builds and returns the full card grid element from the current state. */
  private buildGrid(): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    const [cols] = getBoardDimensions(this.config.boardSize);
    grid.style.setProperty('--grid-cols', String(cols));
    const backImage = getTheme(this.config.theme).cardBackImage ?? null;
    this.state.cards.forEach(card => {
      const animate = card.id === this.lastFlippedId;
      grid.appendChild(createCardElement(card, backImage, c => this.handleClick(c), animate));
    });
    return grid;
  }

  /**
   * Handles a card click: validates the move, flips the card with animation,
   * then triggers pair evaluation when two cards are face-up.
   */
  private handleClick(card: CardData): void {
    if (this.state.isLocked || this.state.flippedCards.length >= 2) return;
    const current = this.state.cards.find(c => c.id === card.id);
    if (!current || current.isFlipped || current.isMatched) return;
    this.lastFlippedId = card.id;
    this.state = flipCard(this.state, card.id);
    this.render();
    this.lastFlippedId = null;
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
    this.state = markMatched(this.state);
    setTimeout(() => {
      this.render();
      if (isGameOver(this.state)) setTimeout(() => this.showGameOver(), 600);
    }, 650);
  }

  /** Handles a mismatch: locks the board and flips the cards back after a short delay. */
  private onMismatch(): void {
    this.state = { ...this.state, isLocked: true };
    setTimeout(() => {
      this.state = unflipCards(this.state);
      this.render();
    }, 1000);
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
