import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { MovieCard } from '../../components/MovieCard';
import { Sidebar } from '../../components/Sidebar';
import { TrailerModal } from '../../components/TrailerModal';
import { UniversalHero } from '../../components/UniversalHero';
import { useAuth } from '../../context/AuthContext';
import { discoverAPI } from '../../src/api/tmdbApi';
import { Movie } from '../../types';

// Mock genres data - replace with TMDB API call
const movieGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const tvGenres = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
];

const { width } = Dimensions.get('window');

const genreIcons: { [key: string]: string } = {
  'Action': '⚔️',
  'Adventure': '🗺️',
  'Animation': '🎬',
  'Comedy': '😂',
  'Crime': '🔫',
  'Documentary': '📺',
  'Drama': '🎭',
  'Family': '👨‍👩‍👧‍👦',
  'Fantasy': '🧙‍♂️',
  'History': '🏛️',
  'Horror': '👻',
  'Music': '🎵',
  'Mystery': '🔍',
  'Romance': '💕',
  'Science Fiction': '🚀',
  'TV Movie': '📺',
  'Thriller': '😱',
  'War': '⚔️',
  'Western': '🤠',
  'Action & Adventure': '⚡',
  'Sci-Fi & Fantasy': '🌟',
  'Reality': '📹',
  'Talk': '🎙️',
  'News': '📰',
  'Soap': '💭',
  'Kids': '🧸',
  'War & Politics': '🏛️',
};

