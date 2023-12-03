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

class About extends View {
  static async init() {
    const canvas = await Canvas.init('about-me');
    return new About(canvas);
  }

  private canvas: Canvas;

  private getCanvasOptions(): CanvasOptions {
    const options: CanvasOptions = {
      height: 540,
      width: 450,
    };

    if (this.isMdScreen() || this.isSmScreen()) {
      options.width = document.body.clientWidth;
      options.height = 570;
    }

    return options;
  }

  private getOptions(): LabelOptions {
    const options: LabelOptions = {
      position: new Point(0, 50),
      printOptions: {
        fontSize: 27,
        fontFamily: 'ubuntu',
        lineHeight: 34,
        itemSpacing: 54,
        align: 'right',
        color: '#fff',
        background: '#000',
        animate: true,
        speed: { min: 20, max: 20 },
        padding: { left: 8, right: 32 },
        // cursor: { end: { ttl: 0 } },
      },
    };

    if (this.isMdScreen() || this.isSmScreen()) {
      options.printOptions.fontSize = 23;
      options.printOptions.lineHeight = 25;
      options.printOptions.align = 'left';
      options.printOptions.padding = { left: 32, right: 32 };
    }

    if (this.isLgScreen()) {
      options.printOptions.align = 'left';
    }

    return options;
  }

  private getDescription() {
    const node = document.getElementById('about-me');
    return (node?.textContent || '').trim();
  }

  constructor(canvas: Canvas) {
    super();
    this.canvas = canvas;
  }

  public async draw() {
    const options = this.getOptions();
    const canvasOptions = this.getCanvasOptions();
    const description = this.getDescription();

    this.canvas.setWidth(canvasOptions.width);
    this.canvas.setHeight(canvasOptions.height);

    await this.canvas.print(description, new Point(0, 25), options.printOptions);
  }
}

export default About;
