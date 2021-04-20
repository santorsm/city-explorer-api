'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
require('dotenv').config();
const { request, response } = require('express');

// const weatherData = require('./data/weather.json');

const app = express();

app.use(cors());
const PORT = process.env.PORT || 3002;


app.get('/', (request, response) => {
  response.status(200).send('Hello, this is the root');
});

  app.get('/weather',(request, response) => {
    console.log('this is the weather')

    superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily`)
      .query({
        key: process.env.WEATHER_API_KEY,
        units: 'I',
        lat: request.query.lat,
        lon: request.query.lon,
      
      })
      .then(weatherData => {
        console.log(weatherData.body.city_name);
        console.log(weatherData.body);
        const allDailyForecasts = weatherData.body.data.map(dailyData => new Forecast(dailyData))
        response.json(allDailyForecasts);
        console.log(allDailyForecasts);
      });
  })

function Forecast(dailyData){
  this.date = dailyData.valid_date;
  this.description = dailyData.weather.description;
  this.low = dailyData.low_temp;
  this.high = dailyData.max_temp;
}

function errorHandler(error, response){
  response.status(500).send('Internal Error');
}

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
