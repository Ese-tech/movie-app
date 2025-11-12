import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Conditional WebView import
let WebView: any = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('WebView not available on this platform');
  }
}

interface TrailerModalProps {
  visible: boolean;
  onClose: () => void;
  movieId: number | null;
  movieTitle: string;
  isHeroPlayer?: boolean; // New prop for hero section players
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  visible,
  movieId,
  movieTitle,
  onClose,
  isHeroPlayer = false,
}) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (visible && movieId) {
      loadTrailer();
    }
  }, [visible, movieId]);

  const loadTrailer = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_KEY = '530bdf979dd5e101be641fb42df8a872';
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      const data = await response.json();
      
      const trailer = data.results?.find(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        setError('Trailer not available for this movie');
      }
    } catch (err) {
      console.error('Error loading trailer:', err);
      setError('Failed to load trailer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTrailerKey(null);
    setError(null);
    onClose();
  };

  const handleError = () => {
    Alert.alert('Error', 'Failed to load trailer');
    handleClose();
  };

  if (!visible) return null;

  const trailerUrl = trailerKey 
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&showinfo=0&rel=0`
    : null;

  return (
    <Modal
      visible={visible}
      animationType={isHeroPlayer ? "fade" : "slide"}
      presentationStyle={isHeroPlayer ? "overFullScreen" : "fullScreen"}
      transparent={isHeroPlayer}
      onRequestClose={handleClose}
    >
      <View style={isHeroPlayer ? styles.heroContainer : styles.container}>
        {isHeroPlayer && <TouchableOpacity style={styles.heroOverlay} onPress={handleClose} />}
        
        <View style={isHeroPlayer ? styles.heroPlayer : styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {movieTitle} - Trailer
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={isHeroPlayer ? styles.heroContent : styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00d4aa" />
              <Text style={styles.loadingText}>Loading trailer...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="videocam-off" size={64} color="#666" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadTrailer}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {trailerUrl && !loading && !error && (
            <>
              {Platform.OS === 'web' || !WebView ? (
                // Web fallback - open in new tab
                <View style={styles.webFallbackContainer}>
                  <Ionicons name="videocam" size={64} color="#00d4aa" />
                  <Text style={styles.webFallbackText}>
                    Trailer available on YouTube
                  </Text>
                  <TouchableOpacity 
                    style={styles.openYouTubeButton}
                    onPress={() => {
                      const youtubeUrl = `https://www.youtube.com/watch?v=${trailerKey}`;
                      Linking.openURL(youtubeUrl);
                    }}
                  >
                    <Ionicons name="open-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.openYouTubeText}>Open in YouTube</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Native WebView
                <WebView
                  source={{ uri: trailerUrl }}
                  style={styles.webview}
                  allowsFullscreenVideo={true}
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  onError={handleError}
                  onHttpError={handleError}
                  startInLoadingState={true}
                />
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  heroContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  heroPlayer: {
    backgroundColor: '#141414',
    borderRadius: 12,
    overflow: 'hidden',
    width: '90%',
    maxWidth: 800,
    maxHeight: '80%',
  },
  heroContent: {
    height: 300,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#141414',
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00d4aa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webFallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  webFallbackText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  openYouTubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  openYouTubeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrailerModal;