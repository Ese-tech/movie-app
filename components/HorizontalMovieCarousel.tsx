import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
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
import
{MovieCard} from './MovieCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.32; // Narrower cards - 32% of screen width
const CARD_HEIGHT = CARD_WIDTH * 1.8; // Taller aspect ratio for movie posters
const CARD_MARGIN = 8;

interface HorizontalMovieCarouselProps {
  title: string;
  movies: Movie[];
  onMoviePress?: (movie: Movie) => void;
  onViewMore?: () => void;
}

export const HorizontalMovieCarousel: React.FC<HorizontalMovieCarouselProps> = ({
  title,
  movies,
  onMoviePress,
  onViewMore,
}) => {
  const flatListRef = useRef<FlatList>(null);

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
          
          <TouchableOpacity 
            style={styles.watchButton}
            onPress={() => onMoviePress?.(item)}
          >
            <LinearGradient
              colors={['#00d4aa', '#FFD700']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.watchButtonGradient}
            >
              <Text style={styles.watchButtonText}>▶ Watch Movie</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onViewMore && (
          <TouchableOpacity onPress={onViewMore} style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View More ›</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Horizontal Carousel */}
      <FlatList
        ref={flatListRef}
        data={movies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        contentContainerStyle={styles.carouselContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
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
  carouselContent: {
    paddingHorizontal: 16,
  },
  separator: {
    width: CARD_MARGIN,
  },
  movieCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  movieContainer: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: CARD_HEIGHT * 0.7, // 70% of card height for image
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
    fontSize: 10,
    fontWeight: 'bold',
  },
});