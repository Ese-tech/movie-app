import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Animated, Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchMovieVideos, fetchTVShowVideos, getPosterUrl } from '../api/tmdb';
import { useAuth } from '../context/AuthContext';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  vote_average: number;
  year?: number;
  genre?: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  isTV?: boolean;
}

interface MovieCardProps {
  movie: Movie;
  onPress?: () => void;
  onWatchTrailer?: () => void;
  onWatchMovie?: () => void;
  onAddToWatchlist?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 80) / 2.5;

export default function MovieCard({ 
  movie, 
  onPress, 
  onWatchTrailer, 
  onWatchMovie, 
  onAddToWatchlist 
}: MovieCardProps) {
  const { isLoggedIn } = useAuth();
  const [isPressed, setIsPressed] = useState(false);
  const [showHover, setShowHover] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    setIsPressed(true);
    setShowHover(true);
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    setTimeout(() => setShowHover(false), 200);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onPress?.();
  };

  const handleWatchTrailer = async (e: any) => {
    e.stopPropagation();
    try {
      // Fetch trailer from TMDB
      const videosResponse = movie.isTV 
        ? await fetchTVShowVideos(movie.id)
        : await fetchMovieVideos(movie.id);
      
      const trailer = videosResponse.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      if (trailer) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        const canOpen = await Linking.canOpenURL(youtubeUrl);
        if (canOpen) {
          await Linking.openURL(youtubeUrl);
        } else {
          Alert.alert('Error', 'Cannot open YouTube');
        }
      } else {
        Alert.alert('No Trailer', 'No trailer available for this movie');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      Alert.alert('Error', 'Failed to load trailer');
    }
    
    onWatchTrailer?.();
  };

  const handleWatchMovie = (e: any) => {
    e.stopPropagation();
    if (isLoggedIn) {
      onWatchMovie?.();
    } else {
      Alert.alert(
        'Sign In Required',
        'Please sign in to watch movies',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Profile', onPress: () => {} },
        ]
      );
    }
  };

  const handleAddToWatchlist = (e: any) => {
    e.stopPropagation();
    onAddToWatchlist?.();
  };

  const movieTitle = movie.title || movie.name || 'Unknown Title';
  const releaseYear = movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 
                     movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : null);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.posterContainer}>
          {movie.poster_path ? (
            <Image
              source={{ uri: getPosterUrl(movie.poster_path) }}
              style={styles.posterImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.posterPlaceholder}>
              <Text style={styles.posterText}>{movieTitle.substring(0, 8)}...</Text>
            </View>
          )}
          
          {/* Enhanced Hover Overlay with Movie Info */}
          {showHover && (
            <View style={styles.hoverOverlay}>
              <View style={styles.hoverContent}>
                <Text style={styles.hoverTitle} numberOfLines={2}>{movieTitle}</Text>
                <View style={styles.hoverMeta}>
                  <Text style={styles.hoverRating}>⭐ {movie.vote_average.toFixed(1)}</Text>
                  {releaseYear && <Text style={styles.hoverYear}>{releaseYear}</Text>}
                </View>
                {movie.overview && (
                  <Text style={styles.hoverOverview} numberOfLines={3}>
                    {movie.overview}
                  </Text>
                )}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.trailerButton} 
                    onPress={handleWatchTrailer}
                  >
                    <Ionicons name="play-circle" size={20} color="#000000" />
                    <Text style={styles.trailerButtonText}>Trailer</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.watchButton} 
                    onPress={handleWatchMovie}
                  >
                    <Ionicons name="tv" size={20} color={isLoggedIn ? "#000000" : "#888888"} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={handleAddToWatchlist}
                  >
                    <Ionicons name="bookmark" size={20} color="#FFD700" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movieTitle}
          </Text>
          <View style={styles.movieMeta}>
            <Text style={styles.movieRating}>⭐ {movie.vote_average.toFixed(1)}</Text>
            {releaseYear && <Text style={styles.movieYear}>{releaseYear}</Text>}
          </View>
          {movie.genre && (
            <Text style={styles.movieGenre}>{movie.genre}</Text>
          )}
        </View>

        {/* Quick Action Trailer Button Always Visible */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickTrailerButton}
            onPress={handleWatchTrailer}
          >
            <Ionicons name="play" size={14} color="#000000" />
            <Text style={styles.quickTrailerText}>Trailer</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 25,
    marginRight: 15,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.2)',
    shadowColor: '#00d4aa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  posterContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
  },
  posterImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  posterText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
  },
  hoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  hoverContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  hoverTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  hoverMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  hoverRating: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  hoverYear: {
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '500',
  },
  hoverOverview: {
    color: '#CCCCCC',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  trailerButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  trailerButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  watchButton: {
    backgroundColor: '#00d4aa',
    padding: 10,
    borderRadius: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  movieInfo: {
    padding: 15,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  movieRating: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
  },
  movieYear: {
    color: '#AAAAAA',
    fontSize: 13,
    fontWeight: '500',
  },
  movieGenre: {
    color: '#00d4aa',
    fontSize: 12,
    fontWeight: '500',
  },
  quickActions: {
    padding: 15,
    paddingTop: 0,
  },
  quickTrailerButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 18,
    gap: 5,
  },
  quickTrailerText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});