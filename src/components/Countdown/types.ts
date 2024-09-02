export interface CountdownTimerProps {
	finishTime: number;
	callback: () => void;
	announce: (text: string) => void;
}
