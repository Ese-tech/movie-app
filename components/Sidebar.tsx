import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { movieAPI } from '../src/api/tmdbApi';
import { Movie } from '../types';

const { width } = Dimensions.get('window');

interface SidebarProps {
  isVisible?: boolean;
}

export function Sidebar({ isVisible = true }: SidebarProps) {
  const router = useRouter();
  const [mostViewed, setMostViewed] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewedStartIndex, setViewedStartIndex] = useState(0);
  const [recommendedStartIndex, setRecommendedStartIndex] = useState(0);
  const ITEMS_PER_PAGE = 8;
  const MAX_ITEMS = 100;

  // Don't render sidebar on tablet and mobile screens
  if (width < 1200) {
    return null;
  }

  useEffect(() => {
    loadSidebarMovies();
  }, []);

  const loadSidebarMovies = async () => {
    try {
      setLoading(true);
      // Load multiple pages to get 100 items
      const [popularData, topRatedData, popularData2, topRatedData2, popularData3, topRatedData3] = await Promise.all([
        movieAPI.getPopular(1),
        movieAPI.getTopRated(1),
        movieAPI.getPopular(2),
        movieAPI.getTopRated(2),
        movieAPI.getPopular(3),
        movieAPI.getTopRated(3)
      ]);
      
      const allPopular = [
        ...(popularData.results || []),
        ...(popularData2.results || []),
        ...(popularData3.results || [])
      ].slice(0, MAX_ITEMS);
      
      const allTopRated = [
        ...(topRatedData.results || []),
        ...(topRatedData2.results || []),
        ...(topRatedData3.results || [])
      ].slice(0, MAX_ITEMS);
      
      setMostViewed(allPopular);
      setRecommended(allTopRated);
    } catch (error) {
      console.error('Error loading sidebar movies:', error);
    } finally {
      setLoading(false);
    }
  };  const navigateToMovie = (movieId: number) => {
    router.push(`/modal?id=${movieId}`);
  };

  const handleViewMoreMostViewed = () => {
    const nextIndex = viewedStartIndex + ITEMS_PER_PAGE;
    if (nextIndex < mostViewed.length) {
      setViewedStartIndex(nextIndex);
    } else {
      setViewedStartIndex(0); // Reset to beginning
    }
  };

  const handleViewMoreRecommended = () => {
    const nextIndex = recommendedStartIndex + ITEMS_PER_PAGE;
    if (nextIndex < recommended.length) {
      setRecommendedStartIndex(nextIndex);
    } else {
      setRecommendedStartIndex(0); // Reset to beginning
    }
  };

  const handleViewLessMostViewed = () => {
    const prevIndex = viewedStartIndex - ITEMS_PER_PAGE;
    setViewedStartIndex(prevIndex >= 0 ? prevIndex : Math.max(0, mostViewed.length - ITEMS_PER_PAGE));
  };

  const handleViewLessRecommended = () => {
    const prevIndex = recommendedStartIndex - ITEMS_PER_PAGE;
    setRecommendedStartIndex(prevIndex >= 0 ? prevIndex : Math.max(0, recommended.length - ITEMS_PER_PAGE));
  };

  const renderSidebarMovie = (item: Movie, index: number, section: 'viewed' | 'recommended') => (
    <TouchableOpacity
      key={`${section}_${item.id}`}
      style={styles.sidebarMovieItem}
      onPress={() => navigateToMovie(item.id)}
    >
      <View style={styles.sidebarMovieRank}>
        <Text style={styles.sidebarMovieRankText}>{index + 1}</Text>
      </View>
      <Image
        source={{ 
          uri: item.poster_path 
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image'
        }}
        style={styles.sidebarMoviePoster}
        resizeMode="cover"
      />
      <View style={styles.sidebarMovieInfo}>
        <Text style={styles.sidebarMovieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.sidebarMovieDetails}>
          <View style={styles.sidebarRatingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.sidebarMovieRating}>
              {item.vote_average.toFixed(1)}
            </Text>
          </View>
          <Text style={styles.sidebarMovieYear}>
            {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!isVisible) return null;

  if (loading) {
    return (
      <View style={styles.sidebar}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#00d4aa" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.sidebar}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      {/* Most Viewed Section */}
      <LinearGradient
        colors={['rgba(0, 212, 170, 0.1)', 'rgba(0, 212, 170, 0.05)']}
        style={styles.sidebarSection}
      >
        <View style={styles.sidebarHeader}>
          <Ionicons name="eye" size={20} color="#00d4aa" />
          <Text style={styles.sidebarTitle}>Most Viewed</Text>
        </View>
        <View style={styles.moviesContainer}>
          <Text style={styles.pageIndicator}>
            {viewedStartIndex + 1}-{Math.min(viewedStartIndex + ITEMS_PER_PAGE, mostViewed.length)} of {mostViewed.length}
          </Text>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {mostViewed.slice(viewedStartIndex, viewedStartIndex + ITEMS_PER_PAGE).map((item, index) => 
              renderSidebarMovie(item, viewedStartIndex + index, 'viewed')
            )}
          </ScrollView>
        </View>
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, viewedStartIndex === 0 && styles.disabledButton]}
            onPress={handleViewLessMostViewed}
            disabled={viewedStartIndex === 0}
          >
            <Ionicons name="chevron-up" size={16} color={viewedStartIndex === 0 ? '#666' : '#00d4aa'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navButton, (viewedStartIndex + ITEMS_PER_PAGE >= mostViewed.length) && styles.disabledButton]}
            onPress={handleViewMoreMostViewed}
            disabled={viewedStartIndex + ITEMS_PER_PAGE >= mostViewed.length}
          >
            <Ionicons name="chevron-down" size={16} color={(viewedStartIndex + ITEMS_PER_PAGE >= mostViewed.length) ? '#666' : '#00d4aa'} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Recommended Section */}
      <LinearGradient
        colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)']}
        style={styles.sidebarSection}
      >
        <View style={styles.sidebarHeader}>
          <Ionicons name="thumbs-up" size={20} color="#FFD700" />
          <Text style={styles.sidebarTitle}>Recommended</Text>
        </View>
        <View style={styles.moviesContainer}>
          <Text style={styles.pageIndicator}>
            {recommendedStartIndex + 1}-{Math.min(recommendedStartIndex + ITEMS_PER_PAGE, recommended.length)} of {recommended.length}
          </Text>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {recommended.slice(recommendedStartIndex, recommendedStartIndex + ITEMS_PER_PAGE).map((item, index) => 
              renderSidebarMovie(item, recommendedStartIndex + index, 'recommended')
            )}
          </ScrollView>
        </View>
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, recommendedStartIndex === 0 && styles.disabledButton]}
            onPress={handleViewLessRecommended}
            disabled={recommendedStartIndex === 0}
          >
            <Ionicons name="chevron-up" size={16} color={recommendedStartIndex === 0 ? '#666' : '#FFD700'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navButton, (recommendedStartIndex + ITEMS_PER_PAGE >= recommended.length) && styles.disabledButton]}
            onPress={handleViewMoreRecommended}
            disabled={recommendedStartIndex + ITEMS_PER_PAGE >= recommended.length}
          >
            <Ionicons name="chevron-down" size={16} color={(recommendedStartIndex + ITEMS_PER_PAGE >= recommended.length) ? '#666' : '#FFD700'} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    minWidth: 280,
    maxWidth: 280,
    backgroundColor: '#0a0a0a',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0, 212, 170, 0.1)',
    maxHeight: '100%',
    flexShrink: 0,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 10,
  },
  sidebarSection: {
    marginBottom: 30,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.1)',
    position: 'relative',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sidebarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 212, 170, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  moviesContainer: {
    maxHeight: 800, // Allow scrolling in movie list
    maxWidth: 250,
  },
  sidebarMovieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.1)',
  },
  sidebarMovieRank: {
    width: 20,
    height: 20,
    backgroundColor: '#00d4aa',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sidebarMovieRankText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sidebarMoviePoster: {
    width: 52,
    height: 68,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.2)',
  },
  sidebarMovieInfo: {
    flex: 1,
  },
  sidebarMovieTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
    lineHeight: 14,
  },
  sidebarMovieDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarMovieRating: {
    color: '#FFD700',
    fontSize: 9,
    marginLeft: 4,
    fontWeight: '500',
  },
  sidebarMovieYear: {
    color: '#CCCCCC',
    fontSize: 9,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
  },
  viewMoreText: {
    color: '#00d4aa',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 5,
  },
  pageIndicator: {
    color: '#888',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});