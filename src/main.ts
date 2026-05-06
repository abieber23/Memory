import './styles/style.scss';
import { StartScreen } from './components/StartScreen';
import { SetupScreen } from './components/SetupScreen';
import { GameBoard } from './components/GameBoard';
import type { GameConfig } from './types/game.types';

/** Root application controller — owns the single shared container and drives screen transitions. */
class App {
  private container: HTMLElement;

  constructor() {
    const root = document.getElementById('app');
    if (!root) throw new Error('Root element #app not found in the DOM.');
    this.container = root;
    this.showStart();
  }

  /** Clears the container and renders the start screen. */
  private showStart(): void {
    this.container.innerHTML = '';
    this.container.className = 'app';
    new StartScreen(this.container, () => this.showSetup());
  }

  /** Clears the container and renders the setup/settings screen. */
  private showSetup(): void {
    this.container.innerHTML = '';
    this.container.className = 'app';
    new SetupScreen(this.container, config => this.startGame(config));
  }

  /**
   * Clears the container and starts a new game with the given configuration.
   * @param config - Player colours, board size and theme chosen on the setup screen.
   */
  private startGame(config: GameConfig): void {
    this.container.innerHTML = '';
    this.container.className = 'app app--game';
    new GameBoard(this.container, config, () => this.showSetup());
  }
}

new App();
