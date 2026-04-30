import type { GameState, Theme } from '../types/game.types';
import { getWinner } from '../services/GameState';
import winnerBlue from '../img/CodingVibeTheme/Code_theme_winner_blue.png';
import winnerOrange from '../img/CodingVibeTheme/Code_theme_winner_orange.png';
import winnerTrophy from '../img/GamingTheme/Game_Theme_Winner.png';

const CONFETTI_COLORS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#e67e22'];

/**
 * Full-page winner screen shown after the game-over transition.
 * The coding theme displays confetti and a player-specific image;
 * the gaming theme shows a shared trophy image.
 */
export class WinnerScreen {
  private container: HTMLElement;
  private state: GameState;
  private theme: Theme;
  private onExit: () => void;

  /**
   * @param container - Element to render into (its contents will be replaced).
   * @param state - Final game state used to determine and display the winner.
   * @param theme - Active theme; controls layout, imagery and button label.
   * @param onExit - Called when the player clicks the "Home" / "Back to start" button.
   */
  constructor(container: HTMLElement, state: GameState, theme: Theme, onExit: () => void) {
    this.container = container;
    this.state = state;
    this.theme = theme;
    this.onExit = onExit;
  }

  /** Renders the winner screen, replacing the container's current content. */
  show(): void {
    this.container.innerHTML = '';
    this.container.appendChild(this.buildScreen());
  }

  /** Builds the root screen element, adding confetti for the coding theme. */
  private buildScreen(): HTMLElement {
    const screen = document.createElement('div');
    screen.className = `winner-screen winner-screen--${this.theme.name}`;
    if (this.theme.name === 'coding') screen.appendChild(this.buildConfetti());
    screen.appendChild(this.buildContent());
    return screen;
  }

  /** Creates the confetti container populated with randomly positioned pieces. */
  private buildConfetti(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'confetti';
    for (let i = 0; i < 70; i++) div.appendChild(this.buildPiece());
    return div;
  }

  /** Creates a single confetti piece with randomised position, size, colour and timing. */
  private buildPiece(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'confetti__piece';
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 35}%`;
    el.style.width = `${6 + Math.random() * 8}px`;
    el.style.height = `${10 + Math.random() * 14}px`;
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.style.animationDelay = `${Math.random() * 2.5}s`;
    el.style.animationDuration = `${1.8 + Math.random() * 1.5}s`;
    return el;
  }

  /** Creates the centred content block with winner text, icon and button. */
  private buildContent(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'winner-screen__content';
    div.appendChild(this.buildText());
    div.appendChild(this.buildIcon());
    div.appendChild(this.buildBtn());
    return div;
  }

  /** Creates the "The winner is" label and the coloured winner-name paragraph. */
  private buildText(): HTMLElement {
    const winner = getWinner(this.state);
    const div = document.createElement('div');
    const label = document.createElement('p');
    label.className = 'winner-screen__label';
    label.textContent = 'The winner is';
    const name = document.createElement('p');
    name.className = `winner-screen__name winner-screen__name--${winner?.color ?? 'blue'}`;
    if (this.theme.name === 'gaming') {
      name.textContent = winner
        ? `${winner.color.charAt(0).toUpperCase() + winner.color.slice(1)} Player`
        : "It's a tie!";
    } else {
      name.textContent = winner ? `${winner.color.toUpperCase()} PLAYER` : "IT'S A TIE!";
    }
    div.append(label, name);
    return div;
  }

  /**
   * Creates the winner image element.
   * Gaming theme always uses the shared trophy; coding theme uses a player-specific image.
   */
  private buildIcon(): HTMLElement {
    const winner = getWinner(this.state);
    const img = document.createElement('img');
    img.src = this.theme.name === 'gaming'
      ? winnerTrophy
      : winner?.color === 'orange' ? winnerOrange : winnerBlue;
    img.className = 'winner-screen__icon';
    img.alt = '';
    return img;
  }

  /** Creates the navigation button that returns the player to the start screen. */
  private buildBtn(): HTMLElement {
    const btn = document.createElement('button');
    btn.className = 'winner-screen__btn';
    btn.textContent = this.theme.name === 'gaming' ? 'Home' : 'Back to start';
    btn.addEventListener('click', this.onExit);
    return btn;
  }
}
