export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
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
}

export interface MovieContextType {
  movies: Movie[];
  tvSeries: TVSeries[];
  title: string;
  trailerUrl: string | null;
  fetchPopularMovies: () => void;
  fetchTopRatedMovies: () => void;
  fetchUpcomingMovies: () => void;
  fetchFeaturedMovies: () => void;
  fetchAnimeMovies: () => void;
  searchMovies: (query: string) => void;
  fetchPopularTvSeries: () => void;
  fetchAiringTodayTvSeries: () => void;
  fetchOnTheAirTvSeries: () => void;
  fetchTopRatedTvSeries: () => void;
  fetchMoviesByGenre: (genreId: number) => void;
  fetchTrailer: (id: number, type: 'movie' | 'tv') => void;
  setTrailerUrl: (url: string | null) => void;
}

export interface AuthContextType {
  user: any;
  login: (token: string) => void;
  logout: () => void;
}
