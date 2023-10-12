import './style.css';
// import { Canvas } from './components/Canvas';

// window.addEventListener('load', Canvas.init);

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
