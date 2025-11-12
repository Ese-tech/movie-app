import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface MovieCardProps {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  isTV?: boolean;
  onPress?: () => void;
  onWatchTrailer?: () => void;
  onWatchMovie?: () => void;
  onAddToWatchlist?: () => void;
}

export function MovieCard({ 
  id,
  title,
  name,
  poster_path,
  vote_average,
  release_date,
  first_air_date,
  overview,
  isTV = false,
  onPress, 
  onWatchTrailer, 
  onWatchMovie, 
  onAddToWatchlist 
}: MovieCardProps) {
  const { isLoggedIn } = useAuth();

  const handlePress = () => {
    onPress?.();
  };

  const handleWatchTrailer = (e: any) => {
    e.stopPropagation();
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

  const movieTitle = title || name || 'Unknown Title';
  const releaseYear = release_date ? new Date(release_date).getFullYear() : 
                     first_air_date ? new Date(first_air_date).getFullYear() : null;

  return (
    <TouchableOpacity 
      style={styles.movieCard} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.movieContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: poster_path 
                ? `https://image.tmdb.org/t/p/w500${poster_path}` 
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
            <Text style={styles.badgeText}>{isTV ? 'TV' : 'MOVIE'}</Text>
          </View>
        </View>
        
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={1}>
            {movieTitle}
          </Text>
          
          <View style={styles.movieMeta}>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{vote_average?.toFixed(1) || 'N/A'}</Text>
            </View>
            <Text style={styles.year}>
              {releaseYear || 'N/A'}
            </Text>
            <View style={styles.qualityBadge}>
              <Text style={styles.qualityText}>HD</Text>
            </View>
          </View>
          
          <Text style={styles.overview} numberOfLines={2}>
            {overview || 'No description available.'}
          </Text>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.trailerButton]}
              onPress={handleWatchTrailer}
            >
              <Text style={styles.trailerButtonText}>▶ Trailer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.watchButton]}
              onPress={handleWatchMovie}
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
}

const styles = StyleSheet.create({
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
});