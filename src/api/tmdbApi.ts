import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../utils/config';
import { Movie, TVShow, Genre, TMDBResponse, MovieDetails, Video, Cast, Crew } from '../../types';

// Fallback API key for testing purposes
const API_KEY = TMDB_API_KEY || '530bdf979dd5e101be641fb42df8a872';
const BASE_URL = TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// ============ MOVIE API ============
export const movieAPI = {
  // Get popular movies
  getPopular: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get('/movie/popular', { params: { page } });
    return response.data;
  },

  // Get top rated movies
  getTopRated: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get('/movie/top_rated', { params: { page } });
    return response.data;
  },

  // Get upcoming movies
  getUpcoming: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get('/movie/upcoming', { params: { page } });
    return response.data;
  },

  // Get now playing movies
  getNowPlaying: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get('/movie/now_playing', { params: { page } });
    return response.data;
  },

  // Get movie details by ID
  getDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar,recommendations'
      }
    });
    return response.data;
  },

  // Get movie credits (cast and crew)
  getCredits: async (movieId: number): Promise<{ cast: Cast[]; crew: Crew[] }> => {
    const response = await api.get(`/movie/${movieId}/credits`);
    return response.data;
  },

  // Get similar movies
  getSimilar: async (movieId: number, page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get(`/movie/${movieId}/similar`, { params: { page } });
    return response.data;
  },

  // Get movie recommendations
  getRecommendations: async (movieId: number, page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get(`/movie/${movieId}/recommendations`, { params: { page } });
    return response.data;
  },

  // Get movie videos (trailers, teasers, etc.)
  getVideos: async (movieId: number): Promise<{ results: Video[] }> => {
    const response = await api.get(`/movie/${movieId}/videos`);
    return response.data;
  },

  // Get movie trailer key
  getTrailerKey: async (movieId: number): Promise<string | null> => {
    const response = await api.get(`/movie/${movieId}/videos`);
    const trailer = response.data.results.find((video: Video) => video.type === 'Trailer');
    return trailer ? trailer.key : null;
  },

  // Get multiple pages of movies (helper function)
  getMultiplePages: async (
    endpoint: string,
    pages: number = 3,
    startPage: number = 1
  ): Promise<Movie[]> => {
    const promises = [];
    for (let i = startPage; i < startPage + pages; i++) {
      promises.push(api.get(`/movie/${endpoint}`, { params: { page: i } }));
    }
    const results = await Promise.all(promises);
    return results.flatMap(result => result.data.results);
  },
};

// ============ TV API ============
export const tvAPI = {
  // Get popular TV shows
  getPopular: async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get('/tv/popular', { params: { page } });
    return response.data;
  },

  // Get top rated TV shows
  getTopRated: async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get('/tv/top_rated', { params: { page } });
    return response.data;
  },

  // Get on the air TV shows
  getOnTheAir: async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get('/tv/on_the_air', { params: { page } });
    return response.data;
  },

  // Get airing today TV shows
  getAiringToday: async (page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get('/tv/airing_today', { params: { page } });
    return response.data;
  },

  // Get TV show details by ID
  getDetails: async (tvId: number): Promise<any> => {
    const response = await api.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'videos,credits,similar,recommendations'
      }
    });
    return response.data;
  },

  // Get TV show credits
  getCredits: async (tvId: number): Promise<{ cast: Cast[]; crew: Crew[] }> => {
    const response = await api.get(`/tv/${tvId}/credits`);
    return response.data;
  },

  // Get similar TV shows
  getSimilar: async (tvId: number, page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get(`/tv/${tvId}/similar`, { params: { page } });
    return response.data;
  },

  // Get TV show recommendations
  getRecommendations: async (tvId: number, page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get(`/tv/${tvId}/recommendations`, { params: { page } });
    return response.data;
  },

  // Get TV show videos
  getVideos: async (tvId: number): Promise<{ results: Video[] }> => {
    const response = await api.get(`/tv/${tvId}/videos`);
    return response.data;
  },

  // Get TV show trailer key
  getTrailerKey: async (tvId: number): Promise<string | null> => {
    const response = await api.get(`/tv/${tvId}/videos`);
    const trailer = response.data.results.find((video: Video) => video.type === 'Trailer');
    return trailer ? trailer.key : null;
  },
};

// ============ PERSON API ============
export const personAPI = {
  // Get person details
  getDetails: async (personId: number): Promise<any> => {
    const response = await api.get(`/person/${personId}`);
    return response.data;
  },

  // Get person movie credits
  getMovieCredits: async (personId: number): Promise<any> => {
    const response = await api.get(`/person/${personId}/movie_credits`);
    return response.data;
  },

  // Get person TV credits
  getTvCredits: async (personId: number): Promise<any> => {
    const response = await api.get(`/person/${personId}/tv_credits`);
    return response.data;
  },

  // Get combined credits
  getCombinedCredits: async (personId: number): Promise<any> => {
    const response = await api.get(`/person/${personId}/combined_credits`);
    return response.data;
  },

  // Get popular people
  getPopular: async (page: number = 1): Promise<any> => {
    const response = await api.get('/person/popular', { params: { page } });
    return response.data;
  },
};

