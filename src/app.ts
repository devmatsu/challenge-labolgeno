import express from 'express';
import deviceRoutes from './routes/deviceRoutes';

const app = express();
app.use(express.json());
app.use('/api', deviceRoutes);

export default app;
