import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useMovieContext } from '../context/MovieContext';
import { Movie, TVSeries } from '../types';
import TrailerModal from './TrailerModal';

interface MovieCardProps {
  item: Movie | TVSeries;
  type: 'movie' | 'tv';
  onPress?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, type, onPress }) => {
  const { user } = useAuth();
  const { fetchTrailer, trailerUrl, setTrailerUrl } = useMovieContext();
  const router = useRouter();
  const [scaleValue] = useState(new Animated.Value(1));
  const [isHovered, setIsHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handleHoverIn = () => {
    setIsHovered(true);
    Animated.spring(scaleValue, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/movie/${item.id}` as any);
    }
  };

  const handleWatchTrailer = async (e: any) => {
    e.stopPropagation();
    
    if (isLoadingTrailer) return;

    try {
      setIsLoadingTrailer(true);
      await fetchTrailer(item.id, type);
      
      // Wait a bit for the trailer URL to be set
      setTimeout(() => {
        if (trailerUrl) {
          setShowTrailer(true);
        } else {
          Alert.alert('No Trailer', 'Trailer not available for this content');
        }
        setIsLoadingTrailer(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching trailer:', error);
      Alert.alert('Error', 'Failed to load trailer');
      setIsLoadingTrailer(false);
    }
  };

  const handleWatchMovie = (e: any) => {
    e.stopPropagation();
    if (user) {
      router.push(`/movie/${item.id}?watch=true` as any);
    } else {
      Alert.alert(
        'Sign In Required',
        'Please sign in to watch movies and TV shows',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/login') },
        ]
      );
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setTrailerUrl(null);
  };

  const posterUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://via.placeholder.com/500x750/333/fff?text=No+Poster';

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        {...(Platform.OS === 'web' ? {
          onMouseEnter: handleHoverIn,
          onMouseLeave: handleHoverOut,
        } : {})}
      >
        <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: posterUrl }} 
              style={styles.poster}
              resizeMode="cover"
            />
            
            {/* Hover overlay with movie info */}
            <Animated.View style={[
              styles.hoverOverlay, 
              { opacity: isHovered ? 1 : 0 }
            ]}>
              <View style={styles.movieInfo}>
                <Text style={styles.hoverTitle} numberOfLines={2}>
                  {title}
                </Text>
                <Text style={styles.hoverYear}>{year}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.hoverRating}>
                    {item.vote_average.toFixed(1)}
                  </Text>
                </View>
                <Text style={styles.hoverOverview} numberOfLines={3}>
                  {item.overview || 'No overview available.'}
                </Text>
                
                {/* Action buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.trailerButton, isLoadingTrailer && styles.disabledButton]} 
                    onPress={handleWatchTrailer}
                    disabled={isLoadingTrailer}
                  >
                    {isLoadingTrailer ? (
                      <Text style={styles.buttonText}>Loading...</Text>
                    ) : (
                      <>
                        <Ionicons name="play" size={16} color="#fff" />
                        <Text style={styles.buttonText}>Trailer</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.watchButton} 
                    onPress={handleWatchMovie}
                  >
                    <Ionicons name="play-circle" size={16} color="#000" />
                    <Text style={styles.watchButtonText}>
                      {user ? 'Watch' : 'Sign In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            <View style={styles.yearBadge}>
              <Text style={styles.yearText}>{year}</Text>
            </View>

            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={styles.ratingBadgeText}>
                {item.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.genreContainer}>
              <Text style={styles.genre}>
                {type === 'movie' ? 'Movie' : 'TV Series'}
              </Text>
              <View style={styles.hdBadge}>
                <Text style={styles.hdText}>HD</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Trailer Modal */}
      <TrailerModal
        visible={showTrailer}
        trailerKey={trailerUrl}
        onClose={handleCloseTrailer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginVertical: 10,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  hoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    zIndex: 3,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hoverTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hoverYear: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hoverRating: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  hoverOverview: {
    color: '#cccccc',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  watchButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  yearBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#06b6d4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  yearText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  ratingBadgeText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  info: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
  genreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genre: {
    color: '#888',
    fontSize: 11,
    marginRight: 8,
  },
  hdBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  hdText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MovieCard;