// ============ DISCOVER API ============
export const discoverAPI = {
  // Discover movies with filters
  movies: async (params: any = {}): Promise<TMDBResponse<Movie>> => {
    const response = await api.get('/discover/movie', { params });
    return response.data;
  },

  // Discover TV shows with filters
  tv: async (params: any = {}): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get('/discover/tv', { params });
    return response.data;
  },

  // Get movies by genre
  moviesByGenre: async (genreId: number, page: number = 1): Promise<Movie[]> => {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
      },
    });
    return response.data.results;
  },

  // Get TV shows by genre
  tvByGenre: async (genreId: number, page: number = 1): Promise<TVShow[]> => {
    const response = await api.get('/discover/tv', {
      params: {
        with_genres: genreId,
        page,
      },
    });
    return response.data.results;
  },

  // Get anime movies (using keywords)
  animeMovies: async (page: number = 1): Promise<Movie[]> => {
    const response = await api.get('/discover/movie', {
      params: {
        with_keywords: '210024|287501', // Anime keywords
        page,
      },
    });
    return response.data.results;
  },
};

// ============ TRENDING API ============
export const trendingAPI = {
  // Get trending movies
  movies: async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get(`/trending/movie/${timeWindow}`, { params: { page } });
    return response.data;
  },

  // Get trending TV shows
  tv: async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get(`/trending/tv/${timeWindow}`, { params: { page } });
    return response.data;
  },

  // Get trending people
  people: async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<any> => {
    const response = await api.get(`/trending/person/${timeWindow}`, { params: { page } });
    return response.data;
  },

  // Get all trending content
  all: async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<any> => {
    const response = await api.get(`/trending/all/${timeWindow}`, { params: { page } });
    return response.data;
  },

  // Get multiple pages of trending movies
  getMultiplePages: async (
    timeWindow: 'day' | 'week' = 'week',
    pages: number = 3,
    startPage: number = 1
  ): Promise<Movie[]> => {
    const promises = [];
    for (let i = startPage; i < startPage + pages; i++) {
      promises.push(api.get(`/trending/movie/${timeWindow}`, { params: { page: i } }));
    }
    const results = await Promise.all(promises);
    return results.flatMap(result => result.data.results);
  },
};

// ============ GENRE API ============
export const genreAPI = {
  // Get movie genres
  getMovieGenres: async (): Promise<Genre[]> => {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  },

  // Get TV genres
  getTvGenres: async (): Promise<Genre[]> => {
    const response = await api.get('/genre/tv/list');
    return response.data.genres;
  },
};

// ============ SEARCH API ============
export const searchAPI = {
  // Search movies
  movies: async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Search TV shows
  tv: async (query: string, page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get('/search/tv', {
      params: { query, page },
    });
    return response.data;
  },

  // Search people
  people: async (query: string, page: number = 1): Promise<any> => {
    const response = await api.get('/search/person', {
      params: { query, page },
    });
    return response.data;
  },

  // Multi search (movies, TV shows, people)
  multi: async (query: string, page: number = 1): Promise<any> => {
    const response = await api.get('/search/multi', {
      params: { query, page },
    });
    return response.data;
  },

  // Search collections
  collections: async (query: string, page: number = 1): Promise<any> => {
    const response = await api.get('/search/collection', {
      params: { query, page },
    });
    return response.data;
  },

  // Search companies
  companies: async (query: string, page: number = 1): Promise<any> => {
    const response = await api.get('/search/company', {
      params: { query, page },
    });
    return response.data;
  },

  // Search keywords
  keywords: async (query: string, page: number = 1): Promise<any> => {
    const response = await api.get('/search/keyword', {
      params: { query, page },
    });
    return response.data;
  },
};

// ============ PROVIDER API ============
export const providerAPI = {
  // Get available regions
  getRegions: async (): Promise<any> => {
    const response = await api.get('/watch/providers/regions');
    return response.data;
  },

  // Get movie providers
  getMovieProviders: async (movieId: number): Promise<any> => {
    const response = await api.get(`/movie/${movieId}/watch/providers`);
    return response.data;
  },

  // Get TV providers
  getTvProviders: async (tvId: number): Promise<any> => {
    const response = await api.get(`/tv/${tvId}/watch/providers`);
    return response.data;
  },
};

