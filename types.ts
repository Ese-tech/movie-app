// Movie Types
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
  runtime?: number;
  genres?: Genre[];
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

export interface TVSeries extends TVShow {
  // Alias for TVShow for backward compatibility
}

export interface MovieContextType {
  // State
  movies: Movie[];
  tvSeries: TVShow[];
  title: string;
  trailerUrl: string | null;
  isLoading: boolean;
  
  // Actions
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
  setTrailerUrl: (url: string) => void;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Video/Trailer Types
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

// Cast/Crew Types
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

// Movie Details Type (extended)
export interface MovieDetails extends Movie {
  belongs_to_collection: any;
  budget: number;
  homepage: string;
  imdb_id: string;
  production_companies: any[];
  production_countries: any[];
  revenue: number;
  runtime: number;
  spoken_languages: any[];
  status: string;
  tagline: string;
  videos?: {
    results: Video[];
  };
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  similar?: TMDBResponse<Movie>;
}

// User/Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  myList: number[]; // Array of movie IDs
}

// Navigation Types
export type RootStackParamList = {
  Tabs: undefined;
  MovieDetails: { movieId: number };
  VideoPlayer: { videoKey: string; title: string };
  Auth: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  MyList: undefined;
  Profile: undefined;
};