const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routesConfig = require('./config/routes.config');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'API-Gateway' });
});

// Proxy and aggregation routing to be registered dynamically
module.exports = app;
