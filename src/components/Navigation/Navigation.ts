import { router } from '../Router';

class Navigation {
  private isWheelSpinUp(event: WheelEvent) {
    return event.deltaY < 0;
  }

  private isWheelSpinDown(event: WheelEvent) {
    return event.deltaY > 0;
  }

  public getPathByIndex(index: number | null) {
    const path = router.routes[index as number];
    if ((index === null) || !path) {
      return null;
    }
    return path.path;
  }

  private getPreviousPath(path: string) {
    const index = router.routes.findIndex((item) => item.path === path);
    const minIndex = 0;
    const prevIndex = (index === minIndex) ? null : (index - 1);
    return this.getPathByIndex(prevIndex);
  }

  private getNextPath(path: string) {
    const index = router.routes.findIndex((item) => item.path === path);
    const maxIndex = router.routes.length - 1;
    const nextIndex = (index === maxIndex) ? null : (index + 1);
    return this.getPathByIndex(nextIndex);
  }

  private withRequestAnimationFrame<T extends (...args: any[]) => any>(fn: T) {
    let isAwaiting: boolean = false;
    let temp: Parameters<T> = [] as unknown as Parameters<T>;

    return (...params: Parameters<T>) => {
      temp = params;

      if (!isAwaiting) {
        window.requestAnimationFrame(() => {
          fn(...temp);
          isAwaiting = false;
        });

        isAwaiting = true;
      }
    };
  }

  private withDebounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
    let isAwaiting: boolean = false;
    let temp: Parameters<T> = [] as unknown as Parameters<T>;

    return (...params: Parameters<T>) => {
      if (!isAwaiting) {
        temp = params;

        setTimeout(() => {
          fn(...temp);
          isAwaiting = false;
        }, ms);

        isAwaiting = true;
      }
    };
  }

  private handleSpin(event: WheelEvent) {
    const path = router.getCurrentPath();

    if (this.isWheelSpinUp(event)) {
      const prevPath = this.getPreviousPath(path);
      router.push(prevPath);
    }

    if (this.isWheelSpinDown(event)) {
      const nextPath = this.getNextPath(path);
      router.push(nextPath);
    }
  }

  constructor() {
    this.handleWheelSpin = this.withDebounce(
      this.withRequestAnimationFrame(
        this.handleSpin.bind(this),
      ).bind(this),
      200,
    );
  }

  public handleWheelSpin: (event: WheelEvent) => void;

  public listenWheelUpdates() {
    window.addEventListener('wheel', (event: WheelEvent) => this.handleWheelSpin(event));
  }
}

export default Navigation;
