import type { GameState } from '../types/game.types';
import { getWinner } from '../services/GameState';

export class GameOverModal {
  private container: HTMLElement;
  private state: GameState;
  private onExit: () => void;
  private onRestart: () => void;
  private overlay: HTMLElement | null = null;

  constructor(container: HTMLElement, state: GameState, onExit: () => void, onRestart: () => void) {
    this.container = container;
    this.state = state;
    this.onExit = onExit;
    this.onRestart = onRestart;
  }

  show(): void {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.appendChild(this.buildModal());
    this.container.appendChild(this.overlay);
  }

  private buildModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.appendChild(this.buildTitle());
    modal.appendChild(this.buildScores());
    modal.appendChild(this.buildButtons());
    return modal;
  }

  private buildTitle(): HTMLElement {
    const winner = getWinner(this.state);
    const h2 = document.createElement('h2');
    h2.className = 'modal__title';
    h2.textContent = winner ? `Player ${winner.id} wins! 🎉` : "It's a tie! 🤝";
    return h2;
  }

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

  private buildBtn(text: string, cls: string, handler: () => void): HTMLElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = cls;
    btn.addEventListener('click', handler);
    return btn;
  }
}
