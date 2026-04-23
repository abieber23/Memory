import type { BoardSize, GameConfig, PlayerColor, ThemeName } from '../types/game.types';
import { THEMES } from '../data/themes';

export class SetupScreen {
  private container: HTMLElement;
  private onStart: (config: GameConfig) => void;
  private config: GameConfig = {
    player1Color: 'blue',
    player2Color: 'orange',
    boardSize: '4x4',
    theme: 'ocean',
  };

  constructor(container: HTMLElement, onStart: (config: GameConfig) => void) {
    this.container = container;
    this.onStart = onStart;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'setup-screen';
    this.container.appendChild(this.buildTitle());
    this.container.appendChild(this.buildColorSection());
    this.container.appendChild(this.buildSizeSection());
    this.container.appendChild(this.buildThemeSection());
    this.container.appendChild(this.buildStartButton());
  }

  private buildTitle(): HTMLElement {
    const h1 = document.createElement('h1');
    h1.className = 'setup__title';
    h1.textContent = 'Memory';
    return h1;
  }

  private buildColorSection(): HTMLElement {
    const section = this.buildSection('Player Colors');
    section.appendChild(this.buildColorPicker());
    return section;
  }

  private buildColorPicker(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'color-picker';
    (['blue', 'orange'] as PlayerColor[]).forEach(color => {
      div.appendChild(this.buildColorBtn(color));
    });
    return div;
  }

  private buildColorBtn(color: PlayerColor): HTMLElement {
    const btn = document.createElement('button');
    btn.className = `color-btn color-btn--${color}`;
    const isP1 = this.config.player1Color === color;
    btn.innerHTML = `<span class="color-btn__label">Player ${isP1 ? 1 : 2}</span>`;
    if (isP1) btn.classList.add('active');
    btn.title = `Set Player 1 to ${color}`;
    btn.addEventListener('click', () => this.selectColor(color));
    return btn;
  }

  private selectColor(color: PlayerColor): void {
    this.config = {
      ...this.config,
      player1Color: color,
      player2Color: color === 'blue' ? 'orange' : 'blue',
    };
    this.render();
  }

  private buildSizeSection(): HTMLElement {
    const section = this.buildSection('Board Size');
    const group = document.createElement('div');
    group.className = 'option-group';
    (['4x4', '4x6', '6x6'] as BoardSize[]).forEach(size => {
      group.appendChild(this.buildOptionBtn(size, 'boardSize', size));
    });
    section.appendChild(group);
    return section;
  }

  private buildThemeSection(): HTMLElement {
    const section = this.buildSection('Theme');
    const group = document.createElement('div');
    group.className = 'option-group';
    Object.values(THEMES).forEach(theme => {
      group.appendChild(this.buildOptionBtn(theme.name, 'theme', theme.label));
    });
    section.appendChild(group);
    return section;
  }

  private buildOptionBtn(value: string, field: 'boardSize' | 'theme', label: string): HTMLElement {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = label;
    if (this.config[field] === value) btn.classList.add('active');
    btn.addEventListener('click', () => {
      this.config = { ...this.config, [field]: value as BoardSize & ThemeName };
      this.render();
    });
    return btn;
  }

  private buildSection(title: string): HTMLElement {
    const section = document.createElement('section');
    section.className = 'setup__section';
    const h2 = document.createElement('h2');
    h2.textContent = title;
    section.appendChild(h2);
    return section;
  }

  private buildStartButton(): HTMLElement {
    const btn = document.createElement('button');
    btn.className = 'start-btn';
    btn.textContent = 'Start Game';
    btn.addEventListener('click', () => this.onStart(this.config));
    return btn;
  }
}
