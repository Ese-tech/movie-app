import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Movie, MovieContextType, TVSeries } from '../types';
import {
    getAiringTodayTvSeries,
    getAnimeMovies,
    getFeaturedMovies,
    getMoviesByGenre,
    getOnTheAirTvSeries,
    getPopularMovies,
    getPopularTvSeries,
    getTopRatedMovies,
    getTopRatedTvSeries,
    getTrailer,
    getUpcomingMovies,
    searchMovies,
} from '../utils/api';

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvSeries, setTvSeries] = useState<TVSeries[]>([]);
  const [title, setTitle] = useState('Popular');
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  const fetchMovies = async (fetcher: () => Promise<Movie[]>, title: string) => {
    const data = await fetcher();
    setMovies(data);
    setTvSeries([]); 
    setTitle(title);
  };

  const fetchTvSeries = async (fetcher: () => Promise<TVSeries[]>, title: string) => {
    const data = await fetcher();
    setTvSeries(data);
    setMovies([]); 
    setTitle(title);
  };

  const fetchTrailer = async (id: number, type: 'movie' | 'tv') => {
    const url = await getTrailer(id, type);
    setTrailerUrl(url);
  };

  const value: MovieContextType = {
    movies,
    tvSeries,
    title,
    trailerUrl,
    fetchPopularMovies: () => fetchMovies(getPopularMovies, 'Popular'),
    fetchTopRatedMovies: () => fetchMovies(getTopRatedMovies, 'Top Rated'),
    fetchUpcomingMovies: () => fetchMovies(getUpcomingMovies, 'Upcoming'),
    fetchFeaturedMovies: () => fetchMovies(getFeaturedMovies, 'Featured'),
    fetchAnimeMovies: () => fetchMovies(getAnimeMovies, 'Anime'),
    searchMovies: async (query) => {
      const data = await searchMovies(query);
      setMovies(data);
      setTvSeries([]);
      setTitle(`Search Results for "${query}"`);
    },
    fetchPopularTvSeries: () => fetchTvSeries(getPopularTvSeries, 'Popular TV Series'),
    fetchAiringTodayTvSeries: () => fetchTvSeries(getAiringTodayTvSeries, 'Airing Today'),
    fetchOnTheAirTvSeries: () => fetchTvSeries(getOnTheAirTvSeries, 'On The Air'),
    fetchTopRatedTvSeries: () => fetchTvSeries(getTopRatedTvSeries, 'Top Rated TV Series'),
    fetchMoviesByGenre: async (genreId) => {
      const data = await getMoviesByGenre(genreId);
      setMovies(data);
      setTvSeries([]);
      
      // Get genre name
      const genreMap: { [key: number]: string } = {
        28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
        80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
        14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
        9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
        10770: 'TV Movie', 53: 'Thriller', 10752: 'War'
      };
      
      setTitle(genreMap[genreId] || 'Genre');
    },
    fetchTrailer,
    setTrailerUrl,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};