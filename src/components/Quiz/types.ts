type QuestionType = 'short' | 'long' | 'choice';
export interface Question {
	questionText: string;
	type: QuestionType;
	choices?: string[];
}
export interface Quiz {
	name: string;
	questions: Question[];
}
