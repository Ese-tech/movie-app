import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useMovieContext } from '../context/MovieContext';
import Navigation from '../components/navigation';
import MovieCard from '../components/MovieCard';
import { useRouter } from 'expo-router';
import { Movie, TVSeries } from '../types';

const MoviesPage = () => {
  const { movies, tvSeries, title } = useMovieContext();
  const router = useRouter();

  const handleMoviePress = (item: Movie | TVSeries) => {
    router.push(`/movie/${item.id}` as any);
  };

  const data = movies.length > 0 ? movies : tvSeries;
  const itemType = movies.length > 0 ? 'movie' : 'tv';

  return (
    <View style={styles.container}>
      <Navigation />
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>{title}</Text>
        
        {data.length > 0 ? (
          <FlatList
            data={data as (Movie | TVSeries)[]}
            renderItem={({ item }) => (
              <MovieCard
                item={item}
                type={itemType}
                onPress={() => handleMoviePress(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            style={styles.movieGrid}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No content available</Text>
            <Text style={styles.emptySubtext}>Try searching for something else</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F28',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  movieGrid: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 16,
  },
});

export default MoviesPage;