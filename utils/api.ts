import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from './config';

// Fallback API key for testing purposes
const API_KEY = TMDB_API_KEY || '530bdf979dd5e101be641fb42df8a872';
const BASE_URL = TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getTrendingMovies = async (page: number = 1) => {
  const response = await api.get('/trending/movie/week', {
    params: { page }
  });
  return response.data;
};

export const getPopularMovies = async (page: number = 1) => {
  const response = await api.get('/movie/popular', {
    params: { page }
  });
  return response.data;
};

export const getTopRatedMovies = async (page: number = 1) => {
  const response = await api.get('/movie/top_rated', {
    params: { page }
  });
  return response.data;
};

export const getUpcomingMovies = async (page: number = 1) => {
  const response = await api.get('/movie/upcoming', {
    params: { page }
  });
  return response.data.results;
};

export const searchMovies = async (query: string) => {
  const response = await api.get('/search/movie', { params: { query } });
  return response.data.results;
};

export const getFeaturedMovies = async () => {
  const response = await api.get('/trending/movie/week');
  return response.data.results;
};

export const getAnimeMovies = async () => {
  const response = await api.get('/discover/movie', {
    params: {
      with_keywords: '210024|287501',
    },
  });
  return response.data.results;
};

export const getPopularTvSeries = async () => {
  const response = await api.get('/tv/popular');
  return response.data.results;
};

export const getAiringTodayTvSeries = async () => {
  const response = await api.get('/tv/airing_today');
  return response.data.results;
};

export const getOnTheAirTvSeries = async () => {
  const response = await api.get('/tv/on_the_air');
  return response.data.results;
};

export const getTopRatedTvSeries = async () => {
  const response = await api.get('/tv/top_rated');
  return response.data.results;
};

export const getMoviesByGenre = async (genreId: number) => {
  const response = await api.get('/discover/movie', {
    params: {
      with_genres: genreId,
    },
  });
  return response.data.results;
};

export const getTrailer = async (id: number, type: 'movie' | 'tv') => {
  const response = await api.get(`/${type}/${id}/videos`);
  const trailer = response.data.results.find((video: any) => video.type === 'Trailer');
  return trailer ? trailer.key : null;
};

export const getMovieDetails = async (id: number) => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};

export const getTVDetails = async (id: number) => {
  const response = await api.get(`/tv/${id}`);
  return response.data;
};

export const getMovieCredits = async (id: number) => {
  const response = await api.get(`/movie/${id}/credits`);
  return response.data;
};

export const getSimilarMovies = async (id: number) => {
  const response = await api.get(`/movie/${id}/similar`);
  return response.data;
};

export const getRecommendedMovies = async (id: number) => {
  const response = await api.get(`/movie/${id}/recommendations`);
  return response.data;
};

// Helper functions to fetch multiple pages of movies
export const getMultiplePagesTrending = async (pages: number = 3, startPage: number = 1) => {
  const promises = [];
  for (let i = startPage; i < startPage + pages; i++) {
    promises.push(getTrendingMovies(i));
  }
  const results = await Promise.all(promises);
  const allMovies = results.flatMap(result => result.results);
  return allMovies;
};

export const getMultiplePagesPopular = async (pages: number = 3, startPage: number = 1) => {
  const promises = [];
  for (let i = startPage; i < startPage + pages; i++) {
    promises.push(getPopularMovies(i));
  }
  const results = await Promise.all(promises);
  const allMovies = results.flatMap(result => result.results);
  return allMovies;
};

export const getMultiplePagesTopRated = async (pages: number = 3, startPage: number = 1) => {
  const promises = [];
  for (let i = startPage; i < startPage + pages; i++) {
    promises.push(getTopRatedMovies(i));
  }
  const results = await Promise.all(promises);
  const allMovies = results.flatMap(result => result.results);
  return allMovies;
};

export const getMultiplePagesUpcoming = async (pages: number = 3, startPage: number = 1) => {
  const promises = [];
  for (let i = startPage; i < startPage + pages; i++) {
    promises.push(getUpcomingMovies(i));
  }
  const results = await Promise.all(promises);
  const allMovies = results.flat();
  return allMovies;
};
