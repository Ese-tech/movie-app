import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useMovieContext } from '../../context/MovieContext';
import MovieCard from '../../components/MovieCard';
import type { Movie } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

interface MovieDetails extends Movie {
  runtime?: number;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path?: string }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
  status: string;
  tagline?: string;
  homepage?: string;
  budget: number;
  revenue: number;
  backdrop_path: string;
}

interface RelatedMoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const MovieDetailScreen = () => {
  const { id, trailer, watch } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { fetchTrailer } = useMovieContext();
  
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerLoading, setTrailerLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      fetchRelatedMovies();
    }
  }, [id]);

  useEffect(() => {
    if (trailer && movieDetails) {
      handleWatchTrailer();
    }
    if (watch && movieDetails && user) {
      handleWatchMovie();
    }
  }, [trailer, watch, movieDetails]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=530bdf979dd5e101be641fb42df8a872&language=en-US`
      );
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=530bdf979dd5e101be641fb42df8a872&language=en-US&page=1`
      );
      const data: RelatedMoviesResponse = await response.json();
      setRelatedMovies(data.results.slice(0, 12)); // Get first 12 related movies
    } catch (error) {
      console.error('Error fetching related movies:', error);
      // If recommendations fail, try similar movies
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=530bdf979dd5e101be641fb42df8a872&language=en-US&page=1`
        );
        const data: RelatedMoviesResponse = await response.json();
        setRelatedMovies(data.results.slice(0, 12));
      } catch (error) {
        console.error('Error fetching similar movies:', error);
      }
    }
  };

  const handleWatchTrailer = async () => {
    if (!movieDetails) return;
    
    setTrailerLoading(true);
    try {
      await fetchTrailer(movieDetails.id, 'movie');
    } catch (error) {
      console.error('Error playing trailer:', error);
    } finally {
      setTrailerLoading(false);
    }
  };

  const handleWatchMovie = () => {
    if (user && movieDetails) {
      // Navigate to movie player or streaming page
      console.log('Playing movie:', movieDetails.title);
      // You can implement your video player here
    } else {
      router.push('/login');
    }
  };

  const handleAddToList = () => {
    if (user && movieDetails) {
      // Add to user's watchlist
      console.log('Adding to list:', movieDetails.title);
      // Implement add to MongoDB user list
    } else {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#06b6d4" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with backdrop */}
      <View style={styles.header}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}` }}
          style={styles.backdrop}
        />
        <LinearGradient
          colors={['rgba(10, 15, 40, 0.3)', 'rgba(10, 15, 40, 0.8)', '#0A0F28']}
          style={styles.gradient}
        />
        
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Movie info overlay */}
        <View style={styles.movieInfo}>
          <View style={styles.posterContainer}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }}
              style={styles.poster}
            />
          </View>
          
          <View style={styles.details}>
            <Text style={styles.title}>{movieDetails.title}</Text>
            {movieDetails.tagline && (
              <Text style={styles.tagline}>"{movieDetails.tagline}"</Text>
            )}
            
            <View style={styles.metaInfo}>
              <Text style={styles.year}>
                {new Date(movieDetails.release_date).getFullYear()}
              </Text>
              <Text style={styles.separator}>•</Text>
              {movieDetails.runtime && (
                <>
                  <Text style={styles.runtime}>{movieDetails.runtime} min</Text>
                  <Text style={styles.separator}>•</Text>
                </>
              )}
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.rating}>{movieDetails.vote_average.toFixed(1)}</Text>
              </View>
            </View>

            <View style={styles.genres}>
              {movieDetails.genres?.slice(0, 3).map((genre, index) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.overview}>{movieDetails.overview}</Text>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.trailerBtn} 
                onPress={handleWatchTrailer}
                disabled={trailerLoading}
              >
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.trailerBtnText}>
                  {trailerLoading ? 'Loading...' : 'Watch Trailer'}
                </Text>
              </TouchableOpacity>

              {user && (
                <TouchableOpacity style={styles.watchBtn} onPress={handleWatchMovie}>
                  <Ionicons name="play-circle" size={20} color="#000" />
                  <Text style={styles.watchBtnText}>Watch Movie</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.listBtn} onPress={handleAddToList}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.listBtnText}>My List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Related Movies Section */}
      {relatedMovies.length > 0 && (
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>Related Movies</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedMovies}
          >
            {relatedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                item={movie}
                type="movie"
                onPress={() => router.push(`/movie/${movie.id}` as any)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Additional Movie Information */}
      <View style={styles.additionalInfo}>
        <Text style={styles.sectionTitle}>Movie Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={styles.infoValue}>{movieDetails.status}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Language:</Text>
          <Text style={styles.infoValue}>
            {movieDetails.spoken_languages?.[0]?.name || 'N/A'}
          </Text>
        </View>
        
        {movieDetails.budget > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Budget:</Text>
            <Text style={styles.infoValue}>
              ${movieDetails.budget.toLocaleString()}
            </Text>
          </View>
        )}
        
        {movieDetails.revenue > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Revenue:</Text>
            <Text style={styles.infoValue}>
              ${movieDetails.revenue.toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F28',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0F28',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0F28',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    height: 600,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieInfo: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
  },
  posterContainer: {
    marginRight: 20,
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    color: '#06b6d4',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  year: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    color: '#666',
    marginHorizontal: 8,
    fontSize: 16,
  },
  runtime: {
    color: '#fff',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#f59e0b',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: 'rgba(6, 182, 212, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#06b6d4',
    fontSize: 12,
    fontWeight: '600',
  },
  overview: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trailerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
  },
  trailerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
  },
  watchBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  listBtnText: {
    color: '#06b6d4',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  relatedSection: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  relatedMovies: {
    paddingHorizontal: 12,
  },
  additionalInfo: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
    width: 100,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
});

export default MovieDetailScreen;