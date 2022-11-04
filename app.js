const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const domesticRouter = require('./routes/domesticRoutes');

// some basic middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/shipping-rates', domesticRouter);

module.exports = app;
