import { Router } from 'express';
import { Quiz, Question } from './models/models';

const router = Router();

// Get all quizzes
router.get('/quizzes', async (req, res) => {
	try {
		const items = await Quiz.findAll({
			order: [['id', 'ASC']],
		});
		res.json(items);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch quizzes' });
	}
});

// Get all questions
router.get('/questions', async (req, res) => {
	try {
		const items = await Question.findAll({
			order: [['id', 'ASC']],
		});
		res.json(items);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch questions' });
	}
});

// Create a new quiz
router.post('/makeQuiz', async (req, res) => {
	try {
		const newItem = await Quiz.create({
			name: 'My Fun Quiz!',
		});
		res.json(newItem);
	} catch (error) {
		res.status(500).json({ error });
	}
});

// Create a new item
router.post('/makeQuestions', async (req, res) => {
	try {
		const newItem = await Question.bulkCreate([
			{
				questionText: 'What is your name?',
				type: 'short',
			},
			{
				questionText: 'Why is the sky blue?',
				type: 'long',
			},
			{
				questionText: 'How are you feeling?',
				type: 'choice',
				choices: ['Good', 'Great', 'Fantastic!', 'PERFECT'],
			},
		]);
		res.json(newItem);
	} catch (error) {
		res.status(500).json({ error });
	}
});

// // Delete an item
router.delete('/quiz/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const item = await Quiz.findByPk(id);
		if (!item) {
			return res.status(404).json({ error: 'Quiz not found' });
		}
		await item.destroy();
		res.json({ message: 'Quiz deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete quiz' });
	}
});

// // Update an item
// router.put('/items/:id', async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const { name } = req.body;

// 		const item = await Item.findByPk(id);
// 		if (!item) {
// 			return res.status(404).json({ error: 'Item not found' });
// 		}

// 		item.name = name;
// 		await item.save();

// 		res.json(item);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Failed to update item' });
// 	}
// });

export default router;
