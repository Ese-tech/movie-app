import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Mock data structure for movies
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
}

const Home = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.themoviedb.org/3/movie/popular?api_key=530bdf979dd5e101be641fb42df8a872&language=en-US&page=1'
      );
      const data = await response.json();
      setPopularMovies(data.results.slice(0, 10));
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const MovieCard = ({ movie }: { movie: Movie }) => (
    <TouchableOpacity style={styles.movieCard}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w300${movie.poster_path}` }}
        style={styles.moviePoster}
      />
      <Text style={styles.movieTitle} numberOfLines={2}>
        {movie.title}
      </Text>
    </TouchableOpacity>
  );

  const HeroSection = () => {
    const featuredMovie = popularMovies[0];
    
    if (!featuredMovie) return null;

    return (
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${featuredMovie.backdrop_path}` }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={['rgba(10, 15, 40, 0.3)', 'rgba(10, 15, 40, 0.8)', '#0A0F28']}
          style={styles.heroGradient}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{featuredMovie.title}</Text>
          <Text style={styles.heroOverview} numberOfLines={3}>
            {featuredMovie.overview}
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playButtonText}>▶ Abspielen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.myListButton}>
              <Text style={styles.myListButtonText}>+ Meine Liste</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Netflix Clone lädt...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Netflix Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>NETFLIX</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.profileText}>Anmelden</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <HeroSection />

        {/* Popular Movies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beliebte Filme</Text>
          <FlatList
            horizontal
            data={popularMovies}
            renderItem={({ item }) => <MovieCard movie={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moviesList}
          />
        </View>

        {/* Footer spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  logo: {
    color: '#e50914',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  profileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heroOverview: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.9,
  },
  heroButtons: {
    flexDirection: 'row',
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 5,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  myListButton: {
    backgroundColor: 'rgba(109, 109, 110, 0.7)',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 5,
  },
  myListButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    paddingTop: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  moviesList: {
    paddingLeft: 20,
  },
  movieCard: {
    marginRight: 10,
    width: 120,
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 5,
    marginBottom: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    height: 50,
  },
});

export default Home;