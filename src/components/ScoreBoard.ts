import type { GameState, Player } from '../types/game.types';
import exitIconImg from '../img/Exit_Icon.png';

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
    const dot = document.createElement('span');
    dot.className = 'pill__dot';
    const name = document.createElement('span');
    name.textContent = player.color.charAt(0).toUpperCase() + player.color.slice(1);
    const score = document.createElement('span');
    score.className = 'pill__score';
    score.textContent = String(player.score);
    div.append(dot, name, score);
    return div;
  }

  private buildCurrentPlayer(state: GameState): HTMLElement {
    const div = document.createElement('div');
    div.className = 'scoreboard__current';
    const label = document.createElement('span');
    label.textContent = 'Current player:';
    const dot = document.createElement('span');
    const color = state.players[state.currentPlayerIndex].color;
    dot.className = `current__dot current__dot--${color}`;
    div.append(label, dot);
    return div;
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
    btn.addEventListener('click', this.onExit);
    return btn;
  }
}
