import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, ImageBackground, Animated } from 'react-native';
import { useMovieContext } from '../../context/MovieContext';
import { useRouter } from 'expo-router';
import { getTopRatedMovies } from '../../utils/api';

const Home = () => {
  const { movies, fetchPopularMovies, fetchUpcomingMovies } = useMovieContext();
  const [topRated, setTopRated] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchPopularMovies();
    fetchUpcomingMovies();
    const fetchTopRated = async () => {
      const topRatedMovies = await getTopRatedMovies();
      setTopRated(topRatedMovies.slice(0, 5));
    };
    fetchTopRated();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        fadeOut(() => {
          setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % 5);
          fadeIn();
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies]);

  const fadeOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(callback);
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const renderMovie = ({ item }) => (
    <View
      style={styles.movieContainer}
      onMouseEnter={() => setHoveredMovieId(item.id)}
      onMouseLeave={() => setHoveredMovieId(null)}
    >
      <TouchableOpacity onPress={() => router.push(`/movie/${item.id}`)}>
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
        {hoveredMovieId === item.id && (
          <View style={styles.overlay}>
            <TouchableOpacity onPress={() => router.push(`/movie/${item.id}`)} style={styles.playButton}>
              <Text style={styles.playButtonText}>▶</Text>
            </TouchableOpacity>
            <Text style={styles.overlayTitle}>{item.title}</Text>
            <Text style={styles.overlayInfo}>{(item.vote_average || 0).toFixed(1)}/10</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.movieTitle}>{item.title}</Text>
    </View>
  );

  const renderTopRatedMovie = ({ item, index }) => (
    <TouchableOpacity onPress={() => router.push(`/movie/${item.id}`)} style={styles.topRatedContainer}>
      <Text style={styles.topRatedNumber}>#{index + 1}</Text>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={styles.topRatedPoster} />
      <View style={styles.topRatedDetails}>
        <Text style={styles.topRatedTitle}>{item.title}</Text>
        <Text style={styles.topRatedExtra}>{(item.vote_average || 0).toFixed(1)}/10 {item.release_date?.split('-')[0]}</Text>
      </View>
    </TouchableOpacity>
  );

  const currentMovie = movies[currentMovieIndex];

  return (
    <ScrollView style={styles.container}>
      {currentMovie && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <ImageBackground
            source={{ uri: `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}` }}
            style={styles.heroContainer}
          >
            <View style={styles.heroOverlay} />
            <Text style={styles.heroTitle}>{currentMovie.title}</Text>
            <Text style={styles.heroDescription}>{currentMovie.overview}</Text>
            <TouchableOpacity style={styles.watchButton} onPress={() => router.push(`/movie/${currentMovie.id}`)}>
              <Text style={styles.watchButtonText}>Watch Movie</Text>
            </TouchableOpacity>
          </ImageBackground>
        </Animated.View>
      )}

      <View style={styles.mainContent}>
        <View style={styles.leftColumn}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Movies</Text>
            <FlatList
              data={movies.slice(0, 10)}
              renderItem={renderMovie}
              keyExtractor={(item) => item.id.toString()}
              numColumns={5}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          </View>
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.sideSection}>
            <Text style={styles.sideSectionTitle}>Most Viewed</Text>
            <FlatList
              data={topRated}
              renderItem={renderTopRatedMovie}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F28' },
  heroContainer: { height: 500, justifyContent: 'center', paddingHorizontal: 40 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  heroTitle: { color: '#fff', fontSize: 48, fontWeight: 'bold', marginBottom: 10 },
  heroDescription: { color: '#fff', fontSize: 16, width: '60%', marginBottom: 20 },
  watchButton: { backgroundColor: '#00bfff', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, width: 150, alignItems: 'center' },
  watchButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  mainContent: { flexDirection: 'row', padding: 20 },
  leftColumn: { flex: 3, marginRight: 20 },
  rightColumn: { flex: 1 },
  section: { marginBottom: 30 },
  sectionTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  movieContainer: { flex: 1, maxWidth: '18%', marginBottom: 20, position: 'relative' },
  poster: { width: '100%', height: 250, borderRadius: 10 },
  movieTitle: { color: '#fff', marginTop: 8, textAlign: 'center', fontSize: 14 },
  sideSection: { marginBottom: 30 },
  sideSectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#1A213E', paddingBottom: 10 },
  topRatedContainer: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  topRatedNumber: { color: '#00bfff', fontSize: 24, fontWeight: 'bold', marginRight: 10 },
  topRatedPoster: { width: 60, height: 90, borderRadius: 5 },
  topRatedDetails: { marginLeft: 10, flex: 1 },
  topRatedTitle: { color: '#fff', fontSize: 16 },
  topRatedExtra: { color: '#888', fontSize: 12, marginTop: 4 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 30,
    color: '#000',
  },
  overlayTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  overlayInfo: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
});

export default Home;