// ============ ACCOUNT API ============ 
export const accountAPI = {
  // Get account details (requires session_id)
  getDetails: async (sessionId: string): Promise<any> => {
    const response = await api.get('/account', {
      params: { session_id: sessionId },
    });
    return response.data;
  },

  // Get favorite movies
  getFavoriteMovies: async (accountId: number, sessionId: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get(`/account/${accountId}/favorite/movies`, {
      params: { session_id: sessionId, page },
    });
    return response.data;
  },

  // Get favorite TV shows
  getFavoriteTv: async (accountId: number, sessionId: string, page: number = 1): Promise<TMDBResponse<TVShow>> => {
    const response = await api.get(`/account/${accountId}/favorite/tv`, {
      params: { session_id: sessionId, page },
    });
    return response.data;
  },

  // Add to favorites
  markAsFavorite: async (
    accountId: number,
    sessionId: string,
    mediaType: 'movie' | 'tv',
    mediaId: number,
    favorite: boolean
  ): Promise<any> => {
    const response = await api.post(
      `/account/${accountId}/favorite`,
      {
        media_type: mediaType,
        media_id: mediaId,
        favorite,
      },
      {
        params: { session_id: sessionId },
      }
    );
    return response.data;
  },

  // Get watchlist
  getWatchlistMovies: async (accountId: number, sessionId: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await api.get(`/account/${accountId}/watchlist/movies`, {
      params: { session_id: sessionId, page },
    });
    return response.data;
  },

  // Add to watchlist
  addToWatchlist: async (
    accountId: number,
    sessionId: string,
    mediaType: 'movie' | 'tv',
    mediaId: number,
    watchlist: boolean
  ): Promise<any> => {
    const response = await api.post(
      `/account/${accountId}/watchlist`,
      {
        media_type: mediaType,
        media_id: mediaId,
        watchlist,
      },
      {
        params: { session_id: sessionId },
      }
    );
    return response.data;
  },
};

// ============ HELPER FUNCTIONS ============

// Get trailer for movie or TV show
export const getTrailer = async (id: number, type: 'movie' | 'tv'): Promise<string | null> => {
  if (type === 'movie') {
    return movieAPI.getTrailerKey(id);
  } else {
    return tvAPI.getTrailerKey(id);
  }
};

// Get multiple pages of any content type
export const getMultiplePages = async <T>(
  apiCall: (page: number) => Promise<TMDBResponse<T>>,
  pages: number = 3,
  startPage: number = 1
): Promise<T[]> => {
  const promises = [];
  for (let i = startPage; i < startPage + pages; i++) {
    promises.push(apiCall(i));
  }
  const results = await Promise.all(promises);
  return results.flatMap(result => result.results);
};

// Backward compatibility exports
export const getTrendingMovies = trendingAPI.movies;
export const getPopularMovies = movieAPI.getPopular;
export const getTopRatedMovies = movieAPI.getTopRated;
export const getUpcomingMovies = movieAPI.getUpcoming;
export const searchMovies = searchAPI.movies;
export const getFeaturedMovies = () => trendingAPI.movies('week', 1).then(data => data.results);
export const getAnimeMovies = () => discoverAPI.animeMovies(1);
export const getPopularTvSeries = () => tvAPI.getPopular(1).then(data => data.results);
export const getAiringTodayTvSeries = () => tvAPI.getAiringToday(1).then(data => data.results);
export const getOnTheAirTvSeries = () => tvAPI.getOnTheAir(1).then(data => data.results);
export const getTopRatedTvSeries = () => tvAPI.getTopRated(1).then(data => data.results);
export const getMoviesByGenre = discoverAPI.moviesByGenre;
export const getMovieDetails = movieAPI.getDetails;
export const getTVDetails = tvAPI.getDetails;
export const getMovieCredits = movieAPI.getCredits;
export const getSimilarMovies = movieAPI.getSimilar;
export const getRecommendedMovies = movieAPI.getRecommendations;

// Multiple pages helpers for backward compatibility
export const getMultiplePagesTrending = (pages: number = 3, startPage: number = 1) =>
  trendingAPI.getMultiplePages('week', pages, startPage);

export const getMultiplePagesPopular = (pages: number = 3, startPage: number = 1) =>
  movieAPI.getMultiplePages('popular', pages, startPage);

export const getMultiplePagesTopRated = (pages: number = 3, startPage: number = 1) =>
  movieAPI.getMultiplePages('top_rated', pages, startPage);

export const getMultiplePagesUpcoming = async (pages: number = 3, startPage: number = 1) => {
  const promises = [];
  for (let i = startPage; i < startPage + pages; i++) {
    promises.push(movieAPI.getUpcoming(i));
  }
  const results = await Promise.all(promises);
  return results.flatMap(result => result.results);
};

export default {
  movieAPI,
  tvAPI,
  personAPI,
  discoverAPI,
  trendingAPI,
  genreAPI,
  searchAPI,
  providerAPI,
  accountAPI,
  getTrailer,
  getMultiplePages,
};
