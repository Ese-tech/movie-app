import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, Text } from 'react-native';
import { useMovieContext } from '../context/MovieContext';
import Navigation from '../components/navigation';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';
import MovieGridSection from '../components/MovieGridSection';
import YouTube from 'react-youtube';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getAnimeMovies } from '../utils/api';
import { Movie } from '../types';
import { useRouter } from 'expo-router';

const Home = () => {
  const { trailerUrl, setTrailerUrl } = useMovieContext();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [animeMovies, setAnimeMovies] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadMovieData();
  }, []);

  const loadMovieData = async () => {
    try {
      const [popular, topRated, upcoming, anime] = await Promise.all([
        getPopularMovies(),
        getTopRatedMovies(), 
        getUpcomingMovies(),
        getAnimeMovies()
      ]);

      setPopularMovies(popular);
      setTopRatedMovies(topRated);
      setUpcomingMovies(upcoming);
      setAnimeMovies(anime);
    } catch (error) {
      console.error('Error loading movie data:', error);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    router.push(`/movie/${movie.id}` as any);
  };

  return (
    <View style={styles.container}>
      {/* Navigation */}
      <Navigation />
      
      <View style={styles.mainContainer}>
        {/* Sidebar */}
        <Sidebar />
        
        <View style={styles.contentArea}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
        {/* Hero Section */}
        <HeroSection onWatchMovie={handleMoviePress} />

        {/* Movie Sections */}
        <MovieGridSection
          title="Movies"
          movies={popularMovies}
          onMoviePress={handleMoviePress}
          onViewMore={() => router.push('/movies')}
        />

        <MovieGridSection
          title="TV Series"
          movies={topRatedMovies}
          onMoviePress={handleMoviePress}
          onViewMore={() => router.push('/tv-series')}
        />

        <MovieGridSection
          title="Latest"
          movies={upcomingMovies}
          onMoviePress={handleMoviePress}
          showViewMore={false}
        />

        <MovieGridSection
          title="Anime"
          movies={animeMovies}
          onMoviePress={handleMoviePress}
          showViewMore={false}
        />

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </View>

      {/* Trailer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={trailerUrl !== null}
        onRequestClose={() => setTrailerUrl(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setTrailerUrl(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            {trailerUrl && <YouTube videoId={trailerUrl} />}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 70, // Account for navigation header
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    backgroundColor: '#1A213E',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    maxWidth: 800,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;