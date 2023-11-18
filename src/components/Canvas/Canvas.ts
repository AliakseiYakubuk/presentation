/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */

import { Point } from '../Point';
import { Rectangle } from '../Rectangle';

type PrintOptions = {
  fontSize?: number,
  fontFamily?: string,
  align?: CanvasTextAlign,
  color?: string,
  background?: string,
};

type ProgressivePrintOptions = PrintOptions & {
  minDelay?: number,
  maxDelay?: number,
};
class Canvas {
  static async init(id: string) {
    return new Promise<Canvas>((resolve) => {
      window.addEventListener('load', () => {
        const canvas = document.getElementById(id) as (HTMLCanvasElement | null);
        return resolve(new Canvas(canvas));
      });
    });
  }

  private readonly element: HTMLCanvasElement;

  private readonly context: CanvasRenderingContext2D;

  private checkCanvasExists(htmlCanvas: HTMLCanvasElement | null) {
    if (!htmlCanvas) {
      throw new Error('Cannot create canvas');
    }
  }

  private checkContextExists(context: CanvasRenderingContext2D | null) {
    if (!context) {
      throw new Error('Cannot get context');
    }
  }

  private getContext(htmlCanvas: HTMLCanvasElement | null) {
    return htmlCanvas?.getContext
      ? htmlCanvas.getContext('2d') || null
      : null;
  }

  // private adjustSize() {
  //   this.element.width = document.body.clientWidth;
  //   this.element.height = document.body.clientHeight;
  // }

  private randomNumberInRange(min: number, max: number) {
    return min + (max - min) * Math.random();
  }

  private async waitFor(ms: number) {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private getFontFamily(options?: PrintOptions) {
    return options?.fontFamily || 'serif';
  }

  private getFontSize(options?: PrintOptions) {
    return options?.fontSize || 10;
  }

  private getTextAlign(options?: PrintOptions) {
    const align = options?.align || 'center';
    if (align !== 'center') {
      throw new Error('Only text align by center is supported');
    }
    return align;
  }

  private getTextColor(options?: PrintOptions) {
    return options?.color || '#000';
  }

  private getBackground(options?: PrintOptions) {
    return options?.background || 'rgba(255, 255, 255, 0)';
  }

  private getFont(options?: PrintOptions) {
    return `${this.getFontSize(options)}px ${this.getFontFamily(options)}`;
  }

  private getMinDelay(options?: ProgressivePrintOptions) {
    return options?.minDelay || 0;
  }

  private getMaxDelay(options?: ProgressivePrintOptions) {
    return options?.maxDelay || 0;
  }

  private getRectangleForText(textPosition: Point, options?: PrintOptions) {
    const halfHeight = this.getFontSize(options) / 2;
    const topLeft = new Point(textPosition.x, textPosition.y - halfHeight);
    const bottomRight = new Point(this.element.width, textPosition.y + halfHeight);
    return new Rectangle(topLeft, bottomRight);
  }

  private measureText(input: string, options?: PrintOptions) {
    const prevTextAlign = this.context.textAlign;
    const prevFont = this.context.font;

    this.context.textAlign = 'left';
    this.context.font = this.getFont(options);

    const width = input
      .split('')
      .reduce((total, char) => (total + this.context.measureText(char).width), 0);

    this.context.textAlign = prevTextAlign;
    this.context.font = prevFont;

    return { width };
  }

  private drawRect(rectangle: Rectangle, options?: PrintOptions) {
    this.context.fillStyle = this.getBackground(options);
    this.context.fillRect(
      rectangle.topLeft.x,
      rectangle.topLeft.y,
      rectangle.width,
      rectangle.height,
    );
  }

  private drawText(input: string, rectangle: Rectangle, options?: PrintOptions) {
    this.context.textAlign = this.getTextAlign(options);
    this.context.textBaseline = 'middle';
    this.context.fillStyle = this.getTextColor(options);
    this.context.font = this.getFont(options);
    this.context.fillText(input, rectangle.width / 2, rectangle.topLeft.y + rectangle.height / 2);
  }

  // eslint-disable-next-line max-len
  private async drawTextProgressively(input: string, rectangle: Rectangle, options?: ProgressivePrintOptions) {
    const metadata = this.measureText(input, options);
    const positionX = (rectangle.width / 2) - (metadata.width / 2);
    const positionY = rectangle.topLeft.y + rectangle.height / 2;
    const minDelay = this.getMinDelay(options);
    const maxDelay = this.getMaxDelay(options);

    this.context.textAlign = 'left';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = this.getTextColor(options);
    this.context.font = this.getFont(options);

    let index = 0;
    let position = positionX;

    for (index; index < input.length; index += 1) {
      const char = input[index];
      requestAnimationFrame(() => {
        const { width } = this.measureText(char, options);
        this.context.fillText(char, position, positionY);
        position += width;
      });
      await this.waitFor(this.randomNumberInRange(minDelay, maxDelay));
    }

    // input.split('').reduce((position, char) => {
    //   const { width } = this.measureText(char, options);

    //   this.context.fillText(char, position, positionY);
    //   return position + width;
    // }, positionX);
  }

  constructor(htmlCanvas: HTMLCanvasElement | null) {
    const context = this.getContext(htmlCanvas);

    this.checkCanvasExists(htmlCanvas);
    this.checkContextExists(context);
    this.element = htmlCanvas as HTMLCanvasElement;
    this.context = context as CanvasRenderingContext2D;
    console.log(this.context);
  }

  public print(input: string, position: Point, options?: PrintOptions) {
    const rectangle = this.getRectangleForText(position, options);
    this.drawRect(rectangle, options);
    this.drawText(input, rectangle, options);
  }

  // eslint-disable-next-line max-len
  public async printProgressively(input: string, position: Point, options?: ProgressivePrintOptions) {
    const rectangle = this.getRectangleForText(position, options);
    this.drawRect(rectangle, options);
    await this.drawTextProgressively(input, rectangle, options);
  }

  public print2 = async (input: string, options?: PrintOptions) => {
    let acc = '';
    let index = 0;
    // this.context.fillStyle = '#fff';
    // this.context.font = this.getFont(options);
    // this.context.textAlign = align;
    // this.context.textBaseline = 'middle';
    // this.context.fillRect(0, 0, this.element.width, 100);
    // this.context.fillStyle = color;
    // this.context.fillText(input, this.element.width / 2, 50);
    // this.context.clearRect(0, 0, this.element.width, 100);

    for (index; index < input.length; index += 1) {
      const char = input[index];
      acc = `${acc}${char}`;
      requestAnimationFrame(() => {
        // this.context.clearRect(0, 0, this.element.width, 100);
        // this.context.fillStyle = '#fff';
        // this.context.fillRect(0, 0, this.element.width, 100);
        // this.context.fillStyle = '#000';
        // this.context.fillText(acc, this.element.width, 100);
      });
      await this.waitFor(this.randomNumberInRange(50, 50));
    }
  };
}

export default Canvas;
