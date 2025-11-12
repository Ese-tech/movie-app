import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { TrailerModal } from './TrailerModal';
import { Movie } from '../types';
import { trendingAPI } from '../src/api/tmdbApi';

const { width } = Dimensions.get('window');

interface UniversalHeroProps {
  showOnPages?: string[]; // Which pages to show the hero on
  currentPage: string; // Current page identifier
}

export const UniversalHero: React.FC<UniversalHeroProps> = ({ 
  showOnPages = ['movies', 'tv-series', 'genres'], 
  currentPage 
}) => {
  const router = useRouter();
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [trailerVisible, setTrailerVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showOnPages.includes(currentPage)) {
      loadHeroMovie();
    }
  }, [currentPage]);

  const loadHeroMovie = async () => {
    try {
      setLoading(true);
      const trendingData = await trendingAPI.movies('week', 1);
      const movies = trendingData.results || [];
      
      // Get a random trending movie for the hero
      const randomMovie = movies[Math.floor(Math.random() * Math.min(movies.length, 10))];
      setHeroMovie(randomMovie);
    } catch (error) {
      console.error('Error loading hero movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchTrailer = () => {
    setTrailerVisible(true);
  };

  const handleCloseTrailer = () => {
    setTrailerVisible(false);
  };

  const handleWatchMovie = () => {
    if (heroMovie) {
      router.push(`/modal?id=${heroMovie.id}`);
    }
  };

  if (!showOnPages.includes(currentPage) || !heroMovie || loading) {
    return null;
  }

  return (
    <View style={styles.heroSection}>
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
        style={styles.heroOverlay}
      />
      
      {heroMovie.backdrop_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w1280${heroMovie.backdrop_path}` }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>{heroMovie.title}</Text>
        <View style={styles.heroMeta}>
          <Text style={styles.heroRating}>{heroMovie.vote_average.toFixed(1)}/10</Text>
          <Text style={styles.heroYear}>
            {heroMovie.release_date ? new Date(heroMovie.release_date).getFullYear() : 'N/A'}
          </Text>
          <View style={styles.heroQuality}>
            <Text style={styles.heroQualityText}>HD</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>MOVIE</Text>
          </View>
        </View>
        <Text style={styles.heroDescription} numberOfLines={2}>
          {heroMovie.overview}
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity style={styles.heroButton} onPress={handleWatchMovie}>
            <Text style={styles.heroButtonText}>▶ Watch Movie</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroTrailerButton} onPress={handleWatchTrailer}>
            <Text style={styles.heroTrailerButtonText}>🎬 Watch Trailer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trailer Modal */}
      <TrailerModal
        visible={trailerVisible}
        onClose={handleCloseTrailer}
        movieId={heroMovie?.id || null}
        movieTitle={heroMovie?.title || ''}
        isHeroPlayer={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    height: 300,
    margin: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
    backgroundColor: '#1a1a2e',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  heroRating: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  heroYear: {
    color: '#ccc',
    fontSize: 14,
  },
  heroQuality: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  heroQualityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroBadge: {
    backgroundColor: '#00d4aa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  heroBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heroDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  heroButton: {
    backgroundColor: '#00d4aa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
  },
  heroButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  heroTrailerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
  },
  heroTrailerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UniversalHero;