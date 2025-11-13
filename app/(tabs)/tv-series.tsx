import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
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
import { MovieCard } from '../../components/MovieCard';
import { Sidebar } from '../../components/Sidebar';
import { TrailerModal } from '../../components/TrailerModal';
import { UniversalHero } from '../../components/UniversalHero';
import { useAuth } from '../../context/AuthContext';
import {
    tvAPI
} from '../../src/api/tmdbApi';
import { TVShow } from '../../types';

const { width } = Dimensions.get('window');
const categories = ['Popular', 'Top Rated', 'On The Air', 'Airing Today'];

export default function TVSeriesScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [allShows, setAllShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  const [selectedShow, setSelectedShow] = useState<TVShow | null>(null);
  const [showingAll, setShowingAll] = useState(false);

  const INITIAL_LOAD = 80;

  useEffect(() => {
    loadTVShows();
  }, [selectedCategory]);

  const loadTVShows = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      }
      
      let showData;
      
      switch (selectedCategory) {
        case 'Popular':
          showData = await tvAPI.getPopular();
          break;
        case 'Top Rated':
          showData = await tvAPI.getTopRated();
          break;
        case 'On The Air':
          showData = await tvAPI.getOnTheAir();
          break;
        case 'Airing Today':
          showData = await tvAPI.getAiringToday();
          break;
        default:
          showData = await tvAPI.getPopular();
      }
      
      const newShows = showData.results || showData;
      setAllShows(newShows);
      setTotalPages(showData.total_pages || 1);
      
      // Initially show only 80 shows
      if (!searchQuery) {
        setTvShows(newShows.slice(0, INITIAL_LOAD));
        setShowingAll(false);
      } else {
        setTvShows(newShows);
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading TV shows:', error);
      setTvShows([]);
      setAllShows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPress = (show: TVShow) => {
    router.push(`/modal?id=${show.id}`);
  };

  const handleWatchTrailer = (show: TVShow) => {
    setSelectedShow(show);
    setTrailerModalVisible(true);
  };

  const handleWatchShow = (show: TVShow) => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please log in to watch shows.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/profile') }
        ]
      );
      return;
    }
    
    Alert.alert('Watch Show', `Streaming ${show.name || show.original_name}`);
  };

  const handleViewMore = () => {
    setTvShows(allShows);
    setShowingAll(true);
  };

  const handleShowLess = () => {
    setTvShows(allShows.slice(0, INITIAL_LOAD));
    setShowingAll(false);
  };

  const closeTrailerModal = () => {
    setTrailerModalVisible(false);
    setSelectedShow(null);
  };

    const handleAddToWatchlist = (show: TVShow) => {
    Alert.alert('Watchlist', `Added ${show.name || show.original_name} to your watchlist`);
  };

  const renderShowCard = ({ item }: { item: TVShow }) => (
    <View style={styles.showCardWrapper}>
      <MovieCard
        id={item.id}
        title={item.name || item.original_name}
        poster_path={item.poster_path}
        vote_average={item.vote_average}
        release_date={item.first_air_date}
        overview={item.overview}
        onPress={() => handleShowPress(item)}
        onWatchTrailer={() => handleWatchTrailer(item)}
        onWatchMovie={() => handleWatchShow(item)}
        onAddToWatchlist={() => handleAddToWatchlist(item)}
      />
    </View>
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
                placeholder="Search TV shows..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
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
          <UniversalHero currentPage="tv-series" />

          {/* Category Filters */}
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.activeCategoryButtonText
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory}
            </Text>
            <Text style={styles.resultsCount}>
              {tvShows.length} shows
            </Text>
          </View>

          {/* TV Shows Grid */}
          {loading && currentPage === 1 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00d4aa" />
              <Text style={styles.loadingText}>Loading TV shows...</Text>
            </View>
          ) : (
                          <>
              <FlatList
                data={tvShows}
                renderItem={renderShowCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={width > 1200 ? 4 : width > 768 ? 3 : 2}
                key={`tvshows-${width > 1200 ? 4 : width > 768 ? 3 : 2}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.showsList}
                columnWrapperStyle={styles.row}
              />
              
              {/* View More / Show Less Button */}
              {allShows.length > INITIAL_LOAD && (
                !showingAll ? (
                  <TouchableOpacity style={styles.fullWidthViewMoreButton} onPress={handleViewMore}>
                    <Text style={styles.fullWidthViewMoreText}>
                      View more ({allShows.length - INITIAL_LOAD} more shows)
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.fullWidthViewMoreButton} onPress={handleShowLess}>
                    <Text style={styles.fullWidthViewMoreText}>Show Less</Text>
                  </TouchableOpacity>
                )
              )}
            </>
          )}

          {/* Add some bottom padding */}
          <View style={{ height: 100 }} />
          
          <Footer />
        </ScrollView>

        {/* Sidebar - only show on large screens */}
        {width >= 1200 && <Sidebar width={width} />}
      </View>
      
      {/* Trailer Modal */}
      <TrailerModal
        visible={trailerModalVisible}
        onClose={closeTrailerModal}
        movieId={selectedShow?.id || null}
        movieTitle={selectedShow?.name || selectedShow?.original_name || ''}
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
    minWidth: 0,
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
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 16,
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
  showsList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  row: {
    justifyContent: 'center',
    gap: 16,
  },
  showCardWrapper: {
    width: width > 1200 ? 280 : width > 768 ? 240 : width * 0.45,
    marginVertical: 8,
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
  loadingMoreText: {
    color: '#fff',
    fontSize: 16,
  },
});
