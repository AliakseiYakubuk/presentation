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

class Skills extends View {
  static async init() {
    const canvas = await Canvas.init('intro');
    return new Skills(canvas);
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
        align: 'left',
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
      options.printOptions.align = 'right';
      options.printOptions.padding = { left: 32, right: 32 };
    }

    if (this.isLgScreen()) {
      options.printOptions.align = 'right';
    }

    return options;
  }

  private getItems() {
    const listNode = document.getElementById('skills-list');
    const items: string[] = [];

    if (listNode) {
      const elements = listNode.getElementsByTagName('li');
      for (const element of elements) {
        items.push(element.textContent || '');
      }
    }

    return items.filter(Boolean);
  }

  constructor(canvas: Canvas) {
    super();
    this.canvas = canvas;
  }

  public async draw() {
    const options = this.getOptions();
    const canvasOptions = this.getCanvasOptions();
    const items = this.getItems();

    this.canvas.setWidth(canvasOptions.width);
    this.canvas.setHeight(canvasOptions.height);

    await this.canvas.printList(items, new Point(0, 25), options.printOptions);
  }
}

export default Skills;
