import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getFeaturedMovies } from '../utils/api';
import { Movie } from '../types';

const { width } = Dimensions.get('window');

interface HeroSectionProps {
  onWatchMovie?: (movie: Movie) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onWatchMovie }) => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    loadFeaturedMovie();
  }, []);

  const loadFeaturedMovie = async () => {
    try {
      const movies = await getFeaturedMovies();
      if (movies && movies.length > 0) {
        setFeaturedMovie(movies[0]); // Take the first featured movie
      }
    } catch (error) {
      console.error('Error loading featured movie:', error);
    }
  };

  if (!featuredMovie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path || featuredMovie.poster_path}`;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: backdropUrl }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(10, 15, 40, 0.7)', 'rgba(10, 15, 40, 0.9)']}
          style={styles.gradient}
        />
        
        <View style={styles.content}>
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{featuredMovie.title}</Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>
                {featuredMovie.vote_average.toFixed(1)}/10
              </Text>
              <Text style={styles.year}>
                {new Date(featuredMovie.release_date).getFullYear()}
              </Text>
              <View style={styles.hdBadge}>
                <Text style={styles.hdText}>HD</Text>
              </View>
            </View>

            <Text style={styles.overview} numberOfLines={3}>
              {featuredMovie.overview}
            </Text>

            <TouchableOpacity 
              style={styles.watchButton}
              onPress={() => onWatchMovie && onWatchMovie(featuredMovie)}
            >
              <Text style={styles.watchButtonText}>▶ Watch Movie</Text>
            </TouchableOpacity>
          </View>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {[0, 1, 2, 3, 4].map((index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === 1 ? styles.activeDot : styles.inactiveDot
                ]}
              />
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500,
    position: 'relative',
  },
  loadingContainer: {
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0f28',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    zIndex: 1,
  },
  movieInfo: {
    maxWidth: '50%',
  },
  movieTitle: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    color: '#f59e0b',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },
  year: {
    color: '#d1d5db',
    fontSize: 14,
    marginRight: 15,
  },
  hdBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hdText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overview: {
    color: '#d1d5db',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  watchButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  watchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#06b6d4',
    width: 40,
    borderRadius: 6,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default HeroSection;