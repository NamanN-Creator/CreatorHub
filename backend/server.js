require('dotenv').config();

// Fallbacks so login doesn't crash with a 500 if .env is missing.
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev_only_secret_change_me';
  console.warn('JWT_SECRET not set in .env — using a dev-only default.');
}
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/creatorhub';
}
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const taskRoutes = require('./routes/taskRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invoices', invoiceRoutes);

app.get('/', (req, res) => res.send('CreatorHub API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
