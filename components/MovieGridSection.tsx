import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieGridSectionProps {
  title: string;
  movies: Movie[];
  showViewMore?: boolean;
  onViewMore?: () => void;
  onMoviePress?: (movie: Movie) => void;
}

const MovieGridSection: React.FC<MovieGridSectionProps> = ({
  title,
  movies,
  showViewMore = true,
  onViewMore,
  onMoviePress
}) => {
  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard 
      item={item} 
      type="movie" 
      onPress={() => onMoviePress && onMoviePress(item)}
    />
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showViewMore && (
          <TouchableOpacity style={styles.viewMoreButton} onPress={onViewMore}>
            <Text style={styles.viewMoreText}>VIEW MORE</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={movies.slice(0, 5)} // Show first 5 movies
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moviesContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewMoreButton: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  viewMoreText: {
    color: '#06b6d4',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  moviesContainer: {
    paddingHorizontal: 32,
  },
  separator: {
    width: 16,
  },
});

export default MovieGridSection;