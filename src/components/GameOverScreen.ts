import type { GameState, Player, Theme } from '../types/game.types';

/**
 * Full-page "Game over" screen shown immediately after the last pair is matched.
 * Displays the final scores and automatically calls `onComplete` after 3 seconds.
 */
export class GameOverScreen {
  private container: HTMLElement;
  private state: GameState;
  private theme: Theme;
  private onComplete: () => void;

  /**
   * @param container - Element to render into (its contents will be replaced).
   * @param state - Final game state used to display scores.
   * @param theme - Active theme; controls title style and pill icon type.
   * @param onComplete - Called automatically after the 3-second display period.
   */
  constructor(container: HTMLElement, state: GameState, theme: Theme, onComplete: () => void) {
    this.container = container;
    this.state = state;
    this.theme = theme;
    this.onComplete = onComplete;
  }

  /** Renders the screen and schedules the transition to the winner screen. */
  show(): void {
    this.container.innerHTML = '';
    this.container.appendChild(this.buildScreen());
    setTimeout(() => this.onComplete(), 3000);
  }

  /** Builds the root screen element with title and score section. */
  private buildScreen(): HTMLElement {
    const screen = document.createElement('div');
    screen.className = `game-over-screen game-over-screen--${this.theme.name}`;
    screen.appendChild(this.buildTitle());
    screen.appendChild(this.buildScoreSection());
    return screen;
  }

  /** Creates the "Game over" heading element. */
  private buildTitle(): HTMLElement {
    const h1 = document.createElement('h1');
    h1.className = 'game-over__title';
    h1.textContent = 'Game over';
    return h1;
  }

  /** Creates the score section containing the "Final score" label and player pills. */
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

  /** Creates the row of score pills for all players. */
  private buildPills(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'game-over__pills';
    this.state.players.forEach(p => div.appendChild(this.buildPill(p)));
    return div;
  }

  /** Creates a single score pill for the given player. */
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

  /**
   * Returns the icon for a pill — a player icon `<img>` when the theme provides them,
   * otherwise a coloured dot `<span>`.
   */
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
