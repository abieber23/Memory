import type { GameState, Player, Theme } from '../types/game.types';
import exitIconImg from '../img/Exit_Icon.png';
import { ExitConfirmModal } from './ExitConfirmModal';

export class ScoreBoard {
  private container: HTMLElement;
  private theme: Theme;
  private onExit: () => void;

  constructor(container: HTMLElement, theme: Theme, onExit: () => void) {
    this.container = container;
    this.theme = theme;
    this.onExit = onExit;
  }

  update(state: GameState): void {
    this.container.innerHTML = '';
    this.container.className = 'scoreboard';
    this.container.appendChild(this.buildPills(state));
    this.container.appendChild(this.buildCurrentPlayer(state));
    this.container.appendChild(this.buildExitBtn());
  }

  private buildPills(state: GameState): HTMLElement {
    const div = document.createElement('div');
    div.className = 'scoreboard__pills';
    state.players.forEach(p => div.appendChild(this.buildPill(p)));
    return div;
  }

  private buildPill(player: Player): HTMLElement {
    const div = document.createElement('div');
    div.className = `scoreboard__pill scoreboard__pill--${player.color}`;
    div.appendChild(this.buildPlayerIcon(player.color));
    const score = document.createElement('span');
    score.className = 'pill__score';
    score.textContent = String(player.score);
    div.appendChild(score);
    return div;
  }

  private buildPlayerIcon(color: 'blue' | 'orange'): HTMLElement {
    const icons = this.theme.playerIcons;
    if (icons) return this.buildIconImg(icons[color]);
    const dot = document.createElement('span');
    dot.className = `pill__dot pill__dot--${color}`;
    return dot;
  }

  private buildIconImg(src: string): HTMLElement {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'player-icon';
    img.alt = '';
    return img;
  }

  private buildCurrentPlayer(state: GameState): HTMLElement {
    const div = document.createElement('div');
    div.className = 'scoreboard__current';
    const label = document.createElement('span');
    label.textContent = 'Current player:';
    const color = state.players[state.currentPlayerIndex].color;
    div.append(label, this.buildCurrentIcon(color));
    return div;
  }

  private buildCurrentIcon(color: 'blue' | 'orange'): HTMLElement {
    const icons = this.theme.playerIcons;
    if (icons) return this.buildIconImg(icons[color]);
    const dot = document.createElement('span');
    dot.className = `current__dot current__dot--${color}`;
    return dot;
  }

  private buildExitBtn(): HTMLElement {
    const btn = document.createElement('button');
    btn.className = 'exit-btn';
    const icon = document.createElement('img');
    icon.src = exitIconImg;
    icon.className = 'exit-btn__icon';
    icon.alt = '';
    const label = document.createElement('span');
    label.textContent = 'Exit game';
    btn.append(icon, label);
    btn.addEventListener('click', () => this.showExitConfirm());
    return btn;
  }

  private showExitConfirm(): void {
    new ExitConfirmModal(this.theme.name, () => {}, this.onExit).show();
  }
}
