import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, getBackdropUrl, Movie } from '../../api/tmdb';
import { MovieCard } from '../../components/MovieCard';
import { Sidebar } from '../../components/Sidebar';
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

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <MovieCard
      id={item.id}
      title={item.title}
      poster_path={item.poster_path}
      vote_average={item.vote_average}
      release_date={item.release_date}
      overview={item.overview}
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
      
      <View style={styles.mainLayout}>
        {/* Main Content */}
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
                    source={{ uri: getBackdropUrl(featuredMovie.backdrop_path || featuredMovie.poster_path || '') }}
                    style={styles.featuredBackground}
                    resizeMode="cover"
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)', 'rgba(10,10,10,0.9)']}
                      style={styles.featuredGradient}
                    >
                      <View style={styles.featuredContent}>
                        <View style={styles.featuredBadge}>
                          <Text style={styles.featuredBadgeText}>FEATURED</Text>
                        </View>
                        <Text style={styles.featuredTitle}>{featuredMovie.title}</Text>
                        <View style={styles.featuredMeta}>
                          <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.featuredRating}>
                              {featuredMovie.vote_average.toFixed(1)}
                            </Text>
                          </View>
                          <Text style={styles.featuredYear}>
                            {new Date(featuredMovie.release_date).getFullYear()}
                          </Text>
                          <View style={styles.qualityBadge}>
                            <Text style={styles.qualityBadgeText}>4K</Text>
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
                            <LinearGradient
                              colors={['#00d4aa', '#00b894']}
                              style={styles.playButtonGradient}
                            >
                              <Ionicons name="play" size={20} color="#000000" />
                              <Text style={styles.playButtonText}>Watch Trailer</Text>
                              <Text style={styles.playButtonText}>Watch Movie</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.infoButton}
                            onPress={() => handleMoviePress(featuredMovie)}
                          >
                            <View style={styles.infoButtonContent}>
                              <Ionicons name="information-circle-outline" size={20} color="#FFD700" />
                              <Text style={styles.infoButtonText}>More Info</Text>
                            </View>
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

        {/* Sidebar */}
        <Sidebar isVisible={!loading && !error} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
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
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredRating: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  featuredYear: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
  },
  qualityBadge: {
    backgroundColor: 'rgba(0, 212, 170, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00d4aa',
  },
  qualityBadgeText: {
    color: '#00d4aa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredOverview: {
    color: '#DDDDDD',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuredButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  playButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#00d4aa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
  playButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    overflow: 'hidden',
  },
  infoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  infoButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionsContainer: {
    paddingTop: 30,
  },
  movieRow: {
    marginBottom: 35,
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