import './styles/style.scss';
import { SetupScreen } from './components/SetupScreen';
import { GameBoard } from './components/GameBoard';
import type { GameConfig } from './types/game.types';

class App {
  private container: HTMLElement;

  constructor() {
    this.container = document.getElementById('app')!;
    this.showSetup();
  }

  private showSetup(): void {
    this.container.innerHTML = '';
    this.container.className = 'app';
    new SetupScreen(this.container, config => this.startGame(config));
  }

  private startGame(config: GameConfig): void {
    this.container.innerHTML = '';
    this.container.className = 'app app--game';
    new GameBoard(this.container, config, () => this.showSetup());
  }
}

new App();
