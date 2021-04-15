'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { request, response } = require('express');

const weatherData = require('./data/weather.json');

const app = express();

app.use(cors());
const PORT = process.env.PORT || 3002;


app.get('/', (request, response) => {
  response.status(200).send('Hello!');
});

  app.get('/weather',(request, response) => {
    try{
      const allDailyForecasts = weatherData.data.map(dailyData => new Forecast(dailyData));
      response.json(allDailyForecasts);
    } catch(error){
      errorHandler(error, response);
    }
  })

function Forecast(dailyData){
  this.date = dailyData.datetime;
  this.description = dailyData.weather.description;
}

function errorHandler(error, response){
  response.status(500).send('Internal Error');
}

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
