'use strict';

//bring in express
const express = require('express');
const app = express();

//get variables from a .env
require('dotenv').config();

//allow others to hit our server
const cors = require('cors');
app.use(cors());

const superagent = require('superagent');
// const { request, response } = require('express');

//get handlers from their own files
const weatherHandler = require('./weather.js');
const movieHandler = require('./movies.js');

//validate that our env is working 
const PORT = process.env.PORT || 3002;

// const weatherData = require('./data/weather.json');

//proff of life
app.get('/', (request, response) => {
  response.status(200).send('Hello, this is the root');
});

//get weather data from weather API
app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);



app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
