import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
    fetchAiringTodayTVShows,
    fetchOnTheAirTVShows,
    fetchPopularTVShows,
    fetchTopRatedTVShows,
    fetchTrendingTVShows,
    fetchTVGenres,
    fetchTVShowsByGenre,
    Genre,
    searchTVShows,
    TVShow
} from '../../api/tmdb';
import { MovieCard } from '../../components/MovieCard';
import { Sidebar } from '../../components/Sidebar';

const categories = ['Trending', 'Popular', 'Top Rated', 'On The Air', 'Airing Today'];

export default function TVSeriesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadGenres();
    loadTVShows();
  }, []);

  useEffect(() => {
    loadTVShows();
  }, [selectedCategory, selectedGenre]);

  const loadGenres = async () => {
    try {
      const genresData = await fetchTVGenres();
      setGenres(genresData.genres);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const loadTVShows = async (page = 1, append = false) => {
    try {
      setLoading(!append);
      let tvData;
      
      if (selectedGenre) {
        tvData = await fetchTVShowsByGenre(selectedGenre, page);
      } else {
        switch (selectedCategory) {
          case 'Trending':
            tvData = await fetchTrendingTVShows();
            break;
          case 'Popular':
            tvData = await fetchPopularTVShows(page);
            break;
          case 'Top Rated':
            tvData = await fetchTopRatedTVShows(page);
            break;
          case 'On The Air':
            tvData = await fetchOnTheAirTVShows(page);
            break;
          case 'Airing Today':
            tvData = await fetchAiringTodayTVShows(page);
            break;
          default:
            tvData = await fetchPopularTVShows(page);
        }
      }
      
      const newShows = tvData.results.map(show => ({
        ...show,
        isTV: true
      }));

      if (append) {
        setTvShows(prev => [...prev, ...newShows]);
      } else {
        setTvShows(newShows);
      }
      
      setHasMore(page < tvData.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading TV shows:', error);
      Alert.alert('Error', 'Failed to load TV shows');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTVShows();
      return;
    }
    
    try {
      setLoading(true);
      const searchData = await searchTVShows(searchQuery);
      const searchResults = searchData.results.map(show => ({
        ...show,
        isTV: true
      }));
      setTvShows(searchResults);
    } catch (error) {
      console.error('Error searching TV shows:', error);
      Alert.alert('Error', 'Failed to search TV shows');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadTVShows(currentPage + 1, true);
    }
  };

  const renderTVCard = ({ item }: { item: TVShow }) => (
    <MovieCard
      id={item.id}
      title={item.name}
      poster_path={item.poster_path}
      vote_average={item.vote_average}
      release_date={item.first_air_date}
      overview={item.overview}
      onPress={() => {}}
      onWatchTrailer={() => {}}
      onWatchMovie={() => {}}
      onAddToWatchlist={() => {}}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a2a1a']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.mainLayout}>
        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search TV series..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  loadTVShows();
                }}
              >
                <Ionicons name="close" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterButton,
                    selectedCategory === category && styles.activeFilterButton
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setSelectedGenre(null);
                  }}
                >
                  <Text style={[
                    styles.filterText,
                    selectedCategory === category && styles.activeFilterText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Genre Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Genres</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedGenre === null && styles.activeFilterButton
                ]}
                onPress={() => setSelectedGenre(null)}
              >
                <Text style={[
                  styles.filterText,
                  selectedGenre === null && styles.activeFilterText
                ]}>
                  All Genres
                </Text>
              </TouchableOpacity>
              {genres.map((genre) => (
                <TouchableOpacity
                  key={genre.id}
                  style={[
                    styles.filterButton,
                    selectedGenre === genre.id && styles.activeFilterButton
                  ]}
                  onPress={() => setSelectedGenre(genre.id)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedGenre === genre.id && styles.activeFilterText
                  ]}>
                    {genre.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* TV Shows Section */}
          <View style={styles.showsSection}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               selectedGenre ? genres.find(g => g.id === selectedGenre)?.name : selectedCategory}
            </Text>
            
            {loading && tvShows.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00d4aa" />
                <Text style={styles.loadingText}>Loading TV series...</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={tvShows}
                  renderItem={renderTVCard}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  contentContainerStyle={styles.showsList}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.row}
                />
                
                {hasMore && (
                  <View style={styles.loadMoreContainer}>
                    <TouchableOpacity 
                      style={styles.viewMoreButton} 
                      onPress={loadMore}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.viewMoreText}>View More</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
          
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Sidebar */}
        <Sidebar isVisible={!loading || tvShows.length > 0} />
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
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.2)',
  },
  activeFilterButton: {
    backgroundColor: '#00d4aa',
    borderColor: '#00d4aa',
  },
  filterText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#000000',
    fontWeight: '600',
  },
  showsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 212, 170, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  showsList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  viewMoreButton: {
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.5)',
    elevation: 3,
    shadowColor: '#00d4aa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  viewMoreText: {
    color: '#00d4aa',
    fontSize: 14,
    fontWeight: '600',
  },
});