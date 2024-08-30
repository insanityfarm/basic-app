import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import axios from 'axios';

type QuestionType = 'short' | 'long' | 'choice';
interface Question {
	id: number;
	questionText: string;
	type: QuestionType;
	choices?: string[];
}

const Quiz: React.FC = () => {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const currentFieldRef = useRef<MutableRefObject<HTMLElement> | null>(null);

	const [responseAnswers, setResponseAnswers] = useState<string[]>([]);

	const fetchQuestions = async () => {
		const response = await axios.get<Question[]>(
			'http://localhost:3001/questions'
		);
		setQuestions(response.data);
	};

	useEffect(() => {
		fetchQuestions();
	}, []);

	// const updateItem = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	if (!currentQuestion) return;

	// 	await axios.put(`http://localhost:3001/items/${currentQuestion.id}`, {
	// 		name,
	// 	});
	// 	setName('');
	// 	setCurrentQuestion(null);
	// 	fetchQuestions();
	// };

	const getAnswerFields = (
		{ id, type, choices }: Question,
		isCurrent: boolean
	) => {
		// TODO: use currentFieldRef on whichever is the current field
		switch (type) {
			case 'short':
				return (
					<input
						type="text"
						name="answer"
						placeholder="Your answer"
					/>
				);
			case 'long':
				return <textarea name="answer" placeholder="Your answer" />;
			case 'choice':
				return (
					<fieldset>
						{choices?.map((choice, index) => (
							<label>
								<input
									type="radio"
									name="answer"
									key={`question-${id}-choice-${index}`}
									value={index}
									onChange={(e) => {
										setResponseAnswers((current) => [
											...current,
											e.target.value,
										]);
									}}
								/>
								{choice}
							</label>
						))}
					</fieldset>
				);
		}
	};

	const handleNext = async (event: React.FormEvent) => {
		event.preventDefault();
		setCurrentQuestionIndex((curr) => curr + 1);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setCurrentQuestionIndex((curr) => curr + 1);
		await axios.post('http://localhost:3001/answers', {
			...responseAnswers,
		});
	};

	useEffect(() => {
		// TODO: Autofocus the current field by ref
		// currentFieldRef.current && currentFieldRef.current.focus();
	}, [currentFieldRef]);

	return (
		<div>
			<h1>Quiz!</h1>
			<ul id="questions">
				{questions.map((question, index) => {
					const isCurrent = index === currentQuestionIndex;
					const isLast = index === questions.length - 1;
					return (
						<li
							key={question.id}
							className={isCurrent ? 'current' : ''}
						>
							<h1>{question.questionText}</h1>
							<form onSubmit={isLast ? handleSubmit : handleNext}>
								<input
									type="hidden"
									name="index"
									value={index}
								/>
								<div className="answer">
									{getAnswerFields(question, isCurrent)}
								</div>
								<div className="footer">
									<button type="submit">
										{isLast ? 'Finish' : 'Next'}
									</button>
								</div>
							</form>
						</li>
					);
				})}
			</ul>
			<h1>Thanks for submitting!</h1>
		</div>
	);
};

export default Quiz;
