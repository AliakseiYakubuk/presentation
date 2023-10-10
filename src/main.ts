import './style.css'
// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

const randomNumberInRange = (min: number, max: number) => {
  return min + (max - min) * Math.random()
}

const waitFor = async (ms: number) => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const print = async (ctx: CanvasRenderingContext2D, input: string) => {
  let acc = ''
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 500, 500)

  for (const char of input) {
    acc = `${acc}${char}`
    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, 500, 500)
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 500, 500)
      ctx.fillStyle = '#000'
      ctx.fillText(acc, 100, 100)
      console.log(acc)
    })
    await waitFor(randomNumberInRange(50, 50))
  }
}

const draw = async () => {
  const canvas = document.getElementById('canvas') as (HTMLCanvasElement | null)
  if (canvas?.getContext) {
    const ctx = canvas.getContext('2d')
    console.log(ctx)

    if (!ctx) {
      return
    }

    ctx.font = '48px serif'
    await print(ctx, 'Aliaksei Yakubuk')
  }
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
window.addEventListener('load', draw)
