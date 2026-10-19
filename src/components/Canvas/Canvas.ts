export type ActionId = string;

type ActionState = {
	stop: () => void;
};

class Canvas {
	protected readonly context: CanvasRenderingContext2D;

	protected state: Map<ActionId, ActionState> = new Map();
	protected getActionId() {
		return Math.random().toString(36).slice(2);
	}

	private checkCanvasExists(htmlCanvas: HTMLCanvasElement | null) {
		if (!htmlCanvas) {
			throw new Error("Cannot create canvas");
		}
	}

	private checkContextExists(context: CanvasRenderingContext2D | null) {
		if (!context) {
			throw new Error("Cannot get context");
		}
	}

	private getContext(htmlCanvas: HTMLCanvasElement | null) {
		return htmlCanvas?.getContext ? htmlCanvas.getContext("2d") || null : null;
	}

	protected async requestAnimationFrame(
		callback: (time?: DOMHighResTimeStamp) => unknown,
		id?: string,
	) {
		const actionId = id || this.getActionId();

		return new Promise<void>((resolve, reject) => {
			const operationId = requestAnimationFrame(async (time) => {
				callback(time);
				resolve();
			});

			this.state.set(actionId, {
				stop: () => {
					cancelAnimationFrame(operationId);
					reject();
				},
			});
		});
	}

	protected async waitFor(ms: number, id?: string) {
		const actionId = id || this.getActionId();

		await new Promise((resolve, reject) => {
			const timerId = setTimeout(resolve, ms);

			this.state.set(actionId, {
				stop: () => {
					clearTimeout(timerId);
					reject();
				},
			});
		});
	}

	constructor(htmlCanvas: HTMLCanvasElement | null) {
		const context = this.getContext(htmlCanvas);

		this.checkCanvasExists(htmlCanvas);
		this.checkContextExists(context);
		this.context = context as CanvasRenderingContext2D;
	}

	public setWidth(width: number) {
		this.context.canvas.width = width;
	}

	public setHeight(height: number) {
		this.context.canvas.height = height;
	}

	public dimensions() {
		return this.context.canvas.getBoundingClientRect();
	}

	public async clear() {
		this.state.forEach((state) => {
			if (state.stop) {
				state.stop();
			}
		});

		await this.requestAnimationFrame(() => {
			this.context.clearRect(
				0,
				0,
				this.context.canvas.width,
				this.context.canvas.height,
			);
		});
	}
}

export default Canvas;
