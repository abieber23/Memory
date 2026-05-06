import type { BoardSize, GameConfig, PlayerColor, ThemeName } from '../types/game.types';
import previewCodeVibes from '../img/Preview_img_codevibes.png';
import previewGaming from '../img/Preview_img_gamingtheme.png';

const THEME_OPTIONS: Array<{ value: ThemeName; label: string; preview: string }> = [
  { value: 'coding', label: 'Code vibes theme', preview: previewCodeVibes },
  { value: 'gaming', label: 'Gaming theme', preview: previewGaming },
];

const SIZE_OPTIONS: { value: BoardSize; label: string }[] = [
  { value: '4x4', label: '16 cards' },
  { value: '4x6', label: '24 cards' },
  { value: '6x6', label: '36 cards' },
];

const PLAYER_OPTIONS: { value: PlayerColor; label: string }[] = [
  { value: 'blue', label: 'Blue' },
  { value: 'orange', label: 'Orange' },
];

/**
 * Settings screen where players configure theme, player colour and board size
 * before starting a game.
 */
export class SetupScreen {
  private container: HTMLElement;
  private onStart: (config: GameConfig) => void;
  private previewImg!: HTMLImageElement;
  private config: GameConfig = {
    player1Color: 'blue',
    player2Color: 'orange',
    boardSize: '4x4',
    theme: 'coding',
  };

  /**
   * @param container - Element to render the setup screen into.
   * @param onStart - Called with the finalised config when the player clicks Start.
   */
  constructor(container: HTMLElement, onStart: (config: GameConfig) => void) {
    this.container = container;
    this.onStart = onStart;
    this.render();
  }

