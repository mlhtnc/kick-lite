import { KeyboardAvoidingViewProps, Platform } from "react-native";

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

export const convertMillisecondsToTime = (ms: number) => {

	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return String(hours).padStart(2, '0') + ':' +
		String(minutes).padStart(2, '0') + ':' +
		String(seconds).padStart(2, '0');
}

export const GlobalKAVBehaviour: KeyboardAvoidingViewProps['behavior'] = Platform.OS === "ios" ? "padding" : "height";