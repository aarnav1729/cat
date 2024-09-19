const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User finance schema
const entrySchema = new mongoose.Schema({
  amount: Number,
  method: String,
  category: String,
  type: {
    type: String,
    enum: ['income', 'expenditure', 'investment'],
    default: 'expenditure'
  }
});

const userFinanceSchema = new mongoose.Schema({
  userId: String,
  date: String,
  categories: {
    income: [String],
    expenditure: [String],
    investment: [String]
  },
  entries: [entrySchema]
});

const UserFinance = mongoose.model('UserFinance', userFinanceSchema);

// API Endpoints
app.post('/api/finance', async (req, res) => {
  const { userId, date, entries, categories } = req.body;
  try {
    const existingData = await UserFinance.findOne({ userId, date });
    if (existingData) {
      existingData.entries = entries;
      existingData.categories = categories;
      await existingData.save();
    } else {
      const finance = new UserFinance({ userId, date, entries, categories });
      await finance.save();
    }
    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving data' });
  }
});

app.get('/api/finance', async (req, res) => {
  const { userId } = req.query;
  try {
    const finances = await UserFinance.find({ userId });
    res.json(finances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Listen on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
