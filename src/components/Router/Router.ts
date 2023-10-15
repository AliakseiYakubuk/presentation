import { Page } from '../Page';
import { ROUTE_CONFIG } from './Router.config';
import {
  RouteItem,
  EventPayload,
  RouterOptions,
} from './Router.types';

class Router {
  static init() {
    const element = document.getElementById('grid') as HTMLDivElement;

    if (!element) {
      throw new Error('Grid element is not found');
    }

    return new Router(element, {
      fallbackPage: ROUTE_CONFIG[0].page,
      routes: ROUTE_CONFIG,
    });
  }

  private eventType = 'onurlupdate';

  private grid: HTMLDivElement;

  private routeConfig: RouteItem[];

  private fallbackPage: Page;

  private isValidPage(page: Page | null) {
    return page instanceof Page;
  }

  private parsePath(path: string) {
    return (path || '')
      .trim()
      .split('/')
      .filter((item) => item && (item !== '/'));
  }

  private getFirstLevelPath(path: string) {
    const items = this.parsePath(path);
    return (items.length > 0) ? `/${items[0]}` : '/';
  }

  private setPage(nextPage: Page | null) {
    if (this.isValidPage(nextPage)) {
      this.grid.style.top = (nextPage as Page).position.top;
      this.grid.style.left = (nextPage as Page).position.left;
    }
  }

  private emitLocationUpdate() {
    const payload = { detail: { pathname: window.location.pathname } };
    window.dispatchEvent(new CustomEvent<EventPayload>(this.eventType, payload));
  }

  constructor(div: HTMLDivElement, { fallbackPage, routes }: RouterOptions) {
    this.grid = div;
    this.routeConfig = routes;
    this.fallbackPage = fallbackPage;

    this.setPage(this.getCurrentPage());
  }

  public get routes() {
    return this.routeConfig;
  }

  public getPageByPath(path: string) {
    const page = this.routeConfig.find((item) => item.path === path)?.page || null;
    return this.isValidPage(page) ? page : this.fallbackPage;
  }

  public getCurrentPath() {
    return this.getFirstLevelPath(window.location.pathname);
  }

  public getCurrentPage() {
    const path = this.getFirstLevelPath(window.location.pathname);
    return this.getPageByPath(path);
  }

  public push(path: string | null, state: Record<string, any> = {}) {
    if (path && window.history) {
      window.history.pushState(state, path, path);
      this.emitLocationUpdate();
    }
    return this;
  }

  public listenLocationUpdates() {
    window.addEventListener(this.eventType, () => {
      this.setPage(this.getCurrentPage());
    });
  }

  public listenPopStateUpdates() {
    window.addEventListener('popstate', () => {
      this.setPage(this.getCurrentPage());
    });
  }
}

export default Router.init();
