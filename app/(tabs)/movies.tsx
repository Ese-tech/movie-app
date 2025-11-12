import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { TrailerModal } from '../../components/TrailerModal';
import { UniversalHero } from '../../components/UniversalHero';
import { useAuth } from '../../context/AuthContext';
import { Movie } from '../../types';
import {
  movieAPI,
  trendingAPI,
  searchAPI
} from '../../src/api/tmdbApi';

const { width } = Dimensions.get('window');
const categories = ['Latest', 'Popular', 'Upcoming'];

export default function MoviesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isLoggedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showingAll, setShowingAll] = useState(false);

  const INITIAL_LOAD = 80;

  // Handle URL parameter to set category
  useEffect(() => {
    if (params.category && categories.includes(params.category as string)) {
      setSelectedCategory(params.category as string);
    }
  }, [params.category]);

  useEffect(() => {
    loadMovies();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      loadMovies();
    }
  }, [searchQuery]);

  const loadMovies = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      let movieData;
      
      switch (selectedCategory) {
        case 'Latest':
          movieData = await trendingAPI.movies('week');
          break;
        case 'Popular':
          movieData = await movieAPI.getPopular();
          break;
        case 'Upcoming':
          movieData = await movieAPI.getUpcoming();
          break;
        default:
          movieData = await trendingAPI.movies('week');
      }
      
      const newMovies = movieData.results || movieData;
      setAllMovies(newMovies);
      setTotalPages(movieData.total_pages || 1);
      
      // Initially show only 80 movies
      if (!searchQuery) {
        setMovies(newMovies.slice(0, INITIAL_LOAD));
        setShowingAll(false);
      } else {
        setMovies(newMovies);
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
      setAllMovies([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const searchResults = await searchAPI.movies(searchQuery);
      setMovies(searchResults.results || searchResults);
    } catch (error) {
      console.error('Error searching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryMovies = (category: string) => {
    switch (category) {
      case 'Popular':
        return allMovies.filter((_, index) => index < 20); // First 20 for Popular
      case 'Top Rated':
        return allMovies.filter((_, index) => index >= 20 && index < 40); // Next 20 for Top Rated
      case 'Upcoming':
        return allMovies.filter((_, index) => index >= 40 && index < 60); // Next 20 for Upcoming
      case 'Featured':
        return allMovies.filter((_, index) => index >= 60 && index < 80); // Last 20 for Featured
      default:
        return allMovies.slice(0, 20);
    }
  };

  const handleCategoryViewMore = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when viewing category
    setMovies(getCategoryMovies(category));
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
    
    Alert.alert('Watch Movie', `Streaming ${movie.title}`);
  };

  const handleAddToWatchlist = (movie: Movie) => {
    Alert.alert('Watchlist', `Added ${movie.title} to your watchlist`);
  };

  const handleViewMore = () => {
    setMovies(allMovies);
    setShowingAll(true);
  };

  const handleShowLess = () => {
    setMovies(allMovies.slice(0, INITIAL_LOAD));
    setShowingAll(false);
  };

  const closeTrailerModal = () => {
    setTrailerModalVisible(false);
    setSelectedMovie(null);
  };

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.movieCard} 
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.movieContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
                : 'https://via.placeholder.com/500x750?text=No+Image'
            }}
            style={styles.movieImage}
            resizeMode="cover"
          />
          {/* Overlay with movie type badge */}
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.3)', 'transparent']}
            style={styles.imageOverlay}
          />
          <View style={styles.movieBadge}>
            <Text style={styles.badgeText}>MOVIE</Text>
          </View>
        </View>
        
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={1}>
            {item.title}
          </Text>
          
          <View style={styles.movieMeta}>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{item.vote_average?.toFixed(1) || 'N/A'}</Text>
            </View>
            <Text style={styles.year}>
              {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
            </Text>
            <View style={styles.qualityBadge}>
              <Text style={styles.qualityText}>HD</Text>
            </View>
          </View>
          
          <Text style={styles.overview} numberOfLines={2}>
            {item.overview || 'No description available.'}
          </Text>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.trailerButton]}
              onPress={() => handleWatchTrailer(item)}
            >
              <Text style={styles.trailerButtonText}>▶ Trailer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.watchButton]}
              onPress={() => handleWatchMovie(item)}
            >
              <LinearGradient
                colors={['#00d4aa', '#FFD700']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.watchButtonGradient}
              >
                <Text style={styles.watchButtonText}>▶ Watch</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a1a', '#0a2a1a']}
        style={styles.gradient}
      />
      
      <Header />
      
      <View style={styles.mainLayout}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search movies..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Hero Section */}
          <UniversalHero currentPage="movies" />

          {/* Search Results or Category Filters */}
          {searchQuery ? (
            <>
              {/* Search Results Header */}
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>Search Results for "{searchQuery}"</Text>
                <Text style={styles.resultsCount}>{movies.length} movies</Text>
              </View>
              
              {/* Search Results Grid */}
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#00d4aa" />
                  <Text style={styles.loadingText}>Searching movies...</Text>
                </View>
              ) : (
                <FlatList
                  data={movies}
                  renderItem={renderMovieCard}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={4}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.moviesList}
                  columnWrapperStyle={styles.row}
                />
              )}
            </>
          ) : (
            <>
              {/* Category Filter Tabs */}
              <View style={styles.tabsContainer}>
                <View style={styles.tabsWrapper}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.tab,
                        selectedCategory === category && styles.activeTab
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          selectedCategory === category && styles.activeTabText
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Most Viewed Button */}
                <TouchableOpacity style={styles.mostViewedButton}>
                  <Text style={styles.mostViewedText}>MOST VIEWED</Text>
                </TouchableOpacity>
              </View>

              {/* Movies Grid */}
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#00d4aa" />
                  <Text style={styles.loadingText}>Loading {selectedCategory} movies...</Text>
                </View>
              ) : (
                <>
                  <FlatList
                    data={movies}
                    renderItem={renderMovieCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={4}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.moviesList}
                    columnWrapperStyle={styles.row}
                  />
                  
                  {/* View More Button - Full width like the image */}
                  {!showingAll && allMovies.length > INITIAL_LOAD && (
                    <TouchableOpacity style={styles.fullWidthViewMoreButton} onPress={handleViewMore}>
                      <Text style={styles.fullWidthViewMoreText}>View more</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}

           {/* Add some bottom padding before footer */}
           <View style={{ height: 100 }} />
           
           <Footer />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabsWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00d4aa',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
  },
  tabText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#00d4aa',
    fontWeight: 'bold',
  },
  mostViewedButton: {
    backgroundColor: '#00d4aa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mostViewedText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
  },
  activeCategoryButton: {
    backgroundColor: '#00d4aa',
    borderColor: '#00d4aa',
  },
  categoryButtonText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 170, 0.2)',
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultsCount: {
    color: '#00d4aa',
    fontSize: 14,
  },
  moviesList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  row: {
    justifyContent: 'center',
    gap: 16,
  },
  movieCard: {
    width: 280,
    height: 570,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginRight: 30,
  },
  movieContainer: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 450, // 70% of card height for image
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  movieBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#00d4aa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  movieInfo: {
    padding: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  ratingContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 4,
  },
  rating: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  year: {
    color: '#ccc',
    fontSize: 10,
    marginRight: 4,
  },
  qualityBadge: {
    backgroundColor: '#555',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  qualityText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  overview: {
    color: '#bbb',
    fontSize: 10,
    lineHeight: 12,
    marginBottom: 6,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  trailerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  trailerButtonText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  watchButton: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  watchButtonGradient: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    color: '#00d4aa',
    marginTop: 10,
    fontSize: 14,
  },
  viewMoreContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  viewMoreButton: {
    backgroundColor: '#00d4aa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  viewMoreText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  fullWidthViewMoreButton: {
    backgroundColor: '#00d4aa',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthViewMoreText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    width: 75,
  },
  categorySection: {
    width: 1600,
    marginVertical: 20,
    paddingHorizontal: 70,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewMoreLinkText: {
    color: '#00d4aa',
    fontSize: 16,
    fontWeight: '600',
  },
  carouselContent: {
    width: 1500,
    justifyContent: 'space-around',
    flex: 1,
  },
});
