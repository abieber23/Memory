import type { CardData, GameConfig, GameState } from '../types/game.types';
import { createCardElement } from './Card';
import { ScoreBoard } from './ScoreBoard';
import { GameOverModal } from './GameOverModal';
import { createInitialState, flipCard, markMatched, unflipCards, isGameOver } from '../services/GameState';
import { getBoardDimensions, checkMatch } from '../services/CardLogic';
import { getTheme } from '../data/themes';

export class GameBoard {
  private container: HTMLElement;
  private config: GameConfig;
  private state: GameState;
  private scoreBoard: ScoreBoard;
  private onExit: () => void;

  constructor(container: HTMLElement, config: GameConfig, onExit: () => void) {
    this.container = container;
    this.config = config;
    this.onExit = onExit;
    this.state = createInitialState(config);
    this.scoreBoard = new ScoreBoard(this.appendDiv(), onExit);
    this.applyTheme();
    this.render();
  }

  private appendDiv(): HTMLElement {
    const el = document.createElement('div');
    this.container.appendChild(el);
    return el;
  }

  private applyTheme(): void {
    const { colors } = getTheme(this.config.theme);
    const r = document.documentElement;
    r.style.setProperty('--color-primary', colors.primary);
    r.style.setProperty('--color-secondary', colors.secondary);
    r.style.setProperty('--color-background', colors.background);
    r.style.setProperty('--color-card-back', colors.cardBack);
    r.style.setProperty('--color-card-front', colors.cardFront);
    r.style.setProperty('--color-accent', colors.accent);
  }

  private render(): void {
    this.scoreBoard.update(this.state);
    this.container.querySelector('.game-grid')?.remove();
    this.container.appendChild(this.buildGrid());
  }

  private buildGrid(): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    const [cols] = getBoardDimensions(this.config.boardSize);
    grid.style.setProperty('--grid-cols', String(cols));
    this.state.cards.forEach(card => {
      grid.appendChild(createCardElement(card, c => this.handleClick(c)));
    });
    return grid;
  }

  private handleClick(card: CardData): void {
    if (this.state.isLocked || this.state.flippedCards.length >= 2) return;
    const current = this.state.cards.find(c => c.id === card.id);
    if (!current || current.isFlipped || current.isMatched) return;
    this.state = flipCard(this.state, card.id);
    this.render();
    if (this.state.flippedCards.length === 2) this.evaluate();
  }

  private evaluate(): void {
    const [c1, c2] = this.state.flippedCards;
    checkMatch(c1, c2) ? this.onMatch() : this.onMismatch();
  }

  private onMatch(): void {
    this.state = markMatched(this.state);
    this.render();
    if (isGameOver(this.state)) setTimeout(() => this.showGameOver(), 600);
  }

  private onMismatch(): void {
    this.state = { ...this.state, isLocked: true };
    setTimeout(() => {
      this.state = unflipCards(this.state);
      this.render();
    }, 1000);
  }

  private showGameOver(): void {
    new GameOverModal(this.container, this.state, this.onExit, () => {
      this.state = createInitialState(this.config);
      this.render();
    }).show();
  }
}
