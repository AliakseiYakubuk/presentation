class Canvas {
  static init() {
    const canvas = document.getElementById('canvas') as (HTMLCanvasElement | null);
    return new Canvas(canvas);
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

  private adjustSize() {
    this.element.width = document.body.clientWidth;
    this.element.height = document.body.clientHeight;
  }

  constructor(htmlCanvas: HTMLCanvasElement | null) {
    const context = this.getContext(htmlCanvas);

    this.checkCanvasExists(htmlCanvas);
    this.checkContextExists(context);
    this.element = htmlCanvas as HTMLCanvasElement;
    this.context = context as CanvasRenderingContext2D;
    this.adjustSize();
  }
}

export default Canvas;
