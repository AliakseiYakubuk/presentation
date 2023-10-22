/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
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

  constructor(htmlCanvas: HTMLCanvasElement | null) {
    const context = this.getContext(htmlCanvas);

    this.checkCanvasExists(htmlCanvas);
    this.checkContextExists(context);
    this.element = htmlCanvas as HTMLCanvasElement;
    this.context = context as CanvasRenderingContext2D;
    // this.adjustSize();
  }

  public print = async (input: string) => {
    let acc = '';
    let index = 0;
    // this.context.fillStyle = '#fff';
    // this.context.fillRect(0, 0, this.element.width, 100);
    this.context.font = '50px serif';
    this.context.textAlign = 'center';
    this.context.fillStyle = '#FFF';
    this.context.fillText(input, this.element.width / 2, 50);
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
