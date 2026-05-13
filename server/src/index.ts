import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'ApexVault API is running' });
});

app.listen(PORT, () => {
  console.log(`\n🏦 ApexVault API running on http://localhost:${PORT}`);
});

export default app;
