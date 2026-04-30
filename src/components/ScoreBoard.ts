import type { GameState, Player, Theme } from '../types/game.types';
import exitIconImg from '../img/Exit_Icon.png';
import { ExitConfirmModal } from './ExitConfirmModal';

/** Renders and updates the scoreboard strip at the top of the game screen. */
export class ScoreBoard {
  private container: HTMLElement;
  private theme: Theme;
  private onExit: () => void;

  /**
   * @param container - Element to render the scoreboard into.
   * @param theme - Active theme; determines whether icons or coloured dots are shown.
   * @param onExit - Called after the player confirms they want to leave the game.
   */
  constructor(container: HTMLElement, theme: Theme, onExit: () => void) {
    this.container = container;
    this.theme = theme;
    this.onExit = onExit;
  }

  /** Re-renders the entire scoreboard to reflect the given game state. */
  update(state: GameState): void {
    this.container.innerHTML = '';
    this.container.className = 'scoreboard';
    this.container.appendChild(this.buildPills(state));
    this.container.appendChild(this.buildCurrentPlayer(state));
    this.container.appendChild(this.buildExitBtn());
  }

  /** Creates the row of score pills — one per player. */
  private buildPills(state: GameState): HTMLElement {
    const div = document.createElement('div');
    div.className = 'scoreboard__pills';
    state.players.forEach(p => div.appendChild(this.buildPill(p)));
    return div;
  }

  /** Creates a single score pill for the given player. */
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

  /**
   * Returns a player icon element — an `<img>` when the theme provides icons,
   * otherwise a coloured dot `<span>`.
   */
  private buildPlayerIcon(color: 'blue' | 'orange'): HTMLElement {
    const icons = this.theme.playerIcons;
    if (icons) return this.buildIconImg(icons[color]);
    const dot = document.createElement('span');
    dot.className = `pill__dot pill__dot--${color}`;
    return dot;
  }

  /** Creates an `<img>` element for a player icon. */
  private buildIconImg(src: string): HTMLElement {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'player-icon';
    img.alt = '';
    return img;
  }

  /** Creates the "current player" indicator shown in the centre of the scoreboard. */
  private buildCurrentPlayer(state: GameState): HTMLElement {
    const div = document.createElement('div');
    div.className = 'scoreboard__current';
    const label = document.createElement('span');
    label.textContent = 'Current player:';
    const color = state.players[state.currentPlayerIndex].color;
    div.append(label, this.buildCurrentIcon(color));
    return div;
  }

  /**
   * Returns the current-player icon — an `<img>` when the theme provides icons,
   * otherwise a coloured square dot.
   */
  private buildCurrentIcon(color: 'blue' | 'orange'): HTMLElement {
    const icons = this.theme.playerIcons;
    if (icons) return this.buildIconImg(icons[color]);
    const dot = document.createElement('span');
    dot.className = `current__dot current__dot--${color}`;
    return dot;
  }

  /** Creates the exit button that opens the confirmation modal when clicked. */
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

  /** Opens the exit-confirmation modal for the active theme. */
  private showExitConfirm(): void {
    new ExitConfirmModal(this.theme.name, () => {}, this.onExit).show();
  }
}
