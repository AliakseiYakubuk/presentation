import { Point } from '../Point';

class Rectangle {
  private topLeftPoint: Point;

  private bottomRightPoint: Point;

  private checkPointPosition(topLeftPoint: Point, bottomRightPoint: Point) {
    if (topLeftPoint.x >= bottomRightPoint.x) {
      throw new Error('Cannot create rectangle');
    }
    if (topLeftPoint.y >= bottomRightPoint.y) {
      throw new Error('Cannot create rectangle');
    }
  }

  constructor(topLeftPoint: Point, bottomRightPoint: Point) {
    this.checkPointPosition(topLeftPoint, bottomRightPoint);
    this.topLeftPoint = topLeftPoint;
    this.bottomRightPoint = bottomRightPoint;
  }

  public get width() {
    return this.bottomRight.x - this.topLeft.x;
  }

  public get height() {
    return this.bottomRight.y - this.topLeft.y;
  }

  public get topLeft() {
    return this.topLeftPoint;
  }

  public get bottomRight() {
    return this.bottomRightPoint;
  }
}

export default Rectangle;
