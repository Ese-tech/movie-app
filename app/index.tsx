import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';
import { useMovieContext } from '../context/MovieContext';
import { Genre } from '../types';

const genres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
];

const MovieHome = () => {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { 
    movies, 
    tvSeries, 
    title, 
    isLoading: moviesLoading,
    fetchPopularMovies, 
    fetchTopRatedMovies,
    fetchUpcomingMovies,
    fetchFeaturedMovies,
    fetchAnimeMovies,
    fetchPopularTvSeries,
    fetchAiringTodayTvSeries,
    fetchOnTheAirTvSeries,
    fetchTopRatedTvSeries,
    fetchMoviesByGenre,
    searchMovies
  } = useMovieContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('movies');
  const [showSidebar, setShowSidebar] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(-300));

  useEffect(() => {
    // Load initial popular movies when component mounts
    if (!authLoading) {
      loadInitialContent();
    }
  }, [authLoading]);

  useEffect(() => {
    // Set featured movie from the first movie in the list
    if (movies.length > 0) {
      setFeaturedMovie(movies[0]);
    } else if (tvSeries.length > 0) {
      setFeaturedMovie(tvSeries[0]);
    }
  }, [movies, tvSeries]);

  const loadInitialContent = async () => {
    try {
      await fetchPopularMovies();
    } catch (error) {
      console.error('Error loading initial content:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInitialContent();
    } catch (error) {
      console.error('Error refreshing content:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleSidebar = () => {
    const toValue = showSidebar ? -300 : 0;
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowSidebar(!showSidebar);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMovies(searchQuery.trim());
      setShowSidebar(false);
    }
  };

  const handleCategorySelect = async (category: string, action: () => Promise<void>) => {
    setSelectedCategory(category);
    try {
      await action();
    } catch (error) {
      console.error('Error fetching category:', error);
    }
    toggleSidebar();
  };

  const handleGenreSelect = async (genreId: number) => {
    try {
      await fetchMoviesByGenre(genreId);
    } catch (error) {
      console.error('Error fetching genre:', error);
    }
    toggleSidebar();
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally refresh content for logged-out user
      await loadInitialContent();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <MovieCard 
      item={item} 
      type={selectedCategory === 'movies' || selectedCategory.includes('movie') ? 'movie' : 'tv'} 
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="film-outline" size={64} color="#666" />
      <Text style={styles.emptyStateText}>No content available</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadInitialContent}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#e50914" />
      <Text style={styles.loadingText}>Loading amazing content...</Text>
    </View>
  );

  if (authLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0F28', '#1A213E', '#2C3A5B']}
          style={styles.gradient}
        />
        {renderLoadingState()}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0A0F28', '#1A213E', '#2C3A5B']}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.logo}>FMOVIES</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.userSection}>
          {user ? (
            <View style={styles.userMenu}>
              <TouchableOpacity style={styles.profileButton}>
                <Ionicons name="person" size={20} color="#fff" />
                <Text style={styles.profileText}>{user.name || user.email.split('@')[0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sidebar */}
      <Animated.View 
        style={[
          styles.sidebar, 
          { transform: [{ translateX: sidebarAnimation }] }
        ]}
      >
        <ScrollView style={styles.sidebarContent}>
          <Text style={styles.sidebarTitle}>Movies</Text>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => handleCategorySelect('featured', fetchFeaturedMovies)}
          >
            <Text style={styles.sidebarItemText}>🔥 Featured</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => handleCategorySelect('popular', fetchPopularMovies)}
          >
            <Text style={styles.sidebarItemText}>⭐ Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => handleCategorySelect('top-rated', fetchTopRatedMovies)}
          >
            <Text style={styles.sidebarItemText}>🏆 Top Rated</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => handleCategorySelect('upcoming', fetchUpcomingMovies)}
          >
            <Text style={styles.sidebarItemText}>🚀 Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => handleCategorySelect('anime', fetchAnimeMovies)}
          >
            <Text style={styles.sidebarItemText}>🎌 Anime</Text>
          </TouchableOpacity>

          <Text style={styles.sidebarTitle}>TV Series</Text>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => handleCategorySelect('tv-popular', fetchPopularTvSeries)}
          >
            <Text style={styles.sidebarItemText}>⭐ Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => handleCategorySelect('tv-airing', fetchAiringTodayTvSeries)}
          >
            <Text style={styles.sidebarItemText}>📺 Airing Today</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => handleCategorySelect('tv-on-air', fetchOnTheAirTvSeries)}
          >
            <Text style={styles.sidebarItemText}>🎬 On The Air</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => handleCategorySelect('tv-top-rated', fetchTopRatedTvSeries)}
          >
            <Text style={styles.sidebarItemText}>🏆 Top Rated</Text>
          </TouchableOpacity>

          <Text style={styles.sidebarTitle}>Genres</Text>
          {genres.map((genre) => (
            <TouchableOpacity 
              key={genre.id}
              style={styles.sidebarItem}
              onPress={() => handleGenreSelect(genre.id)}
            >
              <Text style={styles.sidebarItemText}>{genre.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Overlay */}
      {showSidebar && (
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={toggleSidebar}
          activeOpacity={1}
        />
      )}

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#e50914']}
            tintColor="#e50914"
          />
        }
      >
        {/* Hero Section */}
        {featuredMovie && (
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={['rgba(10, 15, 40, 0.3)', 'rgba(10, 15, 40, 0.8)', '#0A0F28']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                {'title' in featuredMovie ? featuredMovie.title : featuredMovie.name}
              </Text>
              <Text style={styles.heroOverview} numberOfLines={3}>
                {featuredMovie.overview}
              </Text>
              <View style={styles.heroButtons}>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => {
                    if (user) {
                      router.push(`/movie/${featuredMovie.id}?watch=true` as any);
                    } else {
                      router.push('/login');
                    }
                  }}
                >
                  <Ionicons name="play" size={20} color="#000" style={styles.buttonIcon} />
                  <Text style={styles.playButtonText}>
                    {user ? 'Watch Now' : 'Sign In to Watch'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => router.push(`/movie/${featuredMovie.id}` as any)}
                >
                  <Ionicons name="information-circle" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.infoButtonText}>More Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Content Section */}
        <View style={styles.moviesSection}>
          <Text style={styles.sectionTitle}>{title}</Text>
          
          {moviesLoading ? (
            renderLoadingState()
          ) : (movies.length > 0 || tvSeries.length > 0) ? (
            <FlatList
              horizontal
              data={movies.length > 0 ? movies : tvSeries}
              renderItem={renderMovieItem}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moviesList}
              removeClippedSubviews={true}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    zIndex: 100,
  },
  menuButton: {
    padding: 5,
  },
  logo: {
    color: '#e50914',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 20,
  },
  searchInput: {
    color: '#fff',
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMenu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  profileText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    maxWidth: 60,
  },
  logoutButton: {
    backgroundColor: '#e50914',
    padding: 6,
    borderRadius: 15,
  },
  loginButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    zIndex: 200,
    paddingTop: 80,
  },
  sidebarContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  sidebarItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sidebarItemText: {
    color: '#ccc',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 150,
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    height: 400,
    position: 'relative',
    backgroundColor: '#2c3e50',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heroOverview: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.9,
    lineHeight: 20,
  },
  heroButtons: {
    flexDirection: 'row',
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoButton: {
    backgroundColor: 'rgba(109, 109, 110, 0.7)',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  moviesSection: {
    paddingTop: 30,
    paddingBottom: 50,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  moviesList: {
    paddingLeft: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MovieHome;