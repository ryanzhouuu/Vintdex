import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
// Middleware
import { errorHandler } from './api/middleware/error';

// Routes
import searchRoutes from './api/routes/search';
import trackingRoutes from './api/routes/tracking';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use('/api/search', searchRoutes);
app.use('/api/tracking', trackingRoutes);

app.use((req, res) => {
    res.status(400).json({ error: 'Not Found' });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})