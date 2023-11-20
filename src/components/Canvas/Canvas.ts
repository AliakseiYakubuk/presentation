/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */

import { Point } from '../Point';
import { Rectangle } from '../Rectangle';

type CursorPrintOptions = {
  start?: {
    ttl?: number,
  },
  end?: {
    ttl?: number,
    sync?: boolean
  },
  period?: number
};

type SpeedPrintOptions = {
  min?: number,
  max?: number
};

type PrintOptions = {
  fontSize?: number,
  fontFamily?: string,
  align?: CanvasTextAlign,
  color?: string,
  background?: string,
  animate?: boolean,
  speed?: SpeedPrintOptions,
  cursor?: CursorPrintOptions
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

  private getSpeed(options?: PrintOptions) {
    const speed = options?.speed;
    return {
      min: speed?.min || 100,
      max: speed?.max || 100,
    };
  }

  private getCursor(options?: PrintOptions) {
    const cursor = options?.cursor;
    return {
      period: cursor?.period || 400,
      start: {
        ttl: cursor?.start?.ttl || 0,
      },
      end: {
        ttl: cursor?.end?.ttl || 0,
        sync: cursor?.end?.sync !== false,
      },
    };
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

    const metadata = context.measureText(input);
    const width = input
      .split('')
      .reduce((total, char) => (total + context.measureText(char).width), 0);

    return { ...metadata, width };
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
    const bottomRight = new Point(posx.x + height / 2.5, posx.y + height / 2.5);
    const rectangle = new Rectangle(topLeft, bottomRight);

    this.drawRect(rectangle, { ...options, background: this.getTextColor(options) });
  }

  private removeCursor(posx: Point, options?: PrintOptions) {
    this.drawCursor(posx, { ...options, color: this.getBackground(options) });
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

  private async drawAnimatedCursor(position: Point, ttl: number, options?: PrintOptions) {
    const startTime = Date.now();
    const cursor = this.getCursor(options);

    if (ttl < (1 * cursor.period)) {
      return;
    }

    const animateCursor = async () => {
      const endTime = Date.now();
      const diff = endTime - startTime;

      this.drawCursor(position, options);
      await this.waitFor(cursor.period);
      requestAnimationFrame(() => { this.removeCursor(position, options); });
      await this.waitFor(cursor.period);

      if (diff < ttl) {
        await animateCursor();
      }
    };

    if (cursor.end.sync) {
      await animateCursor();
    } else {
      animateCursor();
    }
  }

  // eslint-disable-next-line max-len
  private async drawAnimatedTextLine(input: string, rectangle: Rectangle, options?: PrintOptions) {
    const speed = this.getSpeed(options);
    const cursor = this.getCursor(options);
    const metadata = this.measureText(input, options);
    const positionX = (rectangle.width / 2) - (metadata.width / 2);
    const positionY = rectangle.topLeft.y + rectangle.height / 2;
    const textOptions = { ...options, align: 'left' } as PrintOptions;

    let index = 0;
    let position = positionX;

    await this.drawAnimatedCursor(new Point(positionX, positionY), cursor.start.ttl, options);

    for (index; index < input.length; index += 1) {
      const char = input[index];

      requestAnimationFrame(() => {
        const { width } = this.measureText(char, options);
        const nextPosition = position + width;

        this.drawText(char, new Point(position, positionY), textOptions);
        this.drawCursor(new Point(nextPosition, positionY), options);

        position = nextPosition;
      });
      await this.waitFor(this.randomNumberInRange(speed.min, speed.max));

      this.removeCursor(new Point(position, positionY), options);
    }

    await this.drawAnimatedCursor(new Point(position, positionY), cursor.end.ttl, options);
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

    if (options?.animate) {
      await this.drawAnimatedTextLine(input, rectangle, options);
    } else {
      this.drawTextLine(input, rectangle, options);
    }
  }

  public getPixelData(point: Point) {
    const imageData = this.context.getImageData(point.x, point.y, this.context.canvas.width, 1);
    //     const arr = new Uint8ClampedArray(4);
    //     arr[0] = 20;
    // = arr;    arr[1] = 40;
    //     arr[2] = 60;
    //     console.log(data);
    //     const imageData = new ImageData(4, 1);
    //     imageData.data

    for (let index = 0; index < imageData.data.length; index += 1) {
      // if (data[index] !== 0) {
      console.log(imageData.data[index]);
      // }

      if (index > 1000) {
        imageData.data[index] = 255;
      }
      console.log(imageData);
      this.context.putImageData(imageData, point.x, point.y);
    }
  }
}

export default Canvas;
