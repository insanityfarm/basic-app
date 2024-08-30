import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

enum QuestionType {
	'short',
	'long',
	'choice',
}

class Question extends Model {
	public Id!: number;
	public QuestionText!: string;
	public Type!: QuestionType;
	public Choices?: string;
}
Question.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		questionText: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM('short', 'long', 'choice'),
			allowNull: false,
		},
		choices: {
			type: DataTypes.ARRAY(DataTypes.TEXT),
		},
	},
	{
		sequelize,
		modelName: 'Question',
	}
);

class Answer extends Model {
	public Id!: number;
	public AnswerText!: string;
}
Answer.init(
	{
		Id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		AnswerText: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Answer',
	}
);

class Response extends Model {
	public Id!: number;
}
Response.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
	},
	{
		sequelize,
		modelName: 'Response',
	}
);

class Quiz extends Model {
	public static Id: number;
	public static Name: string;
	public static Questions: Question[];
}
Quiz.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Quiz',
	}
);

Question.belongsTo(Quiz);
Answer.belongsTo(Response);
Answer.hasOne(Question);
Response.hasMany(Answer, { as: 'answers' });
Quiz.hasMany(Question, { as: 'Questions' });

export { Quiz, Question, Answer, Response };
