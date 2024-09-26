const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const bridgeRoutes = require('./routes/bridgeRoutes');
const priceRoutes = require('./routes/priceRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bridge', bridgeRoutes);
app.use('/api/price', priceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;