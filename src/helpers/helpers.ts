
export const formatViewerCount = (count: number): string => {
	if (count < 1000) return count.toString();

	if (count < 1_000_000) {
		return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	}

	if (count < 1_000_000_000) {
		return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
	}

	return count.toExponential(1);
}