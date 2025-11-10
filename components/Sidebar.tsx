import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Movie } from '../types';
import { getPopularMovies, getUpcomingMovies } from '../utils/api';

interface SidebarProps {
  onMovieSelect?: (movie: Movie) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMovieSelect }) => {
  const [mostViewed, setMostViewed] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);

  useEffect(() => {
    loadSidebarData();
  }, []);

  const loadSidebarData = async () => {
    try {
      const [popularData, upcomingData] = await Promise.all([
        getPopularMovies(),
        getUpcomingMovies()
      ]);
      
      setMostViewed(popularData.slice(0, 5)); // Top 5 most viewed
      setUpcoming(upcomingData.slice(0, 5)); // Top 5 upcoming
    } catch (error) {
      console.error('Error loading sidebar data:', error);
    }
  };

  const renderMovieItem = (movie: Movie, index: number, isUpcoming: boolean = false) => (
    <TouchableOpacity
      key={movie.id}
      style={styles.movieItem}
      onPress={() => onMovieSelect && onMovieSelect(movie)}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rankNumber}>#{index + 1}</Text>
      </View>
      
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
      
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            {movie.vote_average.toFixed(1)}/10
          </Text>
          <Text style={styles.year}>
            {new Date(movie.release_date).getFullYear()}
          </Text>
          <View style={styles.hdBadge}>
            <Text style={styles.hdText}>HD</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Most Viewed Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MOST VIEWED</Text>
          {mostViewed.map((movie, index) => renderMovieItem(movie, index))}
        </View>

        {/* Recommended Section */}
        <View style={styles.section}>
          <View style={styles.recommendedHeader}>
            <Text style={styles.sectionTitle}>RECOMMENDED</Text>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={styles.activeTabText}>Most Favorite</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Upcoming Movies</Text>
            </TouchableOpacity>
          </View>

          {upcoming.map((movie, index) => renderMovieItem(movie, index, true))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 380,
    backgroundColor: '#1a1d29',
    borderRightWidth: 1,
    borderRightColor: '#2a2d3a',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  recommendedHeader: {
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#f59e0b',
  },
  activeTabText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabText: {
    color: '#64748b',
    fontSize: 14,
  },
  movieItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 5,
  },
  rankNumber: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: 'bold',
  },
  moviePoster: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginLeft: 10,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 12,
    paddingTop: 2,
  },
  movieTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rating: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  year: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 6,
  },
  hdBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  hdText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Sidebar;