import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Movie, MovieContextType, TVSeries } from '../types';
import {
    searchMovies as apiSearchMovies,
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
  const [title, setTitle] = useState('Popular Movies');
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (fetcher: () => Promise<Movie[]>, title: string) => {
    try {
      setIsLoading(true);
      const data = await fetcher();
      setMovies(data);
      setTvSeries([]); 
      setTitle(title);
    } catch (error) {
      console.error(`Error fetching ${title}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTvSeries = async (fetcher: () => Promise<TVSeries[]>, title: string) => {
    try {
      setIsLoading(true);
      const data = await fetcher();
      setTvSeries(data);
      setMovies([]); 
      setTitle(title);
    } catch (error) {
      console.error(`Error fetching ${title}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrailer = async (id: number, type: 'movie' | 'tv') => {
    try {
      const url = await getTrailer(id, type);
      setTrailerUrl(url);
    } catch (error) {
      console.error('Error fetching trailer:', error);
      setTrailerUrl(null);
    }
  };

  const searchMovies = async (query: string) => {
    try {
      setIsLoading(true);
      const data = await apiSearchMovies(query);
      setMovies(data);
      setTvSeries([]);
      setTitle(`Search Results for "${query}"`);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoviesByGenre = async (genreId: number) => {
    try {
      setIsLoading(true);
      const data = await getMoviesByGenre(genreId);
      setMovies(data);
      setTvSeries([]);
      
      // Genre mapping
      const genreMap: { [key: number]: string } = {
        28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
        80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
        14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
        9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
        10770: 'TV Movie', 53: 'Thriller', 10752: 'War'
      };
      
      setTitle(genreMap[genreId] || 'Genre Movies');
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: MovieContextType = {
    movies,
    tvSeries,
    title,
    trailerUrl,
    isLoading,
    fetchPopularMovies: () => fetchMovies(getPopularMovies, 'Popular Movies'),
    fetchTopRatedMovies: () => fetchMovies(getTopRatedMovies, 'Top Rated Movies'),
    fetchUpcomingMovies: () => fetchMovies(getUpcomingMovies, 'Upcoming Movies'),
    fetchFeaturedMovies: () => fetchMovies(getFeaturedMovies, 'Featured Movies'),
    fetchAnimeMovies: () => fetchMovies(getAnimeMovies, 'Anime Movies'),
    searchMovies,
    fetchPopularTvSeries: () => fetchTvSeries(getPopularTvSeries, 'Popular TV Series'),
    fetchAiringTodayTvSeries: () => fetchTvSeries(getAiringTodayTvSeries, 'Airing Today'),
    fetchOnTheAirTvSeries: () => fetchTvSeries(getOnTheAirTvSeries, 'On The Air'),
    fetchTopRatedTvSeries: () => fetchTvSeries(getTopRatedTvSeries, 'Top Rated TV Series'),
    fetchMoviesByGenre,
    fetchTrailer,
    setTrailerUrl,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};