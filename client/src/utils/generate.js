export const arrayRange = (start, stop, step) =>
	start <= stop
		? Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)
		: Array.from({ length: (start - stop) / step + 1 }, (_, i) => start - i * step);
