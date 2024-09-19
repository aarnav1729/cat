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

// Define your finance routes, protect them using checkJwt
app.use('/api/finance', checkJwt);

// Sample route to test the API
app.get('/api/finance', (req, res) => {
  res.send('Finance API works');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});