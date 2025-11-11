import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { HorizontalMovieCarousel } from '../components/HorizontalMovieCarousel';
import { Sidebar } from '../components/Sidebar';
import { Movie } from '../types';
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies
} from '../utils/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [trendingData, popularData, topRatedData, upcomingData] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies(),
        getUpcomingMovies()
      ]);
      
      setTrending(trendingData.results || trendingData);
      setPopular(popularData.results || popularData);
      setTopRated(topRatedData.results || topRatedData);
      setUpcoming(upcomingData || []);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    router.push('/movies');
  };

  const handleViewMoreTrending = () => {
    router.push('/movies');
  };

  const handleViewMorePopular = () => {
    router.push('/movies');
  };

  const handleViewMoreTopRated = () => {
    router.push('/movies');
  };

  const handleViewMoreUpcoming = () => {
    router.push('/movies');
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0A0F28', '#1A1F3A']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4aa" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0A0F28', '#1A1F3A']} style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#00d4aa', '#FFD700']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <Text style={styles.heroTitle}>CINEVERSE</Text>
              <Text style={styles.heroSubtitle}>Discover Amazing Movies</Text>
            </LinearGradient>
          </View>

          {/* Content with Sidebar Layout */}
          <View style={styles.contentLayout}>
            {/* Main Movies Section */}
            <View style={styles.moviesSection}>
              {/* Trending Movies Carousel */}
              <HorizontalMovieCarousel
                title="Trending Now"
                movies={trending.slice(0, 10)}
                onMoviePress={handleMoviePress}
                onViewMore={handleViewMoreTrending}
              />

              {/* Popular Movies Carousel */}
              <HorizontalMovieCarousel
                title="Popular Movies"
                movies={popular.slice(0, 10)}
                onMoviePress={handleMoviePress}
                onViewMore={handleViewMorePopular}
              />

              {/* Top Rated Movies Carousel */}
              <HorizontalMovieCarousel
                title="Top Rated"
                movies={topRated.slice(0, 10)}
                onMoviePress={handleMoviePress}
                onViewMore={handleViewMoreTopRated}
              />

              {/* Upcoming Movies Carousel */}
              <HorizontalMovieCarousel
                title="Coming Soon"
                movies={upcoming.slice(0, 10)}
                onMoviePress={handleMoviePress}
                onViewMore={handleViewMoreUpcoming}
              />
            </View>

            {/* Sidebar */}
            <View style={styles.sidebarContainer}>
              <Sidebar />
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
  },
  heroSection: {
    height: 200,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  contentLayout: {
    flexDirection: width > 768 ? 'row' : 'column',
    padding: 16,
    gap: 16,
  },
  moviesSection: {
    flex: width > 768 ? 3 : 1,
  },
  sidebarContainer: {
    flex: width > 768 ? 1 : 0,
    maxWidth: width > 768 ? 250 : '100%',
    minWidth: width > 768 ? 200 : 'auto',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4aa',
    marginBottom: 12,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#00d4aa',
  },
  tabButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});