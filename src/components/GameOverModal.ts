import type { GameState } from '../types/game.types';
import { getWinner } from '../services/GameState';

/**
 * Modal dialog shown at the end of a game, displaying the winner (or a tie)
 * and the final scores for all players. Offers buttons to start a new game or exit.
 */
export class GameOverModal {
  private container: HTMLElement;
  private state: GameState;
  private onExit: () => void;
  private onRestart: () => void;
  private overlay: HTMLElement | null = null;

  /**
   * @param container - Element the modal overlay will be appended to.
   * @param state - Final game state used to determine the winner and display scores.
   * @param onExit - Called when the player clicks "Exit".
   * @param onRestart - Called when the player clicks "New Game" (overlay is removed first).
   */
  constructor(container: HTMLElement, state: GameState, onExit: () => void, onRestart: () => void) {
    this.container = container;
    this.state = state;
    this.onExit = onExit;
    this.onRestart = onRestart;
  }

  /** Renders the modal overlay and appends it to the container. */
  show(): void {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.appendChild(this.buildModal());
    this.container.appendChild(this.overlay);
  }

  /** Builds the modal card containing title, scores and action buttons. */
  private buildModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.appendChild(this.buildTitle());
    modal.appendChild(this.buildScores());
    modal.appendChild(this.buildButtons());
    return modal;
  }

  /** Creates the heading showing the winner's name or a tie message. */
  private buildTitle(): HTMLElement {
    const winner = getWinner(this.state);
    const h2 = document.createElement('h2');
    h2.className = 'modal__title';
    h2.textContent = winner ? `Player ${winner.id} wins! 🎉` : "It's a tie! 🤝";
    return h2;
  }

  /** Creates the score list with one row per player. */
  private buildScores(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'modal__scores';
    this.state.players.forEach(p => {
      const row = document.createElement('p');
      row.className = `modal__score modal__score--${p.color}`;
      row.textContent = `Player ${p.id}: ${p.score} pairs`;
      div.appendChild(row);
    });
    return div;
  }

  /** Creates the button row with "New Game" and "Exit" actions. */
  private buildButtons(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'modal__buttons';
    div.appendChild(this.buildBtn('New Game', 'btn btn--primary', () => {
      this.overlay?.remove();
      this.onRestart();
    }));
    div.appendChild(this.buildBtn('Exit', 'btn btn--secondary', this.onExit));
    return div;
  }

  /**
   * Creates a single button element.
   * @param text - Button label.
   * @param cls - CSS class string applied to the button.
   * @param handler - Click event handler.
   */
  private buildBtn(text: string, cls: string, handler: () => void): HTMLElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = cls;
    btn.addEventListener('click', handler);
    return btn;
  }
}
