let timer = null;

const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

export function startIdleTimer(callback, minutes = 5) {
	stopIdleTimer();

	const reset = () => {
		clearTimeout(timer);

		timer = setTimeout(() => {
			callback();
		}, minutes * 60 * 1000);
	};

	events.forEach((event) => {
		window.addEventListener(event, reset);
	});

	reset();

	return () => {
		events.forEach((event) => {
			window.removeEventListener(event, reset);
		});

		clearTimeout(timer);
	};
}

export function stopIdleTimer() {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
}