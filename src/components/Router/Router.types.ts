import { Page } from '../Page';

export type RouteItem = {
  path: string,
  page: Page
};

export type RouterOptions = {
  fallbackPage: Page,
  routes: RouteItem[]
};

export type EventPayload = {
  pathname: string;
};

export type LocationEvent = CustomEvent<EventPayload>;
