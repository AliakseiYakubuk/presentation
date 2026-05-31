let currentOffset = 0;
let currentScale = 0;

const isNumber = (value: unknown): value is number => Number(value) === value;

const getOffset = () => {
	const value = Number(
		getComputedStyle(document.documentElement)
			.getPropertyValue("--offset")
			.trim()
			.replace("px", ""),
	);

	if (isNumber(value)) {
		return value;
	}

	return null;
};

const getNextScale = () =>
	(window.innerWidth / 2 - Math.abs(currentOffset)) / (window.innerWidth / 2);

export const test = () => {
	document.addEventListener("wheel", (event: WheelEvent) => {
		console.log(event.deltaY);

		requestAnimationFrame(() => {
			// const offset = getOffset();

			if (isNumber(event.deltaY)) {
				// const nextValue = offset;

				currentOffset = currentOffset + event.deltaY;
				// console.log("alex", nextValue);

				document.documentElement.style.setProperty(
					"--offset",
					`${currentOffset}px`,
				);
				document.documentElement.style.setProperty(
					"--scale",
					String(getNextScale()),
				);
				document.documentElement.style.setProperty(
					"--opacity",
					String(getNextScale()),
				);

				return;
			}
		});
	});
};
