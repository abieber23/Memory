import type { ThemeName } from '../types/game.types';

export class ExitConfirmModal {
  private theme: ThemeName;
  private onBack: () => void;
  private onConfirm: () => void;
  private overlay: HTMLElement | null = null;

  constructor(theme: ThemeName, onBack: () => void, onConfirm: () => void) {
    this.theme = theme;
    this.onBack = onBack;
    this.onConfirm = onConfirm;
  }

  show(): void {
    this.overlay = document.createElement('div');
    this.overlay.className = 'exit-modal-overlay';
    this.overlay.appendChild(this.buildModal());
    document.body.appendChild(this.overlay);
  }

  private dismiss(): void {
    this.overlay?.remove();
    this.overlay = null;
  }

  private buildModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = `exit-modal exit-modal--${this.theme}`;
    modal.appendChild(this.buildTitle());
    modal.appendChild(this.buildButtons());
    return modal;
  }

  private buildTitle(): HTMLElement {
    const p = document.createElement('p');
    p.className = 'exit-modal__title';
    p.textContent = 'Are you sure you want to quit the game?';
    return p;
  }

  private buildButtons(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'exit-modal__buttons';
    const backLabel = this.theme === 'forest' ? 'No, back to game' : 'Back to game';
    const exitLabel = this.theme === 'forest' ? 'Yes, quit game' : 'Exit game';
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

  private buildBtn(text: string, cls: string, handler: () => void): HTMLElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = cls;
    btn.addEventListener('click', handler);
    return btn;
  }
}
