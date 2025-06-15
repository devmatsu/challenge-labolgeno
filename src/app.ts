import express from 'express';

import deviceRoutes from './routes/deviceRoutes';
import { authMiddleware } from './middlewares/auth';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use('/api', authMiddleware, deviceRoutes);

app.use(errorHandler);

export default app;
