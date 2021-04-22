'use strict';
const router = require('./router.js');
const express = require('express');
const superagent = require('superagent');
const { request, response } = require('express');
const cors = require('cors');
require('dotenv').config();

// const weatherData = require('./data/weather.json');

const app = express();

app.use(cors());
const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Hello, this is the root');
});

app.use(router);





app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
