const THRESHOLD = Array.from({ length: 11 }, (_, i) => i / 10);

const getOffset = (value: number) => {
	const normalizedValue = Math.min(100, Math.max(0, value));
	return `${-50 + normalizedValue * 50}%`;
};

export const initFirstSection = ({
	containerId,
	rightElementId,
	leftElementId,
}: {
	containerId: string;
	rightElementId: string;
	leftElementId: string;
}) => {
	const container = document.getElementById(containerId);
	const startElement = document.getElementById("first-section-start");
	const idleElement = document.getElementById("first-section-idle");
	const endElement = document.getElementById("first-section-end");
	const rightElement = document.getElementById(rightElementId);
	const leftElement = document.getElementById(leftElementId);
	const hasIntersectionObserver = globalThis.IntersectionObserver;

	if (!hasIntersectionObserver || !container) {
		return;
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.target.id === "first-section-idle") {
				if (rightElement) {
					console.log(getOffset(entry.intersectionRatio));
					rightElement.style.right = getOffset(entry.intersectionRatio);
				}
			}
		},
		{ threshold: THRESHOLD },
	);

	if (idleElement) {
		observer.observe(idleElement);
	}

	if (endElement) {
		observer.observe(endElement);
	}
};
