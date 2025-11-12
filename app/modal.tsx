import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { MovieCard } from '../components/MovieCard';
import { TrailerModal } from '../components/TrailerModal';
import { useAuth } from '../context/AuthContext';
import { Movie } from '../types';
import { movieAPI } from '../src/api/tmdbApi';

export default function MovieDetailsModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isLoggedIn } = useAuth();
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  const [movie, setMovie] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Get movie ID from route params or use default
  const movieId = params.id ? parseInt(params.id as string) : 550; // Default to Fight Club

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const [movieDetails, creditsData, similarData] = await Promise.all([
        movieAPI.getDetails(movieId),
        movieAPI.getCredits(movieId),
        movieAPI.getSimilar(movieId)
      ]);
      
      setMovie(movieDetails);
      setCredits(creditsData);
      setSimilarMovies(similarData.results || []);
    } catch (error) {
      console.error('Error loading movie details:', error);
      // Fallback to mock data if API fails
      setMovie({
        id: movieId,
        title: "Movie Details",
        overview: "Movie details could not be loaded from TMDB API.",
        vote_average: 0,
        release_date: "2023-01-01",
        poster_path: '',
        backdrop_path: '',
        genre_ids: [],
        adult: false,
        original_title: "Movie Details",
        popularity: 0,
        video: false,
        vote_count: 0,
        runtime: 0,
        genres: [],
        production_companies: []
      });
      setCredits({ cast: [], crew: [] });
      setSimilarMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchMovie = () => {
    if (isLoggedIn) {
      Alert.alert('Watch Movie', `Now streaming ${movie?.title}!`);
    } else {
      Alert.alert(
        'Login Required',
        'Please log in to watch movies',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/profile') },
        ]
      );
    }
  };

  const handleWatchTrailer = () => {
    setTrailerModalVisible(true);
  };

  const closeTrailerModal = () => {
    setTrailerModalVisible(false);
  };

  const handleSimilarMoviePress = (similarMovie: Movie) => {
    router.push(`/modal?id=${similarMovie.id}`);
  };

  const handleWatchTrailerSimilar = (similarMovie: Movie) => {
    // Handle similar movie trailer
    Alert.alert('Trailer', `Playing trailer for ${similarMovie.title}`);
  };

  const handleWatchMovieSimilar = (similarMovie: Movie) => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please log in to watch movies.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/profile') }
        ]
      );
      return;
    }
    
    Alert.alert('Watch Movie', `Streaming ${similarMovie.title}`);
  };

  const handleAddToWatchlistSimilar = (similarMovie: Movie) => {
    Alert.alert('Watchlist', `Added ${similarMovie.title} to your watchlist`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={['#141414', '#000000']} style={StyleSheet.absoluteFillObject} />
        <Header showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4aa" />
          <Text style={styles.loadingText}>Loading movie details...</Text>
        </View>
        <View style={{ height: 100 }} />
        <Footer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#141414', '#000000']} style={StyleSheet.absoluteFillObject} />
      
      <Header showBackButton={true} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {movie?.backdrop_path ? (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` }}
              style={styles.backdropImage}
              resizeMode="cover"
            />
          ) : null}
          
          <View style={styles.posterAndInfo}>
            {movie?.poster_path ? (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                style={styles.posterImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.posterPlaceholder}>
                <Text style={styles.posterText}>{movie?.title?.substring(0, 10) || 'No Title'}...</Text>
              </View>
            )}
            
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{movie?.title}</Text>
              
              <View style={styles.movieMeta}>
                <Text style={styles.year}>
                  {movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{movie?.vote_average?.toFixed(1) || '0.0'}</Text>
                </View>
                {movie?.runtime && <Text style={styles.runtime}>{movie.runtime} min</Text>}
              </View>

              {/* Genres */}
              {movie?.genres && movie.genres.length > 0 && (
                <View style={styles.genresContainer}>
                  {movie.genres.slice(0, 3).map((genre: any) => (
                    <View key={genre.id} style={styles.genreTag}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.watchButton} onPress={handleWatchMovie}>
                  <Ionicons name="play" size={20} color="#000000" />
                  <Text style={styles.watchButtonText}>
                    {isLoggedIn ? 'Watch Movie' : 'Sign In to Watch'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.trailerButton} onPress={handleWatchTrailer}>
                  <Ionicons name="play-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Synopsis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.synopsis}>{movie?.overview || 'No synopsis available.'}</Text>
        </View>

        {/* Cast */}
        {credits?.cast && credits.cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castScroll}>
              {credits.cast.slice(0, 10).map((person: any) => (
                <View key={person.id} style={styles.castMember}>
                  {person.profile_path ? (
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w185${person.profile_path}` }}
                      style={styles.castImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.castPlaceholder}>
                      <Ionicons name="person" size={30} color="#666" />
                    </View>
                  )}
                  <Text style={styles.castName}>{person.name}</Text>
                  <Text style={styles.castCharacter}>{person.character}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Crew */}
        {credits?.crew && credits.crew.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Crew</Text>
            <View style={styles.crewGrid}>
              {credits.crew
                .filter((person: any) => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(person.job))
                .slice(0, 6)
                .map((person: any, index: number) => (
                  <View key={`${person.id}-${index}`} style={styles.crewMember}>
                    <Text style={styles.crewName}>{person.name}</Text>
                    <Text style={styles.crewJob}>{person.job}</Text>
                  </View>
                ))
              }
            </View>
          </View>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar Movies</Text>
            <FlatList
              horizontal
              data={similarMovies.slice(0, 10)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.similarMovieWrapper}>
                  <MovieCard
                    id={item.id}
                    title={item.title}
                    poster_path={item.poster_path}
                    vote_average={item.vote_average}
                    release_date={item.release_date}
                    overview={item.overview}
                    onPress={() => handleSimilarMoviePress(item)}
                    onWatchTrailer={() => handleWatchTrailerSimilar(item)}
                    onWatchMovie={() => handleWatchMovieSimilar(item)}
                    onAddToWatchlist={() => handleAddToWatchlistSimilar(item)}
                  />
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      
      <Footer />
      
      {/* Trailer Modal */}
      <TrailerModal
        visible={trailerModalVisible}
        onClose={closeTrailerModal}
        movieId={movie?.id || null}
        movieTitle={movie?.title || ''}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  heroSection: {
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: 250,
    position: 'absolute',
    top: 0,
    opacity: 0.3,
  },
  posterAndInfo: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 40,
  },
  posterPlaceholder: {
    width: 150,
    height: 225,
    backgroundColor: '#333333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  posterImage: {
    width: 150,
    height: 225,
    borderRadius: 12,
    marginRight: 20,
  },
  posterText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 15,
  },
  year: {
    color: '#8C8C8C',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  runtime: {
    color: '#8C8C8C',
    fontSize: 16,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  genreTag: {
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.4)',
  },
  genreText: {
    color: '#00d4aa',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  watchButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  watchButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  trailerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  trailerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  synopsis: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 24,
  },
  castScroll: {
    marginLeft: -10,
  },
  castMember: {
    width: 100,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  castPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  castName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  castCharacter: {
    color: '#8C8C8C',
    fontSize: 11,
    textAlign: 'center',
  },
  crewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  crewMember: {
    width: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  crewName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  crewJob: {
    color: '#00d4aa',
    fontSize: 12,
  },
  similarMovieWrapper: {
    width: 200,
    marginRight: 15,
  },
});
