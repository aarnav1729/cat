const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

// JWT middleware for validating Auth0 tokens
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

// protect all routes
app.use('/api/finance', checkJwt);

// API Endpoints (Protected)
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