  /** Clears the container and rebuilds the full setup screen DOM. */
  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'setup-screen';
    this.container.appendChild(this.buildHeader());
    this.container.appendChild(this.buildBody());
  }

  /** Creates the "Settings" page header. */
  private buildHeader(): HTMLElement {
    const header = document.createElement('header');
    header.className = 'setup__header';
    const h1 = document.createElement('h1');
    h1.className = 'setup__title';
    h1.textContent = 'Settings';
    const deco = document.createElement('div');
    deco.className = 'setup__title-deco';
    header.append(h1, deco);
    return header;
  }

  /** Creates the two-column body layout containing the options and preview. */
  private buildBody(): HTMLElement {
    const body = document.createElement('div');
    body.className = 'setup__body';
    body.appendChild(this.buildLeft());
    body.appendChild(this.buildRight());
    return body;
  }

  /** Creates the right column with the theme preview image and footer. */
  private buildRight(): HTMLElement {
    const right = document.createElement('div');
    right.className = 'setup__right';
    right.appendChild(this.buildPreview());
    right.appendChild(this.buildFooter());
    return right;
  }

  /** Creates the left column containing the three option sections. */
  private buildLeft(): HTMLElement {
    const left = document.createElement('div');
    left.className = 'setup__left';
    left.appendChild(this.buildThemeSection());
    left.appendChild(this.buildPlayerSection());
    left.appendChild(this.buildSizeSection());
    return left;
  }

  /** Creates the theme selection section with one radio per available theme. */
  private buildThemeSection(): HTMLElement {
    const section = this.buildSection('Game themes', '🎨', 'blue');
    THEME_OPTIONS.forEach(opt => {
      const checked = this.config.theme === opt.value;
      const el = this.buildRadio(opt.label, checked, () => {
        this.config = { ...this.config, theme: opt.value };
        this.render();
      });
      el.classList.add('setup__radio--theme');
      el.addEventListener('mouseenter', () => {
        this.previewImg.src = opt.preview;
      });
      el.addEventListener('mouseleave', () => {
        this.previewImg.src = THEME_OPTIONS.find(t => t.value === this.config.theme)!.preview;
      });
      section.appendChild(el);
    });
    return section;
  }

  /**
   * Creates the player-colour section.
   * Selecting a colour for player 1 automatically assigns the opposite to player 2.
   */
  private buildPlayerSection(): HTMLElement {
    const section = this.buildSection('Choose player', '🧑', 'purple');
    PLAYER_OPTIONS.forEach(opt => {
      const checked = this.config.player1Color === opt.value;
      section.appendChild(this.buildRadio(opt.label, checked, () => {
        this.config = {
          ...this.config,
          player1Color: opt.value,
          player2Color: opt.value === 'blue' ? 'orange' : 'blue',
        };
        this.render();
      }));
    });
    return section;
  }

  /** Creates the board-size selection section with one radio per size option. */
  private buildSizeSection(): HTMLElement {
    const section = this.buildSection('Board size', '🃏', 'teal');
    SIZE_OPTIONS.forEach(opt => {
      const checked = this.config.boardSize === opt.value;
      section.appendChild(this.buildRadio(opt.label, checked, () => {
        this.config = { ...this.config, boardSize: opt.value };
        this.render();
      }));
    });
    return section;
  }

  /**
   * Creates a labelled section container.
   * @param title - Section heading text.
   * @param icon - Emoji displayed next to the title.
   * @param color - BEM modifier used to apply the accent colour.
   */
  private buildSection(title: string, icon: string, color: string): HTMLElement {
    const section = document.createElement('section');
    section.className = `setup__section setup__section--${color}`;
    const h2 = document.createElement('h2');
    h2.className = 'setup__section-title';
    h2.innerHTML = `<span class="setup__section-icon">${icon}</span>${title}`;
    section.appendChild(h2);
    return section;
  }

  /**
   * Creates a single radio-style option row.
   * @param label - Display text for the option.
   * @param checked - Whether this option is currently selected.
   * @param onClick - Called when the row is clicked.
   */
  private buildRadio(label: string, checked: boolean, onClick: () => void): HTMLElement {
    const div = document.createElement('div');
    div.className = `setup__radio${checked ? ' setup__radio--checked' : ''}`;
    const circle = document.createElement('span');
    circle.className = 'radio__circle';
    const text = document.createElement('span');
    text.className = 'radio__label';
    text.textContent = label;
    div.append(circle, text);
    if (checked) {
      const arrow = document.createElement('span');
      arrow.className = 'radio__arrow';
      arrow.textContent = '→';
      div.appendChild(arrow);
    }
    div.addEventListener('click', onClick);
    return div;
  }

  /** Creates the theme preview image that updates when a different theme is selected. */
  private buildPreview(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'setup__preview';
    const img = document.createElement('img');
    img.src = THEME_OPTIONS.find(t => t.value === this.config.theme)?.preview ?? previewCodeVibes;
    img.className = 'setup__preview-img';
    img.alt = 'Theme preview';
    this.previewImg = img;
    div.appendChild(img);
    return div;
  }

  /** Creates the footer row containing the config summary and the Start button. */
  private buildFooter(): HTMLElement {
    const footer = document.createElement('footer');
    footer.className = 'setup__footer';
    footer.appendChild(this.buildSummary());
    footer.appendChild(this.buildStartBtn());
    return footer;
  }

  /** Creates the summary line that lists the currently selected theme, player and board size. */
  private buildSummary(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'setup__summary';
    this.getSummaryLabels().forEach((text, i, arr) => {
      div.appendChild(this.buildSummaryItem(text));
      if (i < arr.length - 1) div.appendChild(this.buildSummarySep());
    });
    return div;
  }

  /** Returns the three human-readable labels for the current configuration choices. */
  private getSummaryLabels(): string[] {
    return [
      THEME_OPTIONS.find(t => t.value === this.config.theme)?.label ?? '',
      PLAYER_OPTIONS.find(p => p.value === this.config.player1Color)?.label ?? '',
      SIZE_OPTIONS.find(s => s.value === this.config.boardSize)?.label ?? '',
    ];
  }

  /** Creates a single text span for the summary line. */
  private buildSummaryItem(text: string): HTMLElement {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }

  /** Creates the "/" separator span used between summary items. */
  private buildSummarySep(): HTMLElement {
    const sep = document.createElement('span');
    sep.className = 'summary__sep';
    sep.textContent = '/';
    return sep;
  }

  /** Creates the Start button that submits the current configuration. */
  private buildStartBtn(): HTMLElement {
    const btn = document.createElement('button');
    btn.className = 'setup__start-btn';
    btn.innerHTML = `<span class="start-icon">▶</span>Start`;
    btn.addEventListener('click', () => this.onStart(this.config));
    return btn;
  }
}
