import './style.css';
import { Navigation } from './components/Navigation';
import { Canvas } from './components/Canvas';
import { router } from './components/Router';
import { Point } from './components/Point';

const navigation = new Navigation();
const logo = await Canvas.init('logo');

router.listenLocationUpdates();
router.listenPopStateUpdates();
navigation.listenWheelUpdates();

await logo.print('Aliaksei Yakubuk', new Point(0, 90), {
  fontSize: 35,
  color: '#fff',
  background: '#000',
  animate: true,
  maxDelay: 50,
  minDelay: 50,
});

await logo.print('Software Engineer', new Point(0, 150), {
  fontSize: 20,
  color: '#fff',
  background: '#000',
  animate: true,
  maxDelay: 50,
  minDelay: 50,
});
