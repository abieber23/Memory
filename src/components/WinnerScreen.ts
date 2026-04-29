import type { GameState, Theme } from '../types/game.types';
import { getWinner } from '../services/GameState';
import winnerBlue from '../img/CodingVibeTheme/Code_theme_winner_blue.png';
import winnerOrange from '../img/CodingVibeTheme/Code_theme_winner_orange.png';
import winnerTrophy from '../img/GamingTheme/Game_Theme_Winner.png';

const CONFETTI_COLORS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#e67e22'];

export class WinnerScreen {
  private container: HTMLElement;
  private state: GameState;
  private theme: Theme;
  private onExit: () => void;

  constructor(container: HTMLElement, state: GameState, theme: Theme, onExit: () => void) {
    this.container = container;
    this.state = state;
    this.theme = theme;
    this.onExit = onExit;
  }

  show(): void {
    this.container.innerHTML = '';
    this.container.appendChild(this.buildScreen());
  }

  private buildScreen(): HTMLElement {
    const screen = document.createElement('div');
    screen.className = `winner-screen winner-screen--${this.theme.name}`;
    if (this.theme.name === 'ocean') screen.appendChild(this.buildConfetti());
    screen.appendChild(this.buildContent());
    return screen;
  }

  private buildConfetti(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'confetti';
    for (let i = 0; i < 70; i++) div.appendChild(this.buildPiece());
    return div;
  }

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

  private buildContent(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'winner-screen__content';
    div.appendChild(this.buildText());
    div.appendChild(this.buildIcon());
    div.appendChild(this.buildBtn());
    return div;
  }

  private buildText(): HTMLElement {
    const winner = getWinner(this.state);
    const div = document.createElement('div');
    const label = document.createElement('p');
    label.className = 'winner-screen__label';
    label.textContent = 'The winner is';
    const name = document.createElement('p');
    name.className = `winner-screen__name winner-screen__name--${winner?.color ?? 'blue'}`;
    if (this.theme.name === 'forest') {
      name.textContent = winner
        ? `${winner.color.charAt(0).toUpperCase() + winner.color.slice(1)} Player`
        : "It's a tie!";
    } else {
      name.textContent = winner ? `${winner.color.toUpperCase()} PLAYER` : "IT'S A TIE!";
    }
    div.append(label, name);
    return div;
  }

  private buildIcon(): HTMLElement {
    const winner = getWinner(this.state);
    const img = document.createElement('img');
    img.src = this.theme.name === 'forest'
      ? winnerTrophy
      : winner?.color === 'orange' ? winnerOrange : winnerBlue;
    img.className = 'winner-screen__icon';
    img.alt = '';
    return img;
  }

  private buildBtn(): HTMLElement {
    const btn = document.createElement('button');
    btn.className = 'winner-screen__btn';
    btn.textContent = this.theme.name === 'forest' ? 'Home' : 'Back to start';
    btn.addEventListener('click', this.onExit);
    return btn;
  }
}
