import { Canvas, PrintOptions } from '../Canvas';
import { Point } from '../Point';
import { View } from '../View';
import {
  CONTACTS_ID,
  CONTACTS_VISIBLE_CLASS,
  CONTAINER_ID,
  COPY_EMAIL_BUTTON_ACTIVE_CLASS,
  COPY_EMAIL_BUTTON_ID,
  HEIGHT_VARIABLE,
  HOME_VIEW,
  OPEN_EMAIL_BUTTON_ID,
} from './Home.const';

type CanvasPrintOptions = {
  fontFamily: string;
};

type CanvasOptions = {
  width: number;
  height: number;
};

type LabelOptions = {
  position: Point;
  printOptions: PrintOptions
};

class Home extends View {
  static async init() {
    const canvas = await Canvas.init('logo');
    return new Home(canvas);
  }

  private canvas: Canvas;

  private debounce<T extends () => void>(fn: T, ms: number) {
    let isDebounced: boolean = false;

    return () => {
      if (isDebounced) {
        return;
      }

      setTimeout(() => {
        fn();
        isDebounced = false;
      }, ms);

      isDebounced = true;
    };
  }

  private getCurrentFontFamily() {
    const element = document.getElementById(CONTAINER_ID);
    const defaultFontFamily = 'monospace';

    if (element) {
      return getComputedStyle(element).fontFamily || defaultFontFamily;
    }

    return defaultFontFamily;
  }

  private getCanvasOptions(): CanvasOptions {
    const options: CanvasOptions = {
      height: 150,
      width: document.body.clientWidth,
    };

    if (this.isWidthLessThan(this.breakpoints.xl)) {
      options.height = 135;
    }

    if (this.isWidthLessThan(this.breakpoints.lg)) {
      options.height = 120;
    }

    return options;
  }

  private getNameOptions({ fontFamily }: CanvasPrintOptions): LabelOptions {
    const options: LabelOptions = {
      position: new Point(0, 50),
      printOptions: {
        fontSize: 50,
        fontFamily,
        align: 'center',
        color: '#fff',
        background: '#000',
        animate: true,
        speed: { min: 50, max: 50 },
        cursor: {
          start: { ttl: 600 },
          period: 400,
        },
      },
    };

    if (this.isXlScreen()) {
      options.printOptions.fontSize = 45;
      options.position = new Point(0, 45);
    }

    if (this.isLgScreen()) {
      options.printOptions.fontSize = 40;
      options.position = new Point(0, 35);
    }

    if (this.isMdScreen()) {
      options.printOptions.fontSize = 35;
      options.position = new Point(0, 30);
    }

    if (this.isSmScreen()) {
      options.printOptions.fontSize = 30;
      options.position = new Point(0, 35);
    }

    if (this.isWidthLessThan(350)) {
      options.printOptions.fontSize = 25;
      options.position = new Point(0, 35);
    }

    return options;
  }

  private getDevotionOptions({ fontFamily }: CanvasPrintOptions): LabelOptions {
    const options: LabelOptions = {
      position: new Point(0, 120),
      printOptions: {
        fontSize: 32,
        fontFamily,
        align: 'center',
        color: '#fff',
        background: '#000',
        animate: true,
        speed: { min: 50, max: 50 },
        cursor: {
          end: { ttl: Infinity, sync: false },
        },
      },
    };

    if (this.isXlScreen()) {
      options.printOptions.fontSize = 30;
      options.position = new Point(0, 105);
    }

    if (this.isLgScreen()) {
      options.printOptions.fontSize = 27;
      options.position = new Point(0, 100);
    }

    if (this.isMdScreen()) {
      options.printOptions.fontSize = 25;
      options.position = new Point(0, 90);
    }

    if (this.isSmScreen()) {
      options.printOptions.fontSize = 20;
      options.position = new Point(0, 80);
    }

    if (this.isWidthLessThan(350)) {
      options.printOptions.fontSize = 18;
      options.position = new Point(0, 70);
    }

    return options;
  }

