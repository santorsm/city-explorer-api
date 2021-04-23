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

//validate that our env is working 
const PORT = process.env.PORT || 3002;

// const weatherData = require('./data/weather.json');

//proff of life
app.get('/', (request, response) => {
  response.status(200).send('Hello, this is the root');
});

//get weather data from weather API
app.get('/weather', weatherHandler);

// app.get('/weather',(request, response) => {
//   console.log('this is the weather')

//   superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily`)
//     .query({
//       key: process.env.WEATHER_API_KEY,
//       units: 'I',
//       days: 5,
//       lat: request.query.lat,
//       lon: request.query.lon,
//     })
//     .then(weatherData => {
//       console.log(weatherData.body.city_name);
//       const allDailyForecasts = weatherData.body.data.map(dailyData => new Forecast(dailyData))
//       response.json(allDailyForecasts);
//     });
// })

app.get('/movies', movieHandler);

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
  console.log('These are my MOVIE queryParams >>>>>>>>>>>>',queryParams);
  superagent.get(url)
    .query(queryParams)
    .then(data => {
      let movies = data.body.results.map(movie => new Movie(movie));
      response.status(200).send(movies);
      console.log(movies);
    })
    .catch(error => errorHandler(request, response, error));
}

function Movie(movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.image_url = (movie.poster_path) ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined;
}

function errorHandler(request, response, error){
  // console.log(error);
  response.status(500).send('Internal Error');
}

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
