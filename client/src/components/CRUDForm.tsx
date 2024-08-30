import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Item {
	id: number;
	name: string;
}

const CRUDForm: React.FC = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [name, setName] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [currentItem, setCurrentItem] = useState<Item | null>(null);

	const fetchItems = async () => {
		const response = await axios.get<Item[]>('http://localhost:3001/items');
		setItems(response.data);
	};

	useEffect(() => {
		fetchItems();
	}, []);

	const addItem = async (e: React.FormEvent) => {
		e.preventDefault();
		await axios.post('http://localhost:3001/items', { name });
		setName('');
		fetchItems();
	};

	const deleteItem = async (id: number) => {
		await axios.delete(`http://localhost:3001/items/${id}`);
		fetchItems();
	};

	const handleEditClick = (item: Item) => {
		setIsEditing(true);
		setCurrentItem(item);
		console.log(item.id);
		setName(item.name);
	};

	const updateItem = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentItem) return;

		await axios.put(`http://localhost:3001/items/${currentItem.id}`, {
			name,
		});
		setName('');
		setIsEditing(false);
		setCurrentItem(null);
		fetchItems();
	};

	return (
		<div>
			<h1>Basic App</h1>
			<form onSubmit={isEditing ? updateItem : addItem}>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Item name"
				/>
				<button type="submit">
					{isEditing ? 'Update Item' : 'Add Item'}
				</button>
			</form>
			<ul>
				{items.map((item) => (
					<li key={item.id}>
						{item.name}
						<button onClick={() => handleEditClick(item)}>
							Edit
						</button>
						<button onClick={() => deleteItem(item.id)}>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CRUDForm;
