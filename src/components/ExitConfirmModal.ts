import type { ThemeName } from '../types/game.types';

/**
 * Modal dialog that asks the player to confirm they want to quit.
 * Styling adapts to the active theme (teal for coding, pink for gaming).
 */
export class ExitConfirmModal {
  private theme: ThemeName;
  private onBack: () => void;
  private onConfirm: () => void;
  private overlay: HTMLElement | null = null;

  /**
   * @param theme - Active theme name; determines button colours and label text.
   * @param onBack - Called when the player chooses to continue playing.
   * @param onConfirm - Called when the player confirms they want to exit.
   */
  constructor(theme: ThemeName, onBack: () => void, onConfirm: () => void) {
    this.theme = theme;
    this.onBack = onBack;
    this.onConfirm = onConfirm;
  }

  /** Appends the modal overlay to `document.body` and displays it. */
  show(): void {
    this.overlay = document.createElement('div');
    this.overlay.className = 'exit-modal-overlay';
    this.overlay.appendChild(this.buildModal());
    document.body.appendChild(this.overlay);
  }

  /** Removes the overlay from the DOM. */
  private dismiss(): void {
    this.overlay?.remove();
    this.overlay = null;
  }

  /** Builds the modal card element containing the prompt and action buttons. */
  private buildModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = `exit-modal exit-modal--${this.theme}`;
    modal.appendChild(this.buildTitle());
    modal.appendChild(this.buildButtons());
    return modal;
  }

  /** Creates the confirmation question paragraph. */
  private buildTitle(): HTMLElement {
    const p = document.createElement('p');
    p.className = 'exit-modal__title';
    p.textContent = 'Are you sure you want to quit the game?';
    return p;
  }

  /** Creates the button group with theme-appropriate labels. */
  private buildButtons(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'exit-modal__buttons';
    const backLabel = this.theme === 'gaming' ? 'No, back to game' : 'Back to game';
    const exitLabel = this.theme === 'gaming' ? 'Yes, quit game' : 'Exit game';
    div.appendChild(this.buildBtn(backLabel, 'exit-modal__btn exit-modal__btn--solid', () => {
      this.dismiss();
      this.onBack();
    }));
    div.appendChild(this.buildBtn(exitLabel, 'exit-modal__btn exit-modal__btn--outline', () => {
      this.dismiss();
      this.onConfirm();
    }));
    return div;
  }

  /**
   * Creates a single button element.
   * @param text - Button label.
   * @param cls - CSS class string to apply.
   * @param handler - Click handler.
   */
  private buildBtn(text: string, cls: string, handler: () => void): HTMLElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = cls;
    btn.addEventListener('click', handler);
    return btn;
  }
}
