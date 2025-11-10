import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useMovieContext } from '../../context/MovieContext';
import { useRouter } from 'expo-router';

const MovieList = () => {
  const { movies, tvSeries, title, fetchTopRatedMovies } = useMovieContext();
  const router = useRouter();

  useEffect(() => {
    fetchTopRatedMovies();
  }, []);

  const renderMovie = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/movie/${item.id}`)} style={styles.movieContainer}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <Text style={styles.movieTitle}>{item.title || item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={movies.length > 0 ? movies : tvSeries}
          renderItem={renderMovie}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
        />
      </View>
      <TouchableOpacity style={styles.viewMoreButton}>
        <Text style={styles.viewMoreButtonText}>View More</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  movieContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    alignItems: 'center',
  },
  poster: {
    width: 180,
    height: 250,
    borderRadius: 10,
  },
  movieTitle: {
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  viewMoreButton: {
    backgroundColor: '#00bfff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  viewMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MovieList;