export type StarParams = {
	size: {
		min: number;
		max: number;
	};
	opacity: {
		min: number;
		max: number;
	};
	speed: number;
	layer: number;
	xMax: number;
	yMax: number;
};

class Star {
	private xValue: number;

	private yValue: number;

	private sizeValue: number;

	private opacityValue: number;

	private speedValue: number;

	private twinkleValue: number;

	private layerValue: number;

	private randomInRange(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	constructor(params: StarParams) {
		this.xValue = Math.random() * params.xMax;
		this.yValue = Math.random() * (params.yMax * 4);
		this.sizeValue = this.randomInRange(params.size.min, params.size.max);
		this.speedValue = params.speed;
		this.twinkleValue = this.randomInRange(0, Math.PI * 2);
		this.layerValue = params.layer;
		this.opacityValue = this.randomInRange(
			params.opacity.min,
			params.opacity.max,
		);
	}

	get x() {
		return this.xValue;
	}

	get y() {
		return this.yValue;
	}

	get size() {
		return this.sizeValue;
	}

	get opacity() {
		return this.opacityValue;
	}

	get speed() {
		return this.speedValue;
	}

	get twinkle() {
		return this.twinkleValue;
	}

	get layer() {
		return this.layerValue;
	}
}

export default Star;
