import Star, { StarParams } from "../Stars/Star";
import Canvas from "./Canvas";

type Dimensions = {
	width: number;
	height: number;
};

type DrawInput = {
	time: DOMHighResTimeStamp;
	dimensions: Dimensions;
};

class BackgroundCanvas extends Canvas {
	private stars: Star[] = [];

	private scrollY: number = window.scrollY;

	private targetScrollY: number = window.scrollY;

	private getLayers(
		params: Dimensions,
	): Array<{ count: number; params: StarParams }> {
		return [
			{
				count: 180,
				params: {
					size: { min: 0.4, max: 1.0 },
					opacity: { min: 0.2, max: 0.55 },
					layer: 0,

					speed: 0.08,
					xMax: params.width,
					yMax: params.height,
				},
			},
			{
				count: 120,
				params: {
					size: { min: 0.7, max: 1.6 },
					opacity: { min: 0.35, max: 0.8 },
					layer: 1,
					speed: 0.18,
					xMax: params.width,
					yMax: params.height,
				},
			},
			{
				count: 70,
				params: {
					size: { min: 1.1, max: 2.4 },
					opacity: { min: 0.5, max: 1 },
					layer: 2,
					speed: 0.35,
					xMax: params.width,
					yMax: params.height,
				},
			},
		];
	}

	public async clear() {
		await super.clear();

		this.stars = [];
		this.createStars(this.setupScreen());
	}

	private setupScreen(): Dimensions {
		const rectangle = this.dimensions();
		const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
		const nextWidth = rectangle.width * devicePixelRatio;
		const nextHeight = rectangle.height * devicePixelRatio;

		this.setWidth(nextWidth);
		this.setHeight(nextHeight);
		this.context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

		return { width: nextWidth, height: nextHeight };
	}

	private createStars(params: Dimensions) {
		this.stars = [];

		this.getLayers(params).forEach((layer) => {
			for (let i = 0; i < layer.count; i++) {
				this.stars.push(new Star(layer.params));
			}
		});

		return this.stars;
	}

	private drawStars({ time, dimensions: { height } }: DrawInput) {
		this.stars.forEach((star) => {
			// Parallax position.
			// Higher speed = closer star = stronger movement.
			let nextY = star.y - this.scrollY * star.speed;

			// Repeat stars vertically so the field never runs out.
			const worldHeight = height * 4;

			nextY = ((nextY % worldHeight) + worldHeight) % worldHeight;

			// Only draw stars currently visible.
			if (nextY < -10 || nextY > height + 10) {
				return;
			}

			// Subtle twinkle.
			const twinkle = 0.75 + Math.sin(time * 0.0015 + star.twinkle);

			this.context.beginPath();
			this.context.arc(star.x, nextY, star.size, 0, Math.PI * 2);
			this.context.fillStyle = `rgba(255,255,255,${star.opacity * twinkle})`;
			this.context.fill();

			// Glow for foreground stars.
			if (star.layer === 2) {
				this.context.beginPath();
				this.context.arc(star.x, nextY, star.size * 3, 0, Math.PI * 2);
				this.context.fillStyle = `rgba(150,180,255,${star.opacity * twinkle * 0.08})`;
				this.context.fill();
			}
		});
	}

	private drawBackground({ dimensions: { height, width } }: DrawInput) {
		const gradient = this.context.createLinearGradient(0, 0, 0, height);
		const progress =
			(this.scrollY / (document.body.scrollHeight - window.innerHeight)) * 2;

		gradient.addColorStop(0, "#000");

		gradient.addColorStop(
			1,
			`rgb(${progress * 16},${progress * 22},${progress * 54})`,
		);

		this.context.fillStyle = gradient;
		this.context.fillRect(0, 0, width, height);
	}

	constructor(htmlCanvas: HTMLCanvasElement | null) {
		super(htmlCanvas);

		this.createStars(this.setupScreen());
	}

	public draw(time?: DOMHighResTimeStamp) {
		const rectangle = this.dimensions();
		// console.log("animate");
		this.drawBackground({ time: time || Date.now(), dimensions: rectangle });
		this.drawStars({ time: time || Date.now(), dimensions: rectangle });
	}

	public animate() {
		const handler = (time?: DOMHighResTimeStamp) => {
			console.log("animate");
			this.draw(time);
			window.requestAnimationFrame(handler);
		};

		window.requestAnimationFrame(handler);
	}

	public listenScroll() {
		window.addEventListener(
			"scroll",
			() => {
				this.targetScrollY = window.scrollY;
				requestAnimationFrame((time) => {
					const rectangle = this.dimensions();

					this.scrollY += this.targetScrollY - this.scrollY;

					this.drawBackground({ time, dimensions: rectangle });
					this.drawStars({ time, dimensions: rectangle });
				});
			},
			{ passive: true },
		);
	}
}

export default BackgroundCanvas;