export default function GenresScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'movie' | 'tv'>('movie');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [showMovies, setShowMovies] = useState(false);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showingMore, setShowingMore] = useState(false);

  const currentGenres = selectedType === 'movie' ? movieGenres : tvGenres;

  const handleGenrePress = async (genre: any) => {
    try {
      setSelectedGenre(genre);
      setLoading(true);
      setShowMovies(true);
      
      if (selectedType === 'movie') {
        const movieData = await discoverAPI.moviesByGenre(genre.id);
        setMovies(movieData.slice(0, 20)); // Show first 20 initially
        setAllMovies(movieData); // Store all movies
        setCurrentPage(1);
        setShowingMore(false);
      } else {
        const tvData = await discoverAPI.tvByGenre(genre.id);
        // Convert TVShow to Movie-like structure for display
        const adaptedTvData = tvData.map(show => ({
          ...show,
          title: show.name || show.original_name,
          release_date: show.first_air_date,
          original_title: show.original_name,
          adult: false,
          video: false,
        }));
        setMovies(adaptedTvData as Movie[]);
      }
    } catch (error) {
      console.error('Error loading genre movies:', error);
      Alert.alert('Error', 'Failed to load movies for this genre');
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
    
    Alert.alert('Watch Movie', `Streaming ${movie.title}`);
  };

  const handleAddToWatchlist = (movie: Movie) => {
    Alert.alert('Watchlist', `Added ${movie.title} to your watchlist`);
  };

  const handleViewMoreMovies = async () => {
    if (!showingMore && selectedGenre) {
      try {
        setLoading(true);
        // Load more movies from API or show all cached movies
        const nextPage = currentPage + 1;
        const moreMovies = await discoverAPI.moviesByGenre(selectedGenre.id, nextPage);
        setAllMovies(prev => [...prev, ...moreMovies]);
        setMovies(prev => [...prev, ...moreMovies.slice(0, 20)]);
        setCurrentPage(nextPage);
        setShowingMore(true);
      } catch (error) {
        console.error('Error loading more movies:', error);
        // Fallback: show all cached movies
        setMovies(allMovies);
        setShowingMore(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeTrailerModal = () => {
    setTrailerModalVisible(false);
    setSelectedMovie(null);
  };

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <View style={styles.movieCardWrapper}>
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
    </View>
  );

  const renderGenre = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.genreCard} 
      onPress={() => handleGenrePress(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['rgba(0, 212, 170, 0.2)', 'rgba(0, 212, 170, 0.05)']}
        style={styles.genreGradient}
      >
        <Text style={styles.genreIcon}>
          {genreIcons[item.name] || '🎬'}
        </Text>
        <Text style={styles.genreName}>{item.name}</Text>
        <View style={styles.genreStats}>
          <Ionicons name="film" size={16} color="#00d4aa" />
          <Text style={styles.genreCount}>
            {selectedType === 'movie' ? 'Movies' : 'TV Shows'}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#0A0F28', '#1A1F3A']} style={styles.container}>
          <Header />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00d4aa" />
            <Text style={styles.loadingText}>Loading genres...</Text>
          </View>
          <Footer />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0A0F28', '#1A1F3A']} style={styles.container}>
        
        <Header />
        
        <View style={styles.mainLayout}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <UniversalHero currentPage="genres" />
            
            {!showMovies ? (
              <>
                {/* Header Section */}
                <View style={styles.headerSection}>
                  <Text style={styles.pageTitle}>Browse by Genre</Text>
                  <Text style={styles.pageSubtitle}>
                    Discover movies and TV shows by your favorite genres
                  </Text>
                </View>

                {/* Content Type Toggle */}
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      selectedType === 'movie' && styles.activeToggleButton,
                    ]}
                    onPress={() => setSelectedType('movie')}
                  >
                    <Ionicons 
                      name="film" 
                      size={20} 
                      color={selectedType === 'movie' ? '#000' : '#fff'} 
                    />
                    <Text style={[
                      styles.toggleText,
                      selectedType === 'movie' && styles.activeToggleText,
                    ]}>
                      Movies
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      selectedType === 'tv' && styles.activeToggleButton,
                    ]}
                    onPress={() => setSelectedType('tv')}
                  >
                    <Ionicons 
                      name="tv" 
                      size={20} 
                      color={selectedType === 'tv' ? '#000' : '#fff'} 
                    />
                    <Text style={[
                      styles.toggleText,
                      selectedType === 'tv' && styles.activeToggleText,
                    ]}>
                      TV Shows
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Genres Grid */}
                <View style={styles.genresSection}>
                  <FlatList
                    data={currentGenres}
                    renderItem={renderGenre}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={width > 768 ? 2 : 1}
                    key={`genres-${width > 768 ? 2 : 1}`}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    columnWrapperStyle={width > 768 ? styles.row : undefined}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.genresList}
                    scrollEnabled={false}
                  />
                </View>
              </>
            ) : (
              <>
                {/* Back to Genres Button */}
                <View style={styles.backToGenresContainer}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setShowMovies(false)}
                  >
                    <Ionicons name="arrow-back" size={24} color="#00d4aa" />
                    <Text style={styles.backText}>Back to Genres</Text>
                  </TouchableOpacity>
                </View>

                {/* Selected Genre Movies */}
                <View style={styles.moviesHeader}>
                  <Text style={styles.moviesTitle}>
                    {selectedGenre?.name} {selectedType === 'movie' ? 'Movies' : 'TV Shows'}
                  </Text>
                  <Text style={styles.moviesCount}>{movies.length} results</Text>
                </View>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00d4aa" />
                    <Text style={styles.loadingText}>Loading {selectedGenre?.name} movies...</Text>
                  </View>
                ) : (
                  <>
                    <FlatList
                      data={movies}
                      renderItem={renderMovieCard}
                      keyExtractor={(item) => item.id.toString()}
                      numColumns={width > 1200 ? 4 : width > 768 ? 3 : 2}
                      key={`genre-movies-${width > 1200 ? 4 : width > 768 ? 3 : 2}`}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.moviesList}
                      columnWrapperStyle={styles.moviesRow}
                    />
                    
                    {/* View More Button - Show if there are more movies */}
                    {!showingMore && allMovies.length > movies.length && (
                      <TouchableOpacity style={styles.fullWidthViewMoreButton} onPress={handleViewMoreMovies}>
                        <Text style={styles.fullWidthViewMoreText}>
                          View more ({allMovies.length - movies.length} more {selectedGenre?.name} {selectedType === 'movie' ? 'movies' : 'shows'})
                        </Text>
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
          {/* Sidebar - only show on large screens */}
          {width >= 1200 && <Sidebar width={width} />}
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
  headerSection: {
    padding: 20,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    maxWidth: '80%',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeToggleButton: {
    backgroundColor: '#00d4aa',
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activeToggleText: {
    color: '#000',
  },
  genresSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  genresList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  separator: {
    height: 16,
  },
  genreCard: {
    flex: 0.48,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  genreGradient: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
  },
  genreIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  genreName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  genreStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  genreCount: {
    color: '#00d4aa',
    fontSize: 12,
    fontWeight: '500',
  },
  // New styles for movie display
  backToGenresContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#00d4aa',
    fontSize: 16,
    fontWeight: '600',
  },
  moviesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 170, 0.2)',
  },
  moviesTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  moviesCount: {
    color: '#00d4aa',
    fontSize: 14,
  },
  moviesList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  moviesRow: {
    justifyContent: 'center',
    gap: 16,
  },
  movieCardWrapper: {
    width: width > 1200 ? 280 : width > 768 ? 240 : width * 0.45,
    marginVertical: 8,
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
});