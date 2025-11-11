import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Mock movie data - replace with real data from TMDB
const mockMovie = {
  id: 1,
  title: "Spider-Man: No Way Home",
  overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes world of a super-hero. When he asks for help from Doctor Strange, the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
  vote_average: 8.4,
  release_date: "2021-12-17",
  runtime: 148,
  genres: ["Action", "Adventure", "Science Fiction"],
  cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon"],
  director: "Jon Watts",
  trailerUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA"
};

const relatedMovies = [
  { id: 2, title: "Spider-Man: Homecoming", vote_average: 7.4 },
  { id: 3, title: "Spider-Man: Far From Home", vote_average: 7.5 },
  { id: 4, title: "Venom: Let There Be Carnage", vote_average: 6.0 },
  { id: 5, title: "The Amazing Spider-Man", vote_average: 6.9 },
];

export default function MovieDetailsModal() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [showTrailer, setShowTrailer] = useState(false);

  const handleWatchMovie = () => {
    if (isLoggedIn) {
      Alert.alert('Watch Movie', `Now streaming ${mockMovie.title}!`);
    } else {
      Alert.alert(
        'Sign In Required',
        'Please sign in to watch movies',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/profile') },
        ]
      );
    }
  };

  const handleWatchTrailer = () => {
    setShowTrailer(true);
    Alert.alert('Trailer', `Playing trailer for ${mockMovie.title}`);
  };

  const handleAddToWatchlist = () => {
    Alert.alert('Added to Watchlist', `${mockMovie.title} has been added to your watchlist`);
  };

  const handleRelatedMoviePress = (movie: any) => {
    Alert.alert('Movie Details', `Opening ${movie.title}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#141414', '#000000']} style={StyleSheet.absoluteFillObject} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movie Details</Text>
        <TouchableOpacity onPress={handleAddToWatchlist}>
          <Ionicons name="bookmark-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.posterPlaceholder}>
            <Text style={styles.posterText}>{mockMovie.title.substring(0, 10)}...</Text>
          </View>
          
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{mockMovie.title}</Text>
            
            <View style={styles.movieMeta}>
              <Text style={styles.year}>{new Date(mockMovie.release_date).getFullYear()}</Text>
              <Text style={styles.runtime}>{mockMovie.runtime} min</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{mockMovie.vote_average}</Text>
              </View>
            </View>

            <View style={styles.genres}>
              {mockMovie.genres.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.watchButton} onPress={handleWatchMovie}>
                <Ionicons name="play" size={20} color="#000000" />
                <Text style={styles.watchButtonText}>
                  {isLoggedIn ? 'Watch Movie' : 'Sign In to Watch'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.trailerButton} onPress={handleWatchTrailer}>
                <Ionicons name="play-outline" size={20} color="#FFFFFF" />
                <Text style={styles.trailerButtonText}>Watch Trailer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Synopsis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.synopsis}>{mockMovie.overview}</Text>
        </View>

        {/* Cast & Crew */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cast & Crew</Text>
          <Text style={styles.director}>Directed by {mockMovie.director}</Text>
          <View style={styles.castContainer}>
            {mockMovie.cast.map((actor, index) => (
              <View key={index} style={styles.castMember}>
                <View style={styles.actorPlaceholder}>
                  <Text style={styles.actorInitials}>{actor.charAt(0)}</Text>
                </View>
                <Text style={styles.actorName}>{actor}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Related Movies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Movies</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.relatedMovies}>
              {relatedMovies.map((movie) => (
                <TouchableOpacity 
                  key={movie.id} 
                  style={styles.relatedMovie}
                  onPress={() => handleRelatedMoviePress(movie)}
                >
                  <View style={styles.relatedPoster}>
                    <Text style={styles.relatedPosterText}>{movie.title.substring(0, 8)}...</Text>
                  </View>
                  <Text style={styles.relatedTitle} numberOfLines={2}>
                    {movie.title}
                  </Text>
                  <Text style={styles.relatedRating}>⭐ {movie.vote_average}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    alignItems: 'center',
  },
  posterPlaceholder: {
    width: 200,
    height: 300,
    backgroundColor: '#333333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  posterText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
  movieInfo: {
    alignItems: 'center',
    width: '100%',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 15,
  },
  year: {
    color: '#8C8C8C',
    fontSize: 16,
  },
  runtime: {
    color: '#8C8C8C',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  genreTag: {
    backgroundColor: '#E50914',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  watchButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
  },
  watchButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  trailerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
  },
  trailerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  synopsis: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 24,
  },
  director: {
    color: '#8C8C8C',
    fontSize: 16,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  castContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  castMember: {
    alignItems: 'center',
    width: 80,
  },
  actorPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actorInitials: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actorName: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  relatedMovies: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  relatedMovie: {
    width: 120,
    marginRight: 16,
  },
  relatedPoster: {
    width: '100%',
    height: 180,
    backgroundColor: '#333333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  relatedPosterText: {
    color: '#666666',
    fontSize: 10,
    textAlign: 'center',
  },
  relatedTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  relatedRating: {
    color: '#FFD700',
    fontSize: 10,
    textAlign: 'center',
  },
});
