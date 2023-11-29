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

// await logo.printLine('Aliaksei Yakubuk', new Point(0, 90), {
//   fontSize: 55,
//   fontFamily: 'ubuntu',
//   align: 'left',
//   color: '#fff',
//   background: '#000',
//   animate: true,
//   padding: { right: 40 },
//   speed: { min: 50, max: 50 },
//   cursor: { start: { ttl: 700 } },
// });

// await logo.printLine('Software Engineer', new Point(0, 150), {
//   fontSize: 35,
//   fontFamily: 'ubuntu',
//   align: 'left',
//   color: '#fff',
//   background: '#000',
//   animate: true,
//   padding: { right: 40 },
//   speed: { min: 50, max: 50 },
//   cursor: { end: { ttl: Infinity, sync: false } },
// });

const text = "Lorem Ipsum is simskjadkanskdjnakjsndlasndljasndljkansdalsdnply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and";

await logo.print(text, new Point(0, 50), {
  fontSize: 35,
  fontFamily: 'ubuntu',
  align: 'right',
  color: '#fff',
  background: '#000',
  animate: true,
  padding: { right: 40 },
  speed: { min: 25, max: 25 },
});
