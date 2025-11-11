import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchGenres, fetchTVGenres, Genre } from '../../api/tmdb';
import { Sidebar } from '../../components/Sidebar';

const genreIcons: { [key: string]: string } = {
  'Action': '⚔️',
  'Adventure': '🗺️',
  'Animation': '🎬',
  'Comedy': '😂',
  'Crime': '🔫',
  'Documentary': '📺',
  'Drama': '🎭',
  'Family': '👨‍👩‍👧‍👦',
  'Fantasy': '🧙‍♂️',
  'History': '🏛️',
  'Horror': '👻',
  'Music': '🎵',
  'Mystery': '🔍',
  'Romance': '💕',
  'Science Fiction': '🚀',
  'TV Movie': '📺',
  'Thriller': '😱',
  'War': '⚔️',
  'Western': '🤠',
  'Action & Adventure': '�️',
  'Sci-Fi & Fantasy': '🌟',
  'Reality': '📹',
  'Talk': '🎙️',
  'News': '�',
  'Soap': '💭',
  'Kids': '🧸',
};

export default function GenresScreen() {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedType, setSelectedType] = useState<'movie' | 'tv'>('movie');

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      const [movieGenresData, tvGenresData] = await Promise.all([
        fetchGenres(),
        fetchTVGenres()
      ]);
      setMovieGenres(movieGenresData.genres);
      setTVGenres(tvGenresData.genres);
    } catch (error) {
      console.error('Error loading genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentGenres = selectedType === 'movie' ? movieGenres : tvGenres;
  const popularGenres = currentGenres.slice(0, 5);

  const renderGenreCard = ({ item }: { item: Genre }) => (
    <TouchableOpacity 
      style={[
        styles.genreCard,
        selectedGenre?.id === item.id && styles.selectedGenreCard
      ]}
      onPress={() => setSelectedGenre(selectedGenre?.id === item.id ? null : item)}
    >
      <View style={styles.genreIconContainer}>
        <Text style={styles.genreIcon}>{genreIcons[item.name] || '🎬'}</Text>
      </View>
      <View style={styles.genreInfo}>
        <Text style={styles.genreName}>{item.name}</Text>
        <Text style={styles.genreType}>{selectedType === 'movie' ? 'Movies' : 'TV Series'}</Text>
      </View>
      <Ionicons 
        name={selectedGenre?.id === item.id ? "chevron-up" : "chevron-forward"} 
        size={20} 
        color="#8C8C8C" 
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#0a0a0a', '#1a2332']} style={StyleSheet.absoluteFillObject} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4aa" />
          <Text style={styles.loadingText}>Loading genres...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0a0a0a', '#1a2332']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.mainLayout}>
        {/* Main Content */}
        <ScrollView style={styles.content}>
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>Browse by Genres</Text>
            <Text style={styles.pageSubtitle}>Discover movies and TV shows by genre</Text>
          </View>

          {/* Type Selection */}
          <View style={styles.typeSelection}>
            <TouchableOpacity
              style={[styles.typeButton, selectedType === 'movie' && styles.activeTypeButton]}
              onPress={() => setSelectedType('movie')}
            >
              <Text style={[styles.typeButtonText, selectedType === 'movie' && styles.activeTypeButtonText]}>
                Movies
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, selectedType === 'tv' && styles.activeTypeButton]}
              onPress={() => setSelectedType('tv')}
            >
              <Text style={[styles.typeButtonText, selectedType === 'tv' && styles.activeTypeButtonText]}>
                TV Series
              </Text>
            </TouchableOpacity>
          </View>

          {/* Popular Genres */}
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>Popular Genres</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.popularGenresContainer}>
                {popularGenres.map((genre) => (
                  <TouchableOpacity 
                    key={genre.id} 
                    style={styles.popularGenreCard}
                    onPress={() => setSelectedGenre(genre)}
                  >
                    <LinearGradient
                      colors={['#00d4aa', '#FFD700']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.popularGenreGradient}
                    >
                      <Text style={styles.popularGenreIcon}>{genreIcons[genre.name] || '🎬'}</Text>
                      <Text style={styles.popularGenreName}>{genre.name}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* All Genres */}
          <View style={styles.allGenresSection}>
            <Text style={styles.sectionTitle}>All Genres ({currentGenres.length})</Text>
            <FlatList
              data={currentGenres}
              renderItem={renderGenreCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.genresList}
              scrollEnabled={false}
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sidebar */}
        <Sidebar isVisible={!loading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 212, 170, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  pageSubtitle: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 22,
  },
  typeSelection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
    marginHorizontal: 5,
    borderRadius: 25,
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#00d4aa',
    borderColor: '#00d4aa',
  },
  typeButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: '#000000',
    fontWeight: '600',
  },
  popularSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 212, 170, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  popularGenresContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  popularGenreCard: {
    width: 120,
    height: 100,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#00d4aa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  popularGenreGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  popularGenreIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  popularGenreName: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  allGenresSection: {
    paddingHorizontal: 20,
  },
  genresList: {
    paddingBottom: 20,
  },
  genreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    marginBottom: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.2)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  selectedGenreCard: {
    borderColor: '#00d4aa',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    shadowColor: '#00d4aa',
    shadowOpacity: 0.4,
  },
  genreIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
  },
  genreIcon: {
    fontSize: 20,
  },
  genreInfo: {
    flex: 1,
  },
  genreName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  genreType: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
});