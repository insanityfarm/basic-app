import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from 'react';
import cx from 'classnames';

import { Countdown } from '../Countdown/Countdown';
import { Question, Quiz as QuizType } from './types';

import quizDataRaw from '../../data/quiz.json';

const quizData = quizDataRaw as QuizType;
const COUNDOWN_DURATION_MS = 180000;
const THANK_YOU_MESSAGE = 'Your answers have been recorded, thanks!';

const blankArr = new Array(quizData.questions.length).fill('');

export const Quiz: React.FC = () => {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [quizName, setQuizName] = useState<string>('');
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const [responseAnswers, setResponseAnswers] = useState<string[]>(blankArr);
	const [countdownFinishTime, setCountdownFinishTime] = useState<number>(
		performance.now()
	);
	const currentFieldRef = useRef<
		HTMLInputElement | HTMLTextAreaElement | HTMLFieldSetElement
	>(null);
	const response = useRef<string[]>(blankArr);
	const formRef = useRef<HTMLFormElement>(null);
	const submitButtonRef = useRef<HTMLButtonElement>(null);
	const announcerRef = useRef<HTMLDivElement>(null);
	const isOnInitialStepRef = useRef<boolean>(true);
	// "screen reader mode" -- our way of determining whether we think a screen reader is being used
	const isScreenReaderModeRef = useRef<boolean>(true);

	useEffect(() => {
		document.title = quizData.name;
		setQuestions(quizData.questions);
		setQuizName(quizData.name);
	}, []);

	useEffect(() => {
		resetQuiz();
	}, [questions]);

	// fires whenever the current step changes
	useEffect(() => {
		// don't autofocus anything on initial quiz load
		if (!isOnInitialStepRef.current) {
			currentFieldRef.current?.focus();
		}
		toggleCanSubmit(true);
	}, [currentQuestionIndex, questions]);

	const resetCountdown = useCallback(() => {
		setCountdownFinishTime(performance.now() + COUNDOWN_DURATION_MS + 1000); // extra second to linger on 0:00 at end
	}, []);

	// function to cause screen readers to instantly speak provided text
	const announce = (text: string) => {
		if (announcerRef.current) {
			announcerRef.current.innerText = text;
			setTimeout(() => {
				if (announcerRef.current) {
					announcerRef.current.innerText = '';
				}
			}, 500);
		}
	};

	// clear out all response data and return to first question
	const resetQuiz = useCallback(() => {
		setCurrentQuestionIndex(0);
		setResponseAnswers(
			// initially set all multiple choice responses to first choice by default
			quizData.questions.map((question) =>
				question.type === 'choice' ? '0' : ''
			)
		);
		resetCountdown();
	}, []);

	// every time a field changes, update the response data with that answer
	const handleFieldChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setResponseAnswers((current) => {
				const id = parseInt(
					`${event.target.getAttribute('data-question-id') || 0}`,
					10
				);
				const newAnswers = [...current];
				newAnswers[id] = event.target.value;
				return newAnswers;
			});
		},
		[]
	);

	// advance to the next question
	const handleNext = useCallback((event: React.FormEvent) => {
		event.preventDefault();
		setCurrentQuestionIndex((curr) => curr + 1);
		resetCountdown();
		isOnInitialStepRef.current = false;
	}, []);

	// submit all response data to server
	const handleFinish = useCallback((event: React.FormEvent) => {
		// TODO: post data here
		console.log(`Submitting response: ${JSON.stringify(response.current)}`);
		announce(THANK_YOU_MESSAGE);
		handleNext(event);
	}, []);

	// TODO: weird bug is causing handleFinish to submit the wrong responseData
	// (the last element is "0" instead of whatever the user changed it to)
	// workaround is to store the correct value in a ref and submit that instead
	useEffect(() => {
		response.current = responseAnswers;
	}, [responseAnswers]);

	const handleReset = (event: React.FormEvent) => {
		event.preventDefault();
		resetQuiz();
	};

	const isLast = useMemo(
		() => currentQuestionIndex === questions.length - 1,
		[currentQuestionIndex, questions]
	);
	const isDone = useMemo(
		() => currentQuestionIndex >= questions.length,
		[currentQuestionIndex, questions]
	);

	const getStatusLabel = (index?: number) => {
		if (isDone) {
			return 'Done!';
		}
		return `Question ${Math.min(
			(index || currentQuestionIndex) + 1,
			questions.length
		)} of ${questions.length}`;
	};

	const getSubmitHandler = useCallback(() => {
		if (isLast) {
			return handleFinish;
		}
		if (isDone) {
			return handleReset;
		}
		return handleNext;
	}, [isLast, isDone]);

	const getSubmitLabel = useCallback(() => {
		if (isLast) {
			return 'Finish';
		}
		if (isDone) {
			return 'Start Over';
		}
		return 'Next';
	}, [isLast, isDone]);

	const toggleCanSubmit = useCallback(
		(canSubmit: boolean) => {
			if (submitButtonRef?.current) {
				submitButtonRef.current.disabled = !canSubmit;
			}
		},
		[submitButtonRef.current]
	);

	// function to call whenever the countdown reaches zero
	const countdownCallback = useCallback(() => {
		if (formRef?.current) {
			// delay mechanism allows screen reader time to speak before advancing
			// submit button is disabled during that time to keep it fair
			toggleCanSubmit(false);
			let delay = 0;
			if (
				isScreenReaderModeRef?.current &&
				isScreenReaderModeRef.current
			) {
				delay = 2000;
			}
			setTimeout(() => {
				if (formRef?.current) {
					const event = new Event('submit', {
						bubbles: true,
						cancelable: true,
					});
					formRef.current.dispatchEvent(event);
				}
			}, delay);
		}
	}, [formRef.current]);

	const getAnswerFields = useCallback(
		({ type, choices }: Question, isCurrent: boolean, id: number) => {
			switch (type) {
				case 'short':
					return (
						<input
							type="text"
							placeholder="Your answer"
							onChange={handleFieldChange}
							data-question-id={id}
							value={responseAnswers[id]}
							tabIndex={isCurrent ? 1 : -1}
							{...(!isScreenReaderModeRef.current && isCurrent
								? {
										ref: currentFieldRef as React.RefObject<HTMLInputElement>,
								  }
								: {})}
						/>
					);
				case 'long':
					return (
						<textarea
							placeholder="Your answer"
							onChange={handleFieldChange}
							data-question-id={id}
							value={responseAnswers[id]}
							tabIndex={isCurrent ? 1 : -1}
							{...(!isScreenReaderModeRef.current && isCurrent
								? {
										ref: currentFieldRef as React.RefObject<HTMLTextAreaElement>,
								  }
								: {})}
						/>
					);
				case 'choice':
					return choices?.map((choice, index) => {
						const isChecked =
							parseInt(responseAnswers[id], 10) === index;
						return (
							<div key={`question-${id}-choice-${index}`}>
								<input
									name={`question-${id}`}
									id={`question-${id}-choice-${index}`}
									type="radio"
									value={index}
									onChange={handleFieldChange}
									data-question-id={id}
									tabIndex={isCurrent ? 1 : -1}
									checked={isChecked}
									{...(!isScreenReaderModeRef.current &&
									isCurrent &&
									isChecked
										? {
												ref: currentFieldRef as React.RefObject<HTMLInputElement>,
										  }
										: {})}
								/>
								<label
									htmlFor={`question-${id}-choice-${index}`}
								>
									{choice}
								</label>
							</div>
						);
					});
			}
		},
		[responseAnswers, ...responseAnswers]
	);

	return (
		<div id="quiz">
			<div
				id="announcer"
				aria-atomic="true"
				aria-live="assertive"
				className="sr-only"
				ref={announcerRef}
			></div>
			<h1 tabIndex={1}>{quizName}</h1>
			<form onSubmit={getSubmitHandler()} ref={formRef}>
				<ol id="steps">
					{questions.map((question, index) => {
						const isCurrent = index === currentQuestionIndex;
						const isDone = index < currentQuestionIndex;
						return (
							<li
								key={`question-${index}`}
								className={cx({
									['current']: isCurrent,
									['done']: isDone,
								})}
								aria-hidden={!isCurrent}
							>
								<fieldset
									tabIndex={isCurrent ? 1 : -1}
									role={
										question.type === 'choice'
											? 'radiogroup'
											: 'none'
									}
									onMouseDown={() => {
										// user clicked in fieldset so don't use screen reader mode
										isScreenReaderModeRef.current = false;
									}}
									{...(isScreenReaderModeRef.current &&
									isCurrent
										? {
												ref: currentFieldRef as React.RefObject<HTMLFieldSetElement>,
										  }
										: {})}
								>
									<legend id={`question-${index}-label`}>
										<span className="sr-only">
											{`${getStatusLabel()}: `}
										</span>
										{question.questionText}
									</legend>
									<div className="answer">
										{getAnswerFields(
											question,
											isCurrent,
											index
										)}
									</div>
								</fieldset>
							</li>
						);
					})}
					<li
						className={cx({
							['current']:
								currentQuestionIndex >= questions.length,
						})}
						aria-hidden={!isDone}
					>
						<h2>{THANK_YOU_MESSAGE}</h2>
					</li>
				</ol>
				<div className="footer">
					<div id="status" aria-hidden={true}>
						<h3 id="statusLabel" tabIndex={isDone ? 1 : -1}>
							{getStatusLabel()}
						</h3>
						{!isDone && (
							<h4 id="countdown">
								<Countdown
									finishTime={countdownFinishTime}
									callback={countdownCallback}
									announce={announce}
								/>
							</h4>
						)}
					</div>
					<button
						type="submit"
						tabIndex={1}
						ref={submitButtonRef}
						onMouseDown={() => {
							// user clicked submit button so don't use screen reader mode
							isScreenReaderModeRef.current = false;
						}}
					>
						{getSubmitLabel()}
					</button>
				</div>
			</form>
		</div>
	);
};
