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
  minDelay?: number,
  maxDelay?: number,
  animate?: boolean
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
    return options?.align || 'center';
  }

  private getTextColor(options?: PrintOptions) {
    return options?.color || '#000';
  }

  private getBackground(options?: PrintOptions) {
    return options?.background || '#FFF';
  }

  private getFont(options?: PrintOptions) {
    return `${this.getFontSize(options)}px ${this.getFontFamily(options)}`;
  }

  private getMinDelay(options?: PrintOptions) {
    return options?.minDelay || 0;
  }

  private getMaxDelay(options?: PrintOptions) {
    return options?.maxDelay || 0;
  }

  private getRectangleForText(textPosition: Point, options?: PrintOptions) {
    const halfHeight = this.getFontSize(options) / 2;
    const topLeft = new Point(textPosition.x, textPosition.y - halfHeight);
    const bottomRight = new Point(this.element.width, textPosition.y + halfHeight);
    return new Rectangle(topLeft, bottomRight);
  }

  private measureText(input: string, options?: PrintOptions) {
    const context = document.createElement('canvas').getContext('2d')!;

    context.textAlign = 'left';
    context.font = this.getFont(options);

    const width = input
      .split('')
      .reduce((total, char) => (total + context.measureText(char).width), 0);

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

  private drawCursor(posx: Point, options?: PrintOptions) {
    const height = this.getFontSize(options);
    const topLeft = new Point(posx.x, posx.y - height / 2);
    const bottomRight = new Point(posx.x + height / 2, posx.y + height / 2);
    const rectangle = new Rectangle(topLeft, bottomRight);

    this.drawRect(rectangle, { ...options, background: this.getTextColor(options) });
  }

  private removeCursor(posx: Point, options?: PrintOptions) {
    // const prevGlobalCompositeOperation = this.context.globalCompositeOperation;
    // this.context.globalCompositeOperation = 'destination-over';
    // debugger;
    this.drawCursor(posx, { ...options, color: this.getBackground(options) });
    // this.context.globalCompositeOperation = prevGlobalCompositeOperation;
  }

  private drawText(input: string, origin: Point, options?: PrintOptions) {
    this.context.textAlign = this.getTextAlign(options);
    this.context.textBaseline = 'middle';
    this.context.fillStyle = this.getTextColor(options);
    this.context.font = this.getFont(options);
    this.context.fillText(input, origin.x, origin.y);
  }

  private drawTextLine(input: string, rectangle: Rectangle, options?: PrintOptions) {
    const positionX = rectangle.width / 2;
    const positionY = rectangle.topLeft.y + rectangle.height / 2;

    this.drawText(input, new Point(positionX, positionY), options);
  }

  // eslint-disable-next-line max-len
  private async drawTextLineProgressively(input: string, rectangle: Rectangle, options?: PrintOptions) {
    const minDelay = this.getMinDelay(options);
    const maxDelay = this.getMaxDelay(options);
    const metadata = this.measureText(input, options);
    const positionX = (rectangle.width / 2) - (metadata.width / 2);
    const positionY = rectangle.topLeft.y + rectangle.height / 2;

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

        this.drawText(char, new Point(position, positionY), { ...options, align: 'left' });
        this.drawCursor(new Point(position + width, positionY), options);

        position += width;
      });
      await this.waitFor(this.randomNumberInRange(minDelay, maxDelay));

      this.removeCursor(new Point(position, positionY), options);
    }
  }

  constructor(htmlCanvas: HTMLCanvasElement | null) {
    const context = this.getContext(htmlCanvas);

    this.checkCanvasExists(htmlCanvas);
    this.checkContextExists(context);
    this.element = htmlCanvas as HTMLCanvasElement;
    this.context = context as CanvasRenderingContext2D;
  }

  public async print(input: string, position: Point, options?: PrintOptions) {
    const rectangle = this.getRectangleForText(position, options);
    // this.drawRect(rectangle, options);

    if (options?.animate) {
      await this.drawTextLineProgressively(input, rectangle, options);
    } else {
      this.drawTextLine(input, rectangle, options);
    }
  }
}

export default Canvas;
