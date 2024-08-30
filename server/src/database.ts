import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
	process.env.DB_NAME as string,
	process.env.DB_USER as string,
	process.env.DB_PASSWORD as string,
	{
		host: process.env.DB_HOST,
		dialect: 'postgres',
	}
);

export const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
		await sequelize.sync(); // This will create the tables if they don't exist
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};
