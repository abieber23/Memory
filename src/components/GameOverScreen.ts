import type { GameState, Player, Theme } from '../types/game.types';

export class GameOverScreen {
  private container: HTMLElement;
  private state: GameState;
  private theme: Theme;
  private onComplete: () => void;

  constructor(container: HTMLElement, state: GameState, theme: Theme, onComplete: () => void) {
    this.container = container;
    this.state = state;
    this.theme = theme;
    this.onComplete = onComplete;
  }

  show(): void {
    this.container.innerHTML = '';
    this.container.appendChild(this.buildScreen());
    setTimeout(() => this.onComplete(), 3000);
  }

  private buildScreen(): HTMLElement {
    const screen = document.createElement('div');
    screen.className = `game-over-screen game-over-screen--${this.theme.name}`;
    screen.appendChild(this.buildTitle());
    screen.appendChild(this.buildScoreSection());
    return screen;
  }

  private buildTitle(): HTMLElement {
    const h1 = document.createElement('h1');
    h1.className = 'game-over__title';
    h1.textContent = 'Game over';
    return h1;
  }

  private buildScoreSection(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'game-over__scores';
    const label = document.createElement('p');
    label.className = 'game-over__label';
    label.textContent = 'Final score';
    div.appendChild(label);
    div.appendChild(this.buildPills());
    return div;
  }

  private buildPills(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'game-over__pills';
    this.state.players.forEach(p => div.appendChild(this.buildPill(p)));
    return div;
  }

  private buildPill(player: Player): HTMLElement {
    const pill = document.createElement('div');
    pill.className = `game-over__pill game-over__pill--${player.color}`;
    pill.appendChild(this.buildPillIcon(player.color));
    const score = document.createElement('span');
    score.className = 'game-over__pill-score';
    score.textContent = this.theme.playerIcons
      ? String(player.score)
      : `${player.color.charAt(0).toUpperCase() + player.color.slice(1)} ${player.score}`;
    pill.appendChild(score);
    return pill;
  }

  private buildPillIcon(color: 'blue' | 'orange'): HTMLElement {
    const icons = this.theme.playerIcons;
    if (icons) {
      const img = document.createElement('img');
      img.src = icons[color];
      img.className = 'game-over__pill-icon';
      img.alt = '';
      return img;
    }
    const dot = document.createElement('span');
    dot.className = 'game-over__dot';
    return dot;
  }
}
