import express from 'express';

import deviceRoutes from './routes/deviceRoutes';
import { authMiddleware } from './middlewares/auth';

const app = express();

app.use(express.json());
app.use('/api', authMiddleware, deviceRoutes);

export default app;
