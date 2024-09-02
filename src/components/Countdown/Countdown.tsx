import React, { useEffect, useState } from 'react';
import { CountdownTimerProps } from './types';
import formatTime from '../../utils/formatTime';

export const Countdown: React.FC<CountdownTimerProps> = ({
	finishTime,
	callback,
	announce,
}) => {
	const [remainingTime, setRemainingTime] = useState<string>(
		formatTime(finishTime - performance.now())
	);

	useEffect(() => {
		setRemainingTime(formatTime(finishTime - performance.now()));
		const intervalId = setInterval(() => {
			const timeDifference = finishTime - performance.now();
			if (timeDifference <= 0) {
				announce("Time's up, continuing...");
				setRemainingTime(formatTime(0));
				clearInterval(intervalId);
				callback();
			} else {
				if (remainingTime === '0:16') {
					announce('15 seconds remaining...');
				}
				setRemainingTime(formatTime(timeDifference));
			}
		}, 1000);
		return () => clearInterval(intervalId);
	}, [finishTime, remainingTime, callback]);

	return <span>{`Time left: ${remainingTime}`}</span>;
};
