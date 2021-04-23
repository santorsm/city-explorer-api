'use strict';

const express = require('express');
const superagent = require('superagent');
const router = express.Router();


function weatherHandler(request,response){
  // const key = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily`;
  const queryParams = {
    key: process.env.WEATHER_API_KEY,
    units: 'I',
    days: 5,
    lat: request.query.lat,
    lon: request.query.lon,
  };
  console.log('These are my  WEATHER queryParams >>>>>>>>>>>>',queryParams);


  superagent
    .get(url)
    .query(queryParams)
    .then(weatherData  => {
      console.log(weatherData.body);
      const allDailyForecasts = weatherData.body.data.map(dailyData => new Forecast(dailyData))
      response.json(allDailyForecasts);
    })
    .catch(error => errorHandler(request, response, error));
}

function Forecast(dailyData){
  this.date = dailyData.valid_date;
  this.description = dailyData.weather.description;
  this.low = dailyData.low_temp;
  this.high = dailyData.max_temp;
}

function errorHandler(request, response, error){
  // console.log(error);
  response.status(500).send('Internal Error');
}

module.exports = weatherHandler;