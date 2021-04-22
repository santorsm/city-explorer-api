'use strict';

const express = require('express');
const superagent = require('superagent');

const router = express.Router();

router.get('/weather',(request, response) => {
  console.log('this is the weather')

  superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily`)
    .query({
      key: process.env.WEATHER_API_KEY,
      units: 'I',
      days: 5,
      lat: request.query.lat,
      lon: request.query.lon,
    })
    .then(weatherData => {
      console.log(weatherData.body.city_name);
      const allDailyForecasts = weatherData.body.data.map(dailyData => new Forecast(dailyData))
      response.json(allDailyForecasts);
    });
})

router.get('/movies', movieHandler);

function movieHandler (request, response){
  const key = process.env.MOVIE_API_KEY;
  // const moviePosterUrl = 'https://image.tmdb.org/t/p/w500';
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}`;
  const queryParams = {
    language: 'en-US',
    query: request.query.city,
    page: 1,
    include_adult: false
  };
  console.log('These are my queryParams >>>>>>>>>>>>',queryParams);
  superagent.get(url)
    .query(queryParams)
    .then(data => {
      let movies = data.body.results.map(movie => new Movie(movie));
      response.status(200).send(movies);
      console.log(movies);
    })
    .catch(error => errorHandler(request, response, error));
}

function Forecast(dailyData){
  this.date = dailyData.valid_date;
  this.description = dailyData.weather.description;
  this.low = dailyData.low_temp;
  this.high = dailyData.max_temp;
}

function Movie(movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.image_url = (movie.poster_path) ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined;
}

function errorHandler(request, response, error){
  console.log(error);
  response.status(500).send('Internal Error');
}

module.exports = router;

