class Point {
  private xCoordinate: number;

  private yCoordinate: number;

  constructor(x: number, y: number) {
    this.xCoordinate = Math.round(x);
    this.yCoordinate = Math.round(y);
  }

  get x() {
    return this.xCoordinate;
  }

  get y() {
    return this.yCoordinate;
  }
}

export default Point;
