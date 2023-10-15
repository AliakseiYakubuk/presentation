import { Page } from '../Page';
import { RouteItem } from './Router.types';

export const ROUTE_CONFIG: RouteItem[] = [
  {
    path: '/',
    page: new Page({ top: '0vh', left: '0vw' }),
  },
  {
    path: '/about',
    page: new Page({ top: '-100vh', left: '-100vw' }),
  },
  {
    path: '/skills',
    page: new Page({ top: '-200vh', left: '0vw' }),
  },
  {
    path: '/contacts',
    page: new Page({ top: '-300vh', left: '-100vw' }),
  },
];