  private hasClipboardAPI() {
    return Boolean(navigator.clipboard);
  }

  private async copyToClipboard(value: string) {
    if (this.hasClipboardAPI()) {
      try {
        await navigator.clipboard.writeText(value);
        this.copySuccessMessage();
      } catch (error) { } // eslint-disable-line no-empty
    }
  }

  private async copySuccessMessage() {
    const element = document.getElementById(COPY_EMAIL_BUTTON_ID);

    if (element) {
      element.classList.add(COPY_EMAIL_BUTTON_ACTIVE_CLASS);

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          element.classList.remove(COPY_EMAIL_BUTTON_ACTIVE_CLASS);
          resolve();
        }, 3000);
      });
    }
  }

  private showOpenEmailContact() {
    const openEmail = document.getElementById(OPEN_EMAIL_BUTTON_ID);
    const copyEmail = document.getElementById(COPY_EMAIL_BUTTON_ID);

    if (openEmail) {
      openEmail.style.display = 'flex';
    }
    if (copyEmail) {
      copyEmail.style.display = 'none';
    }
  }

  private async showContacts() {
    const contacts = document.getElementById(CONTACTS_ID);
    const animationDuration = 500;

    if (contacts?.classList.contains(CONTACTS_VISIBLE_CLASS)) {
      return;
    }

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        if (contacts) {
          requestAnimationFrame(() => {
            contacts.classList.add(CONTACTS_VISIBLE_CLASS);
            resolve();
          });
        }
      });
    });
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), animationDuration);
    });
  }

  private async drawLogo() {
    try {
      await this.canvas.clear();

      const fontFamily = this.getCurrentFontFamily();
      const nameOptions = this.getNameOptions({ fontFamily });
      const devotionOptions = this.getDevotionOptions({ fontFamily });
      const canvasOptions = this.getCanvasOptions();

      this.canvas.setWidth(canvasOptions.width);
      this.canvas.setHeight(canvasOptions.height);

      await this.canvas.printLine(
        'Aliaksei Yakubuk',
        nameOptions.position,
        nameOptions.printOptions,
      );

      await this.canvas.printLine(
        'Software Engineer',
        devotionOptions.position,
        devotionOptions.printOptions,
      );
    } catch (error) {
      if (error) {
        console.error(error); // eslint-disable-line no-console
      }
    }
  }

  private async startPresentation() {
    await this.drawLogo();
    await this.showContacts();
  }

  private getNextHeightVariable() {
    return `${window.innerHeight * 0.01}px`;
  }

  private getHeightVariable() {
    return document.documentElement?.style?.getPropertyValue(HEIGHT_VARIABLE);
  }

  private setHeightVariable(value: string) {
    document.documentElement?.style?.setProperty(HEIGHT_VARIABLE, value);
  }

  private isHeightVariableUpdated() {
    return this.getHeightVariable() !== this.getNextHeightVariable();
  }

  constructor(canvas: Canvas) {
    super();
    this.canvas = canvas;
  }

  public defineHeightVariable() {
    if (!this.getHeightVariable()) {
      this.setHeightVariable(this.getNextHeightVariable());
    }
  }

  public async listenClickCopyEmail(email: string) {
    const element = document.getElementById(COPY_EMAIL_BUTTON_ID);

    if (this.hasClipboardAPI() && element) {
      element.addEventListener('click', () => this.copyToClipboard(email));
    } else {
      this.showOpenEmailContact();
    }
  }

  public listenScreenResize() {
    const Observer = this.getResizeObserver();
    const element = document.getElementById(HOME_VIEW);

    if (!element) {
      return;
    }

    if (Observer) {
      const observer = new Observer(this.debounce(() => {
        if (this.isHeightVariableUpdated()) {
          this.setHeightVariable(this.getNextHeightVariable());
        } else {
          this.startPresentation();
        }
      }, 250));

      observer.observe(element);
    } else {
      this.startPresentation();
    }
  }
}

export default Home;
