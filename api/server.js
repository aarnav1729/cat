const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');

// Initialize dotenv to load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Apply middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define schemas and models
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

// JWT middleware for protecting routes
const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-f6hwpovky1p3rld7.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://cat-4ouq.onrender.com/api',
  issuer: 'https://dev-f6hwpovky1p3rld7.us.auth0.com/',
  algorithms: ['RS256'],
});

// Routes to handle finance data for each user
app.use('/api/finance', checkJwt);

app.get('/api/finance', async (req, res) => {
  const { userId } = req.query;
  try {
    const userFinance = await UserFinance.findOne({ userId });
    res.json(userFinance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.post('/api/finance', async (req, res) => {
  const { userId, date, entries, categories } = req.body;
  try {
    let userFinance = await UserFinance.findOne({ userId });

    if (!userFinance) {
      // Create new user finance record if not found
      userFinance = new UserFinance({ userId, date, entries, categories });
    } else {
      // Update the existing user data
      userFinance.entries = entries;
      userFinance.categories = categories;
    }

    await userFinance.save();
    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving data' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
