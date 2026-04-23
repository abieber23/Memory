import controllerImg from '../img/stadia_controller.png';
import controllerSmall from '../img/stadia_controller_small.png';

export class StartScreen {
  private container: HTMLElement;
  private onPlay: () => void;

  constructor(container: HTMLElement, onPlay: () => void) {
    this.container = container;
    this.onPlay = onPlay;
    this.render();
  }

  private render(): void {
    this.container.className = 'start-screen';
    this.container.innerHTML = '';
    this.container.appendChild(this.buildWatermark());
    this.container.appendChild(this.buildContent());
  }

  private buildWatermark(): HTMLElement {
    const img = document.createElement('img');
    img.src = controllerImg;
    img.className = 'start-screen__watermark';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    return img;
  }

  private buildContent(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'start-screen__content';
    div.appendChild(this.buildEyebrow());
    div.appendChild(this.buildHeadline());
    div.appendChild(this.buildPlayButton());
    return div;
  }

  private buildEyebrow(): HTMLElement {
    const p = document.createElement('p');
    p.className = 'start-screen__eyebrow';
    p.textContent = "It's play time.";
    return p;
  }

  private buildHeadline(): HTMLElement {
    const h1 = document.createElement('h1');
    h1.className = 'start-screen__headline';
    h1.textContent = 'Ready to play?';
    return h1;
  }

  private buildPlayButton(): HTMLElement {
    const btn = document.createElement('button');
    btn.className = 'start-screen__play-btn';
    const icon = document.createElement('img');
    icon.src = controllerSmall;
    icon.className = 'play-btn__icon';
    icon.alt = '';
    const label = document.createElement('span');
    label.textContent = 'Play';
    const arrow = document.createElement('span');
    arrow.className = 'play-btn__arrow';
    arrow.textContent = '→';
    btn.append(icon, label, arrow);
    btn.addEventListener('click', this.onPlay);
    return btn;
  }
}
