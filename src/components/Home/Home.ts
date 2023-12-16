import { Canvas, PrintOptions } from '../Canvas';
import { Point } from '../Point';
import { View } from '../View';

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

  private getCanvasOptions(): CanvasOptions {
    const options: CanvasOptions = {
      height: 150,
      width: document.body.clientWidth,
    };

    if (this.isMdScreen() || this.isSmScreen()) {
      options.height = 120;
    }
    return options;
  }

  private getNameOptions(): LabelOptions {
    const options: LabelOptions = {
      position: new Point(0, 50),
      printOptions: {
        fontSize: 55,
        fontFamily: 'ubuntu',
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

    if (this.isMdScreen() || this.isSmScreen()) {
      options.printOptions.fontSize = 40;
      options.position = new Point(0, 40);
    }

    if (this.isWidthLessThan(350)) {
      options.printOptions.fontSize = 30;
      options.position = new Point(0, 40);
    }

    return options;
  }

  private getDevotionOptions(): LabelOptions {
    const options: LabelOptions = {
      position: new Point(0, 110),
      printOptions: {
        fontSize: 35,
        fontFamily: 'ubuntu',
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

    if (this.isSmScreen() || this.isMdScreen()) {
      options.printOptions.fontSize = 25;
      options.position = new Point(0, 90);
    }

    if (this.isWidthLessThan(350)) {
      options.printOptions.fontSize = 20;
      options.position = new Point(0, 90);
    }

    return options;
  }

  private showContacts() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const contacts = document.getElementById('contacts');
        if (contacts) {
          requestAnimationFrame(() => {
            contacts.classList.add('contacts_visible');
            resolve(true);
          });
        }
      });
    });
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
    const element = document.getElementById('copy_email');
    const className = 'copy_email_active';

    if (element) {
      element.classList.add(className);

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          element.classList.remove(className);
          resolve();
        }, 3000);
      });
    }
  }

  private showOpenEmailContact() {
    const openEmail = document.getElementById('open_email');
    const copyEmail = document.getElementById('copy_email');

    if (openEmail) {
      openEmail.style.display = 'flex';
    }
    if (copyEmail) {
      copyEmail.style.display = 'none';
    }
  }

  constructor(canvas: Canvas) {
    super();
    this.canvas = canvas;
  }

  public async drawLogo() {
    try {
      this.canvas.clear();

      const nameOptions = this.getNameOptions();
      const devotionOptions = this.getDevotionOptions();
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

      await this.showContacts();
    } catch (error) {
      if (error) {
        console.error(error); // eslint-disable-line no-console
      }
    }
  }

  public async listenClickCopyEmail(email: string) {
    const element = document.getElementById('copy_email');

    if (this.hasClipboardAPI() && element) {
      element.addEventListener('click', () => this.copyToClipboard(email));
    } else {
      this.showOpenEmailContact();
    }
  }

  public listenScreenResize() {
    const element = document.getElementById('container');

    if (element) {
      const observer = new ResizeObserver(() => this.drawLogo());
      observer.observe(element);
    }
  }
}

export default Home;
