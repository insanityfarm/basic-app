import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database';
import router from './routes';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

// Use the items router
app.use('/', router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

