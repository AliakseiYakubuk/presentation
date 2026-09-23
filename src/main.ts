import BackgroundCanvas from "./components/Canvas/BackgroundCanvas";
import { Home } from "./components/Home";
// import { Router } from "./components/Router";
// import { initFirstSection } from "./components/Section";
// const router = new Router();

function random(min, max) {
	return Math.random() * (max - min) + min;
}

const app = async () => {
	/*
	const canvas = document.getElementById("stars") as HTMLCanvasElement;
	const ctx = canvas.getContext("2d");

	let width;
	let height;
	let dpr;

	let scrollY = window.scrollY;
	let targetScrollY = scrollY;

	const layers = [
		{
			count: 180,
			size: [0.4, 1.0],
			speed: 0.08,
			opacity: [0.2, 0.55],
		},
		{
			count: 120,
			size: [0.7, 1.6],
			speed: 0.18,
			opacity: [0.35, 0.8],
		},
		{
			count: 70,
			size: [1.1, 2.4],
			speed: 0.35,
			opacity: [0.5, 1],
		},
	];

	const stars = [];

	function createStars() {
		stars.length = 0;

		layers.forEach((layer, layerIndex) => {
			for (let i = 0; i < layer.count; i++) {
				stars.push({
					x: Math.random() * width,
					y: Math.random() * (height * 4),
					size: random(layer.size[0], layer.size[1]),
					opacity: random(layer.opacity[0], layer.opacity[1]),
					speed: layer.speed,
					layer: layerIndex,
					twinkle: random(0, Math.PI * 2),
				});
			}
		});
	}

	// /**
	function resize() {
		const rect = canvas.getBoundingClientRect();
		dpr = Math.min(window.devicePixelRatio || 1, 2);

		width = rect.width;
		height = rect.height;

		canvas.width = width * dpr;
		canvas.height = height * dpr;

		canvas.style.width = width + "px";
		canvas.style.height = height + "px";

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		createStars();
	}

	function drawBackground() {
		const gradient = ctx?.createLinearGradient(0, 0, 0, height);
		const progress =
			(scrollY / (document.body.scrollHeight - window.innerHeight)) * 2;

		// gradient.addColorStop(0.45, "#06091a");
		gradient.addColorStop(0, "#000");
		// gradient.addColorStop(0.55, "#000");

		gradient.addColorStop(
			1,
			`rgb(${progress * 16},${progress * 22},${progress * 54})`,
		);

		// if (scrollY / (document.body.scrollHeight - window.innerHeight) > 0.45) {
		// 	gradient.addColorStop(1, "rgb(16, 22, 51)");
		// } else {

		// }

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);
	}

	function drawStars(time) {
		stars.forEach((star) => {
			// Parallax position.
			// Higher speed = closer star = stronger movement.
			let y = star.y - scrollY * star.speed;

			// Repeat stars vertically so the field never runs out.
			const worldHeight = height * 4;

			y = ((y % worldHeight) + worldHeight) % worldHeight;

			// Only draw stars currently visible.
			if (y < -10 || y > height + 10) return;

			// Subtle twinkle.
			const twinkle = 0.75 + Math.sin(time * 0.0015 + star.twinkle) * 0.25;

			ctx.beginPath();

			ctx.arc(star.x, y, star.size, 0, Math.PI * 2);

			ctx.fillStyle = `rgba(255,255,255,${star.opacity * twinkle})`;

			ctx.fill();

			// Glow for foreground stars.
			if (star.layer === 2) {
				ctx.beginPath();

				ctx.arc(star.x, y, star.size * 3, 0, Math.PI * 2);

				ctx.fillStyle = `rgba(150,180,255,${star.opacity * 0.08})`;

				ctx.fill();
			}
		});
	}

	function animate(time) {
		// Smooth the scroll movement.
		scrollY += targetScrollY - scrollY;

		drawBackground();
		drawStars(time);

		console.log("animate");
	}

	window.addEventListener(
		"scroll",
		() => {
			targetScrollY = window.scrollY;
			requestAnimationFrame(animate);
		},
		{ passive: true },
	);

	// window.addEventListener("resize", resize);

	resize();
	requestAnimationFrame(animate);dra
	*/

	const home = await Home.init();

	home.listenClickCopyEmail("aliaksei.yakubuk@gmail.com");

	home.listenScreenResize();

	home.listenScroll();

	home.animateBackground();
};

// test();
app();

// new Stars("stars-far").generate(200, {
// 	star: {
// 		size: {
// 			min: 0.4,
// 			max: 1.0,
// 		},
// 		opacity: {
// 			min: 0.2,
// 			max: 0.7,
// 		},
// 		duration: {
// 			min: 6,
// 			max: 12,
// 		},
// 	},
// });
// new Stars("stars-mid").generate(100, {
// 	star: {
// 		size: {
// 			min: 1.0,
// 			max: 2.0,
// 		},
// 		opacity: {
// 			min: 0.5,
// 			max: 0.9,
// 		},
// 		duration: {
// 			min: 4,
// 			max: 8,
// 		},
// 	},
// });
// new Stars("stars-near").generate(50, {
// 	star: {
// 		size: {
// 			min: 2,
// 			max: 3,
// 		},
// 		opacity: {
// 			min: 0.9,
// 			max: 1,
// 		},
// 		duration: {
// 			min: 3,
// 			max: 6,
// 		},
// 	},
// });
