import Star, { StarParams } from "./Star";

class Stars {
	private container: HTMLElement | null = null;

	constructor(containerId: string) {
		this.container = document.getElementById(containerId);
	}

	generate(count: number, params: { star: StarParams }) {
		if (this.container) {
			for (let i = 0; i < count; i++) {
				this.container.appendChild(
					new Star(Math.random() * 100, Math.random() * 100, params.star)
						.element,
				);
			}
		}
	}
}

export default Stars;
