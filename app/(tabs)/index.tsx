import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { HorizontalMovieCarousel } from '../../components/HorizontalMovieCarousel';
import { Sidebar } from '../../components/Sidebar';
import { TrailerModal } from '../../components/TrailerModal';
import { useAuth } from '../../context/AuthContext';
import {
    getMultiplePagesPopular,
    getMultiplePagesTopRated,
    getMultiplePagesTrending,
    getMultiplePagesUpcoming,
    movieAPI,
    trendingAPI
} from '../../src/api/tmdbApi';
import { Movie } from '../../types';

const { width } = Dimensions.get('window');

export default function TabHomeScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Rotate hero background every 20 seconds
  useEffect(() => {
    if (heroImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 20000); // 20 seconds as requested
      return () => clearInterval(interval);
    }
  }, [heroImages]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [trendingData, popularData, topRatedData, upcomingData] = await Promise.all([
        getMultiplePagesTrending(3), // Fetch 3 pages = ~60 movies
        getMultiplePagesPopular(3),  // Fetch 3 pages = ~60 movies  
        getMultiplePagesTopRated(3), // Fetch 3 pages = ~60 movies
        getMultiplePagesUpcoming(2)  // Fetch 2 pages = ~40 movies
      ]);
      
      setTrending(trendingData);
      setPopular(popularData);
      setTopRated(topRatedData);
      setUpcoming(upcomingData);

      // Set hero images from trending movies (latest 6 movies)
      const images = trendingData
        .slice(0, 6)
        .map((movie: Movie) => 
          movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
        )
        .filter(Boolean);
      setHeroImages(images);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    router.push(`/modal?id=${movie.id}`);
  };

  const handleWatchTrailer = (movie: Movie) => {
    setSelectedMovie(movie);
    setTrailerModalVisible(true);
  };

  const handleWatchMovie = (movie: Movie) => {
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
    
    router.push(`/modal?id=${movie.id}`);
  };

  const closeTrailerModal = () => {
    setTrailerModalVisible(false);
    setSelectedMovie(null);
  };

  const handleViewMoreTrending = () => {
    router.push('/(tabs)/movies?category=Latest');
  };

  const handleViewMorePopular = () => {
    router.push('/(tabs)/movies?category=Popular');
  };

  const handleViewMoreUpcoming = () => {
    router.push('/(tabs)/movies?category=Upcoming');
  };

  const handleLoadMoreTrending = async (): Promise<Movie[]> => {
    try {
      const additionalMovies = await trendingAPI.movies('week', 2);
      const newMovies = additionalMovies.results || [];
      return newMovies.slice(10, 20); // Get next 10 movies
    } catch (error) {
      console.error('Error loading more trending movies:', error);
      return [];
    }
  };

  const handleLoadMorePopular = async (): Promise<Movie[]> => {
    try {
      const additionalMovies = await movieAPI.getPopular(2);
      const newMovies = additionalMovies.results || [];
      return newMovies.slice(10, 20); // Get next 10 movies
    } catch (error) {
      console.error('Error loading more popular movies:', error);
      return [];
    }
  };

  const handleLoadMoreTopRated = async (): Promise<Movie[]> => {
    try {
      const additionalMovies = await movieAPI.getTopRated(2);
      const newMovies = additionalMovies.results || [];
      return newMovies.slice(10, 20); // Get next 10 movies
    } catch (error) {
      console.error('Error loading more top rated movies:', error);
      return [];
    }
  };

  const handleLoadMoreUpcoming = async (): Promise<Movie[]> => {
    try {
      const additionalMovies = await movieAPI.getUpcoming(2);
      const newMovies = additionalMovies.results || [];
      return newMovies.slice(10, 20); // Get next 10 movies
    } catch (error) {
      console.error('Error loading more upcoming movies:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#0A0F28', '#1A1F3A']} style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00d4aa" />
            <Text style={styles.loadingText}>Loading movies...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0A0F28', '#1A1F3A']} style={styles.container}>
        <View style={styles.mainLayout}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Hero Section with rotating movie backgrounds */}
            <View style={styles.heroSection}>
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
                style={styles.heroOverlay}
              />
              {heroImages.length > 0 && (
                <View style={styles.heroImageContainer}>
                  {heroImages.map((imageUrl, index) => (
                    <Image
                      key={index}
                      source={{ uri: imageUrl }}
                      style={[
                        styles.heroImage,
                        {
                          opacity: index === currentHeroIndex ? 1 : 0,
                        }
                      ]}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              )}
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>ZERO -The Bravest Money Game-</Text>
                <View style={styles.heroMeta}>
                  <Text style={styles.heroRating}>7.8/10</Text>
                  <Text style={styles.heroYear}>2018</Text>
                  <View style={styles.heroQuality}>
                    <Text style={styles.heroQualityText}>HD</Text>
                  </View>
                  <View style={styles.heroBadge}>
                    <Text style={styles.heroBadgeText}>SÉRIE</Text>
                  </View>
                </View>
                <Text style={styles.heroDescription}>
                  The winner of a secret survival game stands to win a large sum of money. However, one player does not seem to be in the game for the money.
                </Text>
                <TouchableOpacity style={styles.heroButton}>
                  <Text style={styles.heroButtonText}>▶ Watch Serie</Text>
                </TouchableOpacity>
              </View>
              {/* Carousel indicators */}
              <View style={styles.heroIndicators}>
                {heroImages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentHeroIndex && styles.activeIndicator
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Movie Carousels */}
            <View style={styles.moviesSection}>
              <HorizontalMovieCarousel
                title="Trending Now"
                movies={trending}
                onMoviePress={handleMoviePress}
                onWatchTrailer={handleWatchTrailer}
                onWatchMovie={handleWatchMovie}
                onViewMore={handleViewMoreTrending}
                onLoadMore={handleLoadMoreTrending}
                initialDisplayCount={4}
              />

              <HorizontalMovieCarousel
                title="Popular Movies"
                movies={popular}
                onMoviePress={handleMoviePress}
                onWatchTrailer={handleWatchTrailer}
                onWatchMovie={handleWatchMovie}
                onViewMore={handleViewMorePopular}
                onLoadMore={handleLoadMorePopular}
                initialDisplayCount={4}
              />

              <HorizontalMovieCarousel
                title="Top Rated"
                movies={topRated}
                onMoviePress={handleMoviePress}
                onWatchTrailer={handleWatchTrailer}
                onWatchMovie={handleWatchMovie}
                onViewMore={handleViewMorePopular}
                onLoadMore={handleLoadMoreTopRated}
                initialDisplayCount={4}
              />

              <HorizontalMovieCarousel
                title="Coming Soon"
                movies={upcoming}
                onMoviePress={handleMoviePress}
                onWatchTrailer={handleWatchTrailer}
                onWatchMovie={handleWatchMovie}
                onViewMore={handleViewMoreUpcoming}
                onLoadMore={handleLoadMoreUpcoming}
                initialDisplayCount={4}
              />
            </View>

            {/* Add some bottom padding */}
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Sidebar */}
          <Sidebar />
        </View>

        {/* Trailer Modal */}
        <TrailerModal
          visible={trailerModalVisible}
          onClose={closeTrailerModal}
          movieId={selectedMovie?.id || null}
          movieTitle={selectedMovie?.title || ''}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F28',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  heroSection: {
    height: 400,
    margin: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
    backgroundColor: '#1a1a2e',
  },
  heroImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  heroRating: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  heroYear: {
    color: '#ccc',
    fontSize: 14,
  },
  heroQuality: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  heroQualityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroBadge: {
    backgroundColor: '#00d4aa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  heroBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heroDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    maxWidth: '90%',
  },
  heroButton: {
    backgroundColor: '#00d4aa',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroIndicators: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8,
    zIndex: 2,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeIndicator: {
    backgroundColor: '#00d4aa',
  },
  moviesSection: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20,
  },
});