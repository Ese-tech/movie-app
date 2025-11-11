import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchPopularMovies, fetchTopRatedMovies, getPosterUrl, Movie } from '../api/tmdb';

interface SidebarProps {
  isVisible?: boolean;
}

export function Sidebar({ isVisible = true }: SidebarProps) {
  const router = useRouter();
  const [mostViewed, setMostViewed] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSidebarData();
  }, []);

  const loadSidebarData = async () => {
    try {
      setLoading(true);
      const [popularData, topRatedData] = await Promise.all([
        fetchPopularMovies(),
        fetchTopRatedMovies()
      ]);

      // Most viewed = popular movies (first 8)
      setMostViewed(popularData.results.slice(0, 8));
      // Recommended = top rated movies (first 8)
      setRecommended(topRatedData.results.slice(0, 8));
    } catch (error) {
      console.error('Error loading sidebar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToMovie = (movieId: number) => {
    router.push('/modal');
  };

  const handleViewMoreMostViewed = () => {
    router.push('/movies');
  };

  const handleViewMoreRecommended = () => {
    router.push('/movies');
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
        source={{ uri: getPosterUrl(item.poster_path || '') }}
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
        <ScrollView 
          style={styles.moviesContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {mostViewed.map((item, index) => renderSidebarMovie(item, index, 'viewed'))}
        </ScrollView>
        <TouchableOpacity 
          style={styles.viewMoreButton}
          onPress={handleViewMoreMostViewed}
        >
          <Text style={styles.viewMoreText}>View More</Text>
          <Ionicons name="chevron-forward" size={16} color="#00d4aa" />
        </TouchableOpacity>
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
        <ScrollView 
          style={styles.moviesContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {recommended.map((item, index) => renderSidebarMovie(item, index, 'recommended'))}
        </ScrollView>
        <TouchableOpacity 
          style={styles.viewMoreButton}
          onPress={handleViewMoreRecommended}
        >
          <Text style={styles.viewMoreText}>View More</Text>
          <Ionicons name="chevron-forward" size={16} color="#FFD700" />
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0, 212, 170, 0.2)',
    maxHeight: 800, // Ensure proper height for scrolling
    maxWidth: 300,
    marginTop: 100,
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
    width: 32,
    height: 48,
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
});