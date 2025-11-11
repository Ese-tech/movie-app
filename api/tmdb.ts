import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY || '530bdf979dd5e101be641fb42df8a872';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
});

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  popularity: number;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  origin_country: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Movie endpoints
export const fetchTrendingMovies = async (): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get('/trending/movie/week');
  return response.data;
};

export const fetchPopularMovies = async (): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get('/movie/popular');
  return response.data;
};

export const fetchTopRatedMovies = async (): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get('/movie/top_rated');
  return response.data;
};

export const fetchUpcomingMovies = async (): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get('/movie/upcoming');
  return response.data;
};

export const fetchNowPlayingMovies = async (): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get('/movie/now_playing');
  return response.data;
};

// Genre endpoints
export const fetchGenres = async (): Promise<{ genres: Genre[] }> => {
  const response = await tmdbApi.get('/genre/movie/list');
  return response.data;
};

export const fetchMoviesByGenre = async (genreId: number): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get('/discover/movie', {
    params: { with_genres: genreId }
  });
  return response.data;
};

// Search endpoints
export const searchMovies = async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query, page }
  });
  return response.data;
};

export const searchTVShows = async (query: string, page: number = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get('/search/tv', {
    params: { query, page }
  });
  return response.data;
};

export const searchMulti = async (query: string, page: number = 1) => {
  const response = await tmdbApi.get('/search/multi', {
    params: { query, page }
  });
  return response.data;
};

// Movie details and videos
export const fetchMovieDetails = async (movieId: number) => {
  const response = await tmdbApi.get(`/movie/${movieId}`, {
    params: { append_to_response: 'videos,credits,similar' }
  });
  return response.data;
};

export const fetchMovieVideos = async (movieId: number): Promise<{ results: Video[] }> => {
  const response = await tmdbApi.get(`/movie/${movieId}/videos`);
  return response.data;
};

export const fetchTVShowDetails = async (tvId: number) => {
  const response = await tmdbApi.get(`/tv/${tvId}`, {
    params: { append_to_response: 'videos,credits,similar' }
  });
  return response.data;
};

export const fetchTVShowVideos = async (tvId: number): Promise<{ results: Video[] }> => {
  const response = await tmdbApi.get(`/tv/${tvId}/videos`);
  return response.data;
};

// Image URLs
export const getImageUrl = (path: string, size: string = 'w500'): string => {
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string): string => {
  return getImageUrl(path, 'w500');
};

export const getBackdropUrl = (path: string): string => {
  return getImageUrl(path, 'w1280');
};

// TV Shows
export const fetchPopularTVShows = async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get('/tv/popular', {
    params: { page }
  });
  return response.data;
};

export const fetchTopRatedTVShows = async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get('/tv/top_rated', {
    params: { page }
  });
  return response.data;
};

export const fetchTrendingTVShows = async (): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get('/trending/tv/week');
  return response.data;
};

export const fetchOnTheAirTVShows = async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get('/tv/on_the_air', {
    params: { page }
  });
  return response.data;
};

export const fetchAiringTodayTVShows = async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get('/tv/airing_today', {
    params: { page }
  });
  return response.data;
};

// Genre functions for TV
export const fetchTVGenres = async (): Promise<{ genres: Genre[] }> => {
  const response = await tmdbApi.get('/genre/tv/list');
  return response.data;
};

export const fetchTVShowsByGenre = async (genreId: number, page: number = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await tmdbApi.get('/discover/tv', {
    params: { with_genres: genreId, page }
  });
  return response.data;
};

// Utility functions
export const getTrailerUrl = (videoKey: string): string => {
  return `https://www.youtube.com/watch?v=${videoKey}`;
};

export const getTrailerEmbedUrl = (videoKey: string): string => {
  return `https://www.youtube.com/embed/${videoKey}`;
};