import { View } from '../View';

type PresentationProps = {
  viewElementId: string;
  backgroundElementId: string;
  contentElementId: string;
  backgroundActiveClass: string;
  contentActiveClass: string;
};

class Presentation extends View {
  private intersectionObserver: IntersectionObserver | null = null;

  private viewElement: HTMLElement | null = null;

  private backgroundElement: HTMLElement | null = null;

  private contentElement: HTMLElement | null = null;

  private backgroundActiveClass: string = '';

  private contentActiveClass: string = '';

  private activateBackground(value: boolean) {
    if (!this.backgroundElement) {
      return;
    }

    if (value) {
      this.backgroundElement.classList.add(this.backgroundActiveClass);
    } else {
      this.backgroundElement.classList.remove(this.backgroundActiveClass);
    }
  }

  private activateContent(value: boolean) {
    if (!this.contentElement) {
      return;
    }

    if (value) {
      this.contentElement.classList.add(this.contentActiveClass);
    } else {
      this.contentElement.classList.remove(this.contentActiveClass);
    }
  }

  private getThreshold() {
    if (this.isSmScreen() || this.isMdScreen()) {
      return [0, 1];
    }
    return [0.2, 0.8];
  }

  constructor(options: PresentationProps) {
    super();

    this.viewElement = document.getElementById(options.viewElementId);
    this.backgroundElement = document.getElementById(options.backgroundElementId);
    this.contentElement = document.getElementById(options.contentElementId);
    this.backgroundActiveClass = options.backgroundActiveClass;
    this.contentActiveClass = options.contentActiveClass;
  }

  public listenIntersection() {
    const Observer = this.getIntersectionObserver();

    if (this.viewElement && Observer) {
      const handlerIntersection = (entries: IntersectionObserverEntry[]) => {
        requestAnimationFrame(() => {
          const isIntersecting = entries?.[0]?.isIntersecting;
          this.activateBackground(isIntersecting);
          this.activateContent(isIntersecting);
        });
      };

      this.intersectionObserver = new Observer(handlerIntersection, {
        root: null,
        threshold: this.getThreshold(),
      });
      this.intersectionObserver.observe(this.viewElement);
    } else {
      this.activateBackground(true);
      this.activateContent(true);
    }
  }
}

export default Presentation;
