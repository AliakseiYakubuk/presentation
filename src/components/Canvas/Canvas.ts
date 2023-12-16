/* eslint-disable no-param-reassign */

import { Point } from '../Point';
import { Rectangle } from '../Rectangle';

type ActionId = string;

type ActionState = {
  stop: () => void
};

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

type PaddingPrintOptions = {
  right?: number,
  left?: number,
};

export type PrintOptions = {
  fontSize?: number,
  lineHeight?: number,
  fontFamily?: string,
  align?: 'left' | 'center' | 'right',
  color?: string,
  background?: string,
  animate?: boolean,
  speed?: SpeedPrintOptions,
  cursor?: CursorPrintOptions,
  padding?: PaddingPrintOptions
  actionId?: ActionId,
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

  private readonly context: CanvasRenderingContext2D;

  private state: Map<ActionId, ActionState> = new Map();

  private getActionId() {
    return Math.random().toString(36).slice(2);
  }

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

  private randomNumberInRange(min: number, max: number) {
    return min + (max - min) * Math.random();
  }

  private getFontFamily(options?: PrintOptions) {
    return options?.fontFamily || 'serif';
  }

  private getFontSize(options?: PrintOptions) {
    return options?.fontSize || 10;
  }

  private getLineHeight(options?: PrintOptions) {
    const fontSize = this.getFontSize(options);
    return options?.lineHeight || (fontSize * 1.5);
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

  private getPadding(options?: PrintOptions) {
    const padding = options?.padding;
    return {
      right: padding?.right || 0,
      left: padding?.left || 0,
    };
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
    const halfHeight = this.getLineHeight(options) / 2;
    const top = textPosition.y - halfHeight;
    const right = textPosition.x + this.context.canvas.width;
    const bottom = textPosition.y + halfHeight;
    const topLeft = new Point(textPosition.x, top);
    const bottomRight = new Point(right, bottom);
    return new Rectangle(topLeft, bottomRight);
  }

  private getRectangleForCursor(posx: Point, options?: PrintOptions) {
    const height = this.getFontSize(options);
    const topLeft = new Point(posx.x, posx.y - height / 2);
    const bottomRight = new Point(posx.x + height / 2.5, posx.y + height / 2.5);
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

  // eslint-disable-next-line max-len
  private getPrintingStartPoint(metadata: ReturnType<typeof this.measureText>, rectangle: Rectangle, options?: PrintOptions) {
    const align = this.getTextAlign(options);
    const padding = this.getPadding(options);
    const positionY = rectangle.topLeft.y + rectangle.height / 2;

    if (align === 'left') {
      return new Point(padding.left + rectangle.topLeft.x, positionY);
    }

    if (align === 'right') {
      return new Point(rectangle.width - metadata.width - padding.right, positionY);
    }

    return new Point((rectangle.width / 2) - (metadata.width / 2), positionY);
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

  private async requestAnimationFrame(callback: () => unknown, id?: string) {
    const actionId = id || this.getActionId();

    return new Promise<void>((resolve, reject) => {
      const operationId = requestAnimationFrame(async () => {
        callback();
        resolve();
      });

      this.state.set(actionId, {
        stop: () => {
          cancelAnimationFrame(operationId);
          reject();
        },
      });
    });
  }

  private async waitFor(ms: number, id?: string) {
    const actionId = id || this.getActionId();

    await new Promise((resolve, reject) => {
      const timerId = setTimeout(resolve, ms);

      this.state.set(actionId, {
        stop: () => {
          clearTimeout(timerId);
          reject();
        },
      });
    });
  }

  private drawCursor(posx: Point, options?: PrintOptions) {
    const rectangle = this.getRectangleForCursor(posx, options);
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
    const getDiff = () => Date.now() - startTime;

    if (ttl < (cursor.period)) {
      return;
    }

    const animateCursor = async () => {
      await this.requestAnimationFrame(() => this.drawCursor(position, options));

      if (getDiff() >= ttl) {
        return;
      }

      await this.waitFor(cursor.period);
      await this.requestAnimationFrame(() => this.removeCursor(position, options));

      if (getDiff() >= ttl) {
        return;
      }

      await this.waitFor(cursor.period);

      if (getDiff() < ttl) {
        await animateCursor();
      }
    };

    if (cursor.end.sync) {
      await animateCursor();
    } else {
      animateCursor().catch((error) => {
        if (error) {
          console.error(error); // eslint-disable-line no-console
        }
      });
    }
  }

  private async drawAnimatedTextLine(input: string, rectangle: Rectangle, params?: PrintOptions) {
    const options = params || {};
    const speed = this.getSpeed(options);
    const cursor = this.getCursor(options);
    const metadata = this.measureText(input, options);
    const startPoint = this.getPrintingStartPoint(metadata, rectangle, options);
    const lastIndex = input.length - 1;

    let index = 0;
    let position = startPoint.x;

    options.align = 'left';
    options.actionId = options.actionId || this.getActionId();

    await this.drawAnimatedCursor(new Point(startPoint.x, startPoint.y), cursor.start.ttl, options);

    for (index; index <= lastIndex; index += 1) {
      const char = input[index];
      const { width } = this.measureText(char, options);
      const nextPosition = position + width;

      await this.requestAnimationFrame(() => {
        this.removeCursor(new Point(position, startPoint.y), options);
        this.drawText(char, new Point(position, startPoint.y), options);

        if (index < lastIndex) {
          this.drawCursor(new Point(nextPosition, startPoint.y), options);
        }
      }, options.actionId);

      await this.waitFor(this.randomNumberInRange(speed.min, speed.max));
      position = nextPosition;
    }

    await this.drawAnimatedCursor(new Point(position, startPoint.y), cursor.end.ttl, options);
  }

  constructor(htmlCanvas: HTMLCanvasElement | null) {
    const context = this.getContext(htmlCanvas);

    this.checkCanvasExists(htmlCanvas);
    this.checkContextExists(context);
    this.context = context as CanvasRenderingContext2D;
  }

  public getChildNodes() {
    return this.context.canvas.childNodes || [];
  }

  public setWidth(width: number) {
    this.context.canvas.width = width;
  }

  public setHeight(height: number) {
    this.context.canvas.height = height;
  }

  public async clear() {
    this.state.forEach((state) => state.stop && state.stop());

    await this.requestAnimationFrame(() => {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    });
  }

  public async printLine(input: string, position: Point, options?: PrintOptions) {
    const rectangle = this.getRectangleForText(position, options);

    if (options?.animate) {
      await this.drawAnimatedTextLine(input, rectangle, options);
    } else {
      this.drawTextLine(input, rectangle, options);
    }
  }
}

export default Canvas;
