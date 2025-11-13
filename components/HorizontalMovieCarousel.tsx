import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Movie } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.28; // Slightly narrower cards - 28% of screen width
const CARD_HEIGHT = CARD_WIDTH * 1.9; // Taller aspect ratio for movie posters
const CARD_MARGIN = 12; // More spacing between cards

interface HorizontalMovieCarouselProps {
  title: string;
  movies: Movie[];
  onMoviePress?: (movie: Movie) => void;
  onWatchTrailer?: (movie: Movie) => void;
  onWatchMovie?: (movie: Movie) => void;
  onViewMore?: () => void;
  onLoadMore?: () => Promise<Movie[]>; // New prop for loading more movies
  initialDisplayCount?: number; // How many movies to show initially
}

export const HorizontalMovieCarousel: React.FC<HorizontalMovieCarouselProps> = ({
  title,
  movies,
  onMoviePress,
  onWatchTrailer,
  onWatchMovie,
  onViewMore,
  onLoadMore,
  initialDisplayCount = 4,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const [allMovies, setAllMovies] = useState(movies);
  const [loading, setLoading] = useState(false);

  // Update allMovies when props.movies changes
  React.useEffect(() => {
    setAllMovies(movies);
  }, [movies]);

  const handleViewMore = () => {
    if (allMovies.length > displayCount) {
      // Show 4 more movies
      const newDisplayCount = Math.min(displayCount + 4, allMovies.length);
      setDisplayCount(newDisplayCount);
      
      // Scroll to show the new movies after state update
      setTimeout(() => {
        const scrollToIndex = Math.max(0, displayCount);
        flatListRef.current?.scrollToIndex({
          index: Math.min(scrollToIndex, newDisplayCount - 1),
          animated: true,
        });
      }, 100);
    } else if (onViewMore) {
      onViewMore();
    }
  };

  const handleShowLess = () => {
    setDisplayCount(initialDisplayCount);
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  const currentMovies = allMovies.slice(0, displayCount);
  const hasMoreToShow = allMovies.length > displayCount;
  const canShowLess = displayCount > initialDisplayCount;

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.movieCard} 
      onPress={() => onMoviePress?.(item)}
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
              onPress={() => onWatchTrailer?.(item)}
            >
              <Text style={styles.trailerButtonText}>▶ Trailer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.watchButton]}
              onPress={() => onWatchMovie?.(item)}
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
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerActions}>
          {hasMoreToShow && (
            <TouchableOpacity 
              onPress={handleViewMore} 
              style={[styles.viewMoreButton, loading && styles.disabledButton]}
              disabled={loading}
            >
              <Text style={styles.viewMoreText}>
                {loading ? 'Loading...' : 'View More ›'}
              </Text>
            </TouchableOpacity>
          )}
          {canShowLess && (
            <TouchableOpacity onPress={handleShowLess} style={styles.showLessButton}>
              <Text style={styles.showLessText}>‹ Show Less</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Horizontal Carousel */}
      <FlatList
        ref={flatListRef}
        data={currentMovies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ 
              index: Math.min(info.index, currentMovies.length - 1), 
              animated: true 
            });
          });
        }}
      />
      
      {/* Movie count indicator */}
      <View style={styles.countIndicator}>
        <Text style={styles.countText}>
          Showing {currentMovies.length} of {allMovies.length} {title.toLowerCase()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: width > 1200 ? 70 : width > 768 ? 20 : 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewMoreButton: {
    padding: 8,
  },
  viewMoreText: {
    color: '#00d4aa',
    fontSize: 16,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  showLessButton: {
    padding: 8,
  },
  showLessText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
  countIndicator: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  countText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  carouselContent: {
    paddingLeft: width > 768 ? 20 : 10,
    paddingRight: width > 768 ? 20 : 10,
  },
  separator: {
    width: width > 768 ? 75 : 20,
  },
  movieCard: {
    width: width > 1200 ? 280 : width > 768 ? 240 : width * 0.45,
    height: width > 1200 ? 570 : width > 768 ? 480 : width * 0.85,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginRight: width > 768 ? 20 : 10,
  },
  movieContainer: {
    flex: 1,
   
  },
  imageContainer: {
    position: 'relative',
    height: width > 1200 ? 450 : width > 768 ? 360 : width * 0.6,
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
});