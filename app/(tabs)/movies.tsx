import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies, getPosterUrl, Movie } from '../../api/tmdb';

const categories = ['Featured', 'Popular', 'Top Rated', 'Upcoming'];

export default function MoviesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, [selectedCategory]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      let movieData;
      
      switch (selectedCategory) {
        case 'Popular':
          movieData = await fetchPopularMovies();
          break;
        case 'Top Rated':
          movieData = await fetchTopRatedMovies();
          break;
        case 'Upcoming':
          movieData = await fetchUpcomingMovies();
          break;
        case 'Featured':
          movieData = await fetchTrendingMovies();
          break;
        default:
          movieData = await fetchPopularMovies();
      }
      
      setMovies(movieData.results.slice(0, 20));
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mostViewedMovies = movies.slice(0, 5);
  const recommendedMovies = movies.slice(5, 10);

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.logo}>Cineverse</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Navigation */}
          <View style={styles.categoryNavigation}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.activeCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.activeCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00d4aa" />
              <Text style={styles.loadingText}>Loading movies...</Text>
            </View>
          ) : (
            <View style={styles.mainLayout}>
              {/* Main Movies Grid */}
              <View style={styles.moviesGrid}>
                <Text style={styles.sectionTitle}>Movies</Text>
                <View style={styles.categoriesSubHeader}>
                  <TouchableOpacity style={styles.categoryTab}>
                    <Text style={styles.categoryTabText}>Latest</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.categoryTab, styles.activeCategoryTab]}>
                    <Text style={[styles.categoryTabText, styles.activeCategoryTabText]}>Popular</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.categoryTab}>
                    <Text style={styles.categoryTabText}>Upcoming</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.moviesList}>
                  {filteredMovies.slice(0, 10).map((movie) => (
                    <TouchableOpacity key={movie.id} style={styles.movieItem}>
                      <Image 
                        source={{ uri: getPosterUrl(movie.poster_path) }}
                        style={styles.moviePoster}
                        resizeMode="cover"
                      />
                      <View style={styles.movieInfo}>
                        <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>
                        <Text style={styles.movieRating}>
                          {movie.vote_average.toFixed(1)}/10 {new Date(movie.release_date).getFullYear()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* View More Button */}
                <TouchableOpacity style={styles.viewMoreButton}>
                  <Text style={styles.viewMoreText}>View more</Text>
                </TouchableOpacity>
              </View>

              {/* Sidebar with Most Viewed and Recommended */}
              <View style={styles.sidebar}>
                <Text style={styles.sidebarMainTitle}>MOST VIEWED</Text>
                
                <View style={styles.sidebarSection}>
                  {mostViewedMovies.map((movie, index) => (
                    <TouchableOpacity key={movie.id} style={styles.sidebarItem}>
                      <Text style={styles.rankNumber}>#{index + 1}</Text>
                      <Image 
                        source={{ uri: getPosterUrl(movie.poster_path) }}
                        style={styles.sidebarPoster}
                        resizeMode="cover"
                      />
                      <View style={styles.sidebarMovieInfo}>
                        <Text style={styles.sidebarMovieTitle} numberOfLines={2}>{movie.title}</Text>
                        <Text style={styles.sidebarMovieRating}>
                          {movie.vote_average.toFixed(1)}/10 {new Date(movie.release_date).getFullYear()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sidebarMainTitle}>RECOMMENDED</Text>
                
                <View style={styles.sidebarTabs}>
                  <TouchableOpacity style={[styles.sidebarTab, styles.activeSidebarTab]}>
                    <Text style={[styles.sidebarTabText, styles.activeSidebarTabText]}>Most Favorite</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sidebarTab}>
                    <Text style={styles.sidebarTabText}>Upcoming Movies</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.sidebarSection}>
                  {recommendedMovies.map((movie) => (
                    <TouchableOpacity key={movie.id} style={styles.sidebarItem}>
                      <Image 
                        source={{ uri: getPosterUrl(movie.poster_path) }}
                        style={styles.sidebarPoster}
                        resizeMode="cover"
                      />
                      <View style={styles.sidebarMovieInfo}>
                        <Text style={styles.sidebarMovieTitle} numberOfLines={2}>{movie.title}</Text>
                        <Text style={styles.sidebarMovieRating}>
                          {movie.vote_average.toFixed(1)}/10 {new Date(movie.release_date).getFullYear()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4aa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    flex: 1,
    marginLeft: 20,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  categoryNavigation: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 15,
    borderRadius: 6,
  },
  activeCategoryButton: {
    backgroundColor: '#00d4aa',
  },
  categoryText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  mainLayout: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
  },
  moviesGrid: {
    flex: 2,
    marginRight: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  categoriesSubHeader: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginRight: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeCategoryTab: {
    borderBottomColor: '#f9d71c',
  },
  categoryTabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  activeCategoryTabText: {
    color: '#f9d71c',
    fontWeight: '600',
  },
  moviesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieItem: {
    width: '18%',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  moviePoster: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  movieInfo: {
    padding: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  movieRating: {
    color: '#f9d71c',
    fontSize: 10,
    fontWeight: '500',
  },
  viewMoreButton: {
    backgroundColor: '#3b4f6b',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 20,
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sidebar: {
    flex: 1,
    paddingLeft: 0,
  },
  sidebarMainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 15,
    letterSpacing: 1,
  },
  sidebarSection: {
    marginBottom: 30,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    padding: 0,
  },
  rankNumber: {
    color: '#00d4aa',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 25,
    marginTop: 5,
  },
  sidebarPoster: {
    width: 45,
    height: 65,
    borderRadius: 4,
    marginRight: 10,
  },
  sidebarMovieInfo: {
    flex: 1,
    paddingTop: 2,
  },
  sidebarMovieTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 16,
  },
  sidebarMovieRating: {
    color: '#f9d71c',
    fontSize: 11,
    fontWeight: '500',
  },
  sidebarTabs: {
    flexDirection: 'column',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  sidebarTab: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  activeSidebarTab: {
    backgroundColor: 'transparent',
  },
  sidebarTabText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  activeSidebarTabText: {
    color: '#f9d71c',
    fontWeight: '600',
  },
});