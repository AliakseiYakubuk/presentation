import { Canvas, PrintOptions } from '../Canvas';
import { Point } from '../Point';

type CanvasOptions = {
  width: number;
  height: number;
};

type LabelOptions = {
  position: Point;
  printOptions: PrintOptions
};

class Home {
  static async init() {
    const canvas = await Canvas.init('logo');
    return new Home(canvas);
  }

  private canvas: Canvas;

  private isSmallScreen() {
    return document.body.clientWidth <= 550;
  }

  private getCanvasOptions(): CanvasOptions {
    const options: CanvasOptions = {
      height: 150,
      width: document.body.clientWidth,
    };

    if (this.isSmallScreen()) {
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
        cursor: { start: { ttl: 400 } },
      },
    };

    if (this.isSmallScreen()) {
      options.printOptions.fontSize = 40;
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
        cursor: { end: { ttl: Infinity, sync: false } },
      },
    };

    if (this.isSmallScreen()) {
      options.printOptions.fontSize = 25;
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
            // contacts.style.animationName = 'appear';
            contacts.classList.add('contacts_visible');

            resolve(true);
          });
        }
      });
    });
  }

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public async draw() {
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
  }
}

export default Home;
