import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, Movie } from '../../api/tmdb';
import MovieCard from '../../components/MovieCard';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovieData();
  }, []);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [trendingData, popularData, topRatedData] = await Promise.all([
        fetchTrendingMovies(),
        fetchPopularMovies(),
        fetchTopRatedMovies()
      ]);

      setTrendingMovies(trendingData.results.slice(0, 10));
      setPopularMovies(popularData.results.slice(0, 10));
      setTopRatedMovies(topRatedData.results.slice(0, 10));
      
      // Set the first trending movie as featured
      if (trendingData.results.length > 0) {
        setFeaturedMovie(trendingData.results[0]);
      }

    } catch (err) {
      console.error('Error loading movie data:', err);
      setError('Failed to load movies. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    // Navigate to movie details modal
    router.push('/modal');
  };

  const handleWatchTrailer = (movie: Movie) => {
    Alert.alert('Watch Trailer', `Playing trailer for ${movie.title}`);
  };

  const handleWatchMovie = (movie: Movie) => {
    if (isLoggedIn) {
      Alert.alert('Watch Movie', `Streaming ${movie.title}`);
    } else {
      Alert.alert('Login Required', 'Please sign in to watch movies');
    }
  };

  const handleAddToWatchlist = (movie: Movie) => {
    Alert.alert('Watchlist', `Added ${movie.title} to your watchlist`);
  };

  const convertToMovieCardFormat = (movie: Movie) => ({
    id: movie.id,
    title: movie.title,
    vote_average: movie.vote_average,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined,
    overview: movie.overview,
    poster_path: movie.poster_path
  });

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={convertToMovieCardFormat(item)}
      onPress={() => handleMoviePress(item)}
      onWatchTrailer={() => handleWatchTrailer(item)}
      onWatchMovie={() => handleWatchMovie(item)}
      onAddToWatchlist={() => handleAddToWatchlist(item)}
    />
  );

  const renderMovieRow = (title: string, movies: Movie[]) => (
    <View style={styles.movieRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={movies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieList}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a1a', '#0a2a1a']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00d4aa" />
            <Text style={styles.loadingText}>Loading movies...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadMovieData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Featured Movie Section */}
            {featuredMovie && (
              <View style={styles.featuredSection}>
                <ImageBackground
                  source={{ uri: `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path || featuredMovie.poster_path}` }}
                  style={styles.featuredBackground}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(10,10,10,1)']}
                    style={styles.featuredGradient}
                  >
                    <View style={styles.featuredContent}>
                      <View style={styles.featuredBadge}>
                        <Text style={styles.featuredBadgeText}>MOVIE</Text>
                      </View>
                      <Text style={styles.featuredTitle}>{featuredMovie.title}</Text>
                      <View style={styles.featuredMeta}>
                        <Text style={styles.featuredRating}>
                          ⭐ {featuredMovie.vote_average.toFixed(1)}/10
                        </Text>
                        <Text style={styles.featuredYear}>
                          {new Date(featuredMovie.release_date).getFullYear()}
                        </Text>
                        <View style={styles.ratingBadge}>
                          <Text style={styles.ratingBadgeText}>HD</Text>
                        </View>
                      </View>
                      <Text style={styles.featuredOverview} numberOfLines={3}>
                        {featuredMovie.overview}
                      </Text>
                      <View style={styles.featuredButtons}>
                        <TouchableOpacity 
                          style={styles.playButton}
                          onPress={() => handleWatchMovie(featuredMovie)}
                        >
                          <Ionicons name="play" size={20} color="#000000" />
                          <Text style={styles.playButtonText}>Watch Movie</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.infoButton}
                          onPress={() => handleMoviePress(featuredMovie)}
                        >
                          <Ionicons name="information-circle" size={20} color="#FFD700" />
                          <Text style={styles.infoButtonText}>More Info</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            )}

            <View style={styles.sectionsContainer}>
              {renderMovieRow("🔥 Trending Now", trendingMovies)}
              {renderMovieRow("⭐ Popular Movies", popularMovies)}
              {renderMovieRow("🏆 Top Rated", topRatedMovies)}
            </View>
          </>
        )}
        
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
  },
  featuredSection: {
    height: 500,
    position: 'relative',
  },
  featuredBackground: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  featuredBadge: {
    backgroundColor: '#00d4aa',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  featuredBadgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 15,
  },
  featuredRating: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredYear: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  ratingBadgeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
  },
  featuredOverview: {
    color: '#DDDDDD',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuredButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  playButton: {
    backgroundColor: '#00d4aa',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#00d4aa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  infoButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionsContainer: {
    paddingTop: 20,
  },
  movieRow: {
    marginTop: 35,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 212, 170, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  movieList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  retryButton: {
    backgroundColor: '#00d4aa',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});