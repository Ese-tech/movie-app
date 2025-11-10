import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from './config';

const API_KEY = TMDB_API_KEY || 'YOUR_API_KEY';
const BASE_URL = TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getPopularMovies = async () => {
  const response = await api.get('/movie/popular');
  return response.data.results;
};

export const getTopRatedMovies = async () => {
  const response = await api.get('/movie/top_rated');
  return response.data.results;
};

export const getUpcomingMovies = async () => {
  const response = await api.get('/movie/upcoming');
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
