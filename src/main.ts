import './style.css';
import { Navigation } from './components/Navigation';
import { Canvas } from './components/Canvas';
import { router } from './components/Router';
import { Point } from './components/Point';

// const navigation = new Navigation();
const logo = await Canvas.init('logo');

router.listenLocationUpdates();
router.listenPopStateUpdates();
// navigation.listenWheelUpdates();

await logo.print('Aliaksei Yakubuk', new Point(0, 90), {
  fontSize: 55,
  fontFamily: 'ubuntu',
  color: '#fff',
  background: '#000',
  animate: true,
  speed: { min: 50, max: 50 },
  cursor: { start: { ttl: 700 } },
});

await logo.print('Software Engineer', new Point(0, 150), {
  fontSize: 35,
  fontFamily: 'ubuntu',
  color: '#fff',
  background: '#000',
  animate: true,
  speed: { min: 50, max: 50 },
  cursor: { end: { ttl: Infinity, sync: false } },
});
