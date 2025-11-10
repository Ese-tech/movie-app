import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Movie } from '../types';

const MovieDetails = () => {
  const { movie } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  const movieId = Array.isArray(movie) ? movie[0] : movie;

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (movieId) {
      fetchMovieDetails(movieId);
    } else {
      setLoading(false);
    }
  }, [user, movieId]);

  const fetchMovieDetails = async (id: string) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=YOUR_API_KEY`);
      const data = await response.json();
      setMovieDetails(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Movie not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#0A0F28', '#1A213E', '#2C3A5B']}
        style={styles.gradient}
      />
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }} style={styles.poster} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movieDetails.title}</Text>
        <Text style={styles.overview}>{movieDetails.overview}</Text>
        <Text style={styles.releaseDate}>Release Date: {movieDetails.release_date}</Text>
        <Text style={styles.rating}>Rating: {movieDetails.vote_average}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0F28',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  poster: {
    width: '100%',
    height: 500,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  overview: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  releaseDate: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  rating: {
    color: '#ccc',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default MovieDetails;