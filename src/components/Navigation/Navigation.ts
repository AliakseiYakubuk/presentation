import { Page } from '../Page';

class Navigation {
  static init() {
    const element = document.getElementById('grid') as HTMLDivElement;

    if (!element) {
      throw new Error('Grid element is not found');
    }

    return new Navigation(element, [
      new Page('grid_home'),
      new Page('grid_contacts'),
      new Page('grid_skills'),
      new Page('grid_about'),
    ]);
  }

  private grid: HTMLDivElement;

  private pages: Page[] = [];

  private isValidPage(page: Page | null) {
    return page instanceof Page;
  }

  private isWheelSpinUp(event: WheelEvent) {
    return event.deltaY < 0;
  }

  private isWheelSpinDown(event: WheelEvent) {
    return event.deltaY > 0;
  }

  private getPageByIndex(value: number | null) {
    if (value === null) {
      return null;
    }
    return this.pages[value] || null;
  }

  private getPreviousPage(page: Page) {
    const index = this.pages.findIndex((item) => item.getClass() === page.getClass());
    const minIndex = 0;
    const prevIndex = (index === minIndex) ? null : (index - 1);
    return this.getPageByIndex(prevIndex);
  }

  private getCurrentPage() {
    return this.pages
      .find((page) => this.grid.classList.contains(page.getClass())) || null;
  }

  private getNextPage(page: Page) {
    const index = this.pages.findIndex((item) => item.getClass() === page.getClass());
    const maxIndex = this.pages.length - 1;
    const nextIndex = (index === maxIndex) ? null : (index + 1);
    return this.getPageByIndex(nextIndex);
  }

  private setPage(current: Page | null, next: Page | null) {
    if (this.isValidPage(current) && this.isValidPage(next)) {
      this.grid.classList.replace(
        (current as Page).getClass(),
        (next as Page).getClass(),
      );
    }
  }

  private batchUpdates<T extends (...args: any[]) => any>(fn: T) {
    let processing: boolean = false;
    let temp: Parameters<T> = [] as unknown as Parameters<T>;

    return (...params: Parameters<T>) => {
      temp = params;

      if (!processing) {
        window.requestAnimationFrame(() => {
          fn(...temp);
          processing = false;
        });

        processing = true;
      }
    };
  }

  private handleSpin(event: WheelEvent) {
    const currentPage = this.getCurrentPage();

    if (!currentPage) {
      return;
    }

    if (this.isWheelSpinUp(event)) {
      const prevPage = this.getPreviousPage(currentPage);
      this.setPage(currentPage, prevPage);
    }

    if (this.isWheelSpinDown(event)) {
      const nextPage = this.getNextPage(currentPage);
      this.setPage(currentPage, nextPage);
    }
  }

  constructor(div: HTMLDivElement, pages: Page[]) {
    this.grid = div;
    this.pages = pages || [];
  }

  public get handleWheelSpin() {
    return this.batchUpdates(this.handleSpin.bind(this));
  }
}

export default Navigation;
