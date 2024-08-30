import { Router } from 'express';
import Item from './models/item';

const router = Router();

// Get all items
router.get('/items', async (req, res) => {
	try {
		const items = await Item.findAll({
			order: [['id', 'ASC']],
		});
		res.json(items);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch items' });
	}
});

// Create a new item
router.post('/items', async (req, res) => {
	try {
		const { name } = req.body;
		const newItem = await Item.create({ name });
		res.json(newItem);
	} catch (error) {
		res.status(500).json({ error: 'Failed to create item' });
	}
});

// Delete an item
router.delete('/items/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const item = await Item.findByPk(id);
		if (!item) {
			return res.status(404).json({ error: 'Item not found' });
		}
		await item.destroy();
		res.json({ message: 'Item deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete item' });
	}
});

// Update an item
router.put('/items/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const item = await Item.findByPk(id);
		if (!item) {
			return res.status(404).json({ error: 'Item not found' });
		}

		item.name = name;
		await item.save();

		res.json(item);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update item' });
	}
});

export default router;
