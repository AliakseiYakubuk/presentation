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

logo.printLine('Aliaksei Yakubuk', new Point(0, 50), { fontSize: 20, color: '#FFF' });
logo.printLine('Aliaksei Yakubuk', new Point(0, 270), { fontSize: 20, color: '#FFF' });
logo.printLine('Aliaksei Yakubuk', new Point(0, 90), { fontSize: 20 });
logo.printLine('Aliaksei Yakubuk', new Point(0, 110), { fontSize: 20 });
logo.printLine('Aliaksei Yakubuk', new Point(0, 130), { fontSize: 20 });
// const randomNumberInRange = (min: number, max: number) => min + (max - min) * Math.random();

// const waitFor = async (ms: number) => {
//   await new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// };

// const print = async (ctx: CanvasRenderingContext2D, input: string) => {
//   let acc = '';
//   ctx.fillStyle = '#fff';
//   ctx.fillRect(0, 0, 500, 500);

//   for (const char of input) {
//     acc = `${acc}${char}`;
//     requestAnimationFrame(() => {
//       ctx.clearRect(0, 0, 500, 500);
//       ctx.fillStyle = '#fff';
//       ctx.fillRect(0, 0, 500, 500);
//       ctx.fillStyle = '#000';
//       ctx.fillText(acc, 100, 100);
//     });
//     await waitFor(randomNumberInRange(50, 50));
//   }
// };

// // ctx.font = '48px serif'
// // await print(ctx, 'Aliaksei Yakubuk')

// const draw = async () => {
//   const canvas = document.getElementById('canvas') as (HTMLCanvasElement | null);
//   if (canvas?.getContext) {
//     const ctx = canvas.getContext('2d');
//     console.log(ctx);

//     if (!ctx) {

//     }
//   }
// };
