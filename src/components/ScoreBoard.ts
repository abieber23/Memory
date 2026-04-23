import type { GameState } from '../types/game.types';

export class ScoreBoard {
  private container: HTMLElement;
  private onExit: () => void;

  constructor(container: HTMLElement, onExit: () => void) {
    this.container = container;
    this.onExit = onExit;
  }

  update(state: GameState): void {
    this.container.innerHTML = '';
    this.container.className = 'scoreboard';
    this.container.appendChild(this.createPlayerInfo(state, 0));
    this.container.appendChild(this.createCenter(state));
    this.container.appendChild(this.createPlayerInfo(state, 1));
  }

  private createPlayerInfo(state: GameState, index: 0 | 1): HTMLElement {
    const player = state.players[index];
    const div = document.createElement('div');
    div.className = `player-info player-info--${player.color}`;
    if (state.currentPlayerIndex === index) div.classList.add('active');
    div.innerHTML = `
      <span class="player-label">Player ${player.id}</span>
      <span class="player-score">${player.score}</span>
    `;
    return div;
  }

  private createCenter(state: GameState): HTMLElement {
    const div = document.createElement('div');
    div.className = 'scoreboard__center';
    div.appendChild(this.createTurnIndicator(state));
    div.appendChild(this.createExitButton());
    return div;
  }

  private createTurnIndicator(state: GameState): HTMLElement {
    const span = document.createElement('span');
    span.className = 'turn-indicator';
    const p = state.players[state.currentPlayerIndex];
    span.textContent = `Player ${p.id}'s turn`;
    span.style.color = `var(--color-${p.color})`;
    return span;
  }

  private createExitButton(): HTMLElement {
    const btn = document.createElement('button');
    btn.className = 'exit-btn';
    btn.textContent = 'Exit Game';
    btn.addEventListener('click', this.onExit);
    return btn;
  }
}
