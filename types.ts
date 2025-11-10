export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
}

export interface TVSeries {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids?: number[];
  episode_run_time?: number[];
  genres?: Array<{ id: number; name: string }>;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  token: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface MovieContextType {
  movies: Movie[];
  tvSeries: TVSeries[];
  title: string;
  trailerUrl: string | null;
  isLoading: boolean;
  fetchPopularMovies: () => Promise<void>;
  fetchTopRatedMovies: () => Promise<void>;
  fetchUpcomingMovies: () => Promise<void>;
  fetchFeaturedMovies: () => Promise<void>;
  fetchAnimeMovies: () => Promise<void>;
  searchMovies: (query: string) => Promise<void>;
  fetchPopularTvSeries: () => Promise<void>;
  fetchAiringTodayTvSeries: () => Promise<void>;
  fetchOnTheAirTvSeries: () => Promise<void>;
  fetchTopRatedTvSeries: () => Promise<void>;
  fetchMoviesByGenre: (genreId: number) => Promise<void>;
  fetchTrailer: (id: number, type: 'movie' | 'tv') => Promise<void>;
  setTrailerUrl: (url: string | null) => void;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<AuthResult>;
}

export interface Genre {
  id: number;
  name: string;
}
