import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useMovieContext } from '../context/MovieContext';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const [moviesMenuVisible, setMoviesMenuVisible] = useState(false);
  const [tvSeriesMenuVisible, setTvSeriesMenuVisible] = useState(false);
  const [genresMenuVisible, setGenresMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const navRef = useRef<View>(null);
  const { user, logout } = useAuth();

  const {
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchUpcomingMovies,
    fetchFeaturedMovies,
    fetchAnimeMovies,
    searchMovies,
    fetchPopularTvSeries,
    fetchAiringTodayTvSeries,
    fetchOnTheAirTvSeries,
    fetchTopRatedTvSeries,
    fetchMoviesByGenre,
  } = useMovieContext();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMovies(searchQuery);
      router.push('/movies');
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleClickOutside = (event: MouseEvent) => {
        if (navRef.current && !(navRef.current as any).contains(event.target as Node)) {
          setMoviesMenuVisible(false);
          setTvSeriesMenuVisible(false);
          setGenresMenuVisible(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);

  const movieItems = [
    { name: 'Featured', action: () => {
      fetchFeaturedMovies();
      setMoviesMenuVisible(false);
      router.push('/movies');
    }},
    { name: 'Popular', action: () => {
      fetchPopularMovies();
      setMoviesMenuVisible(false);
      router.push('/movies');
    }},
    { name: 'Top Rated', action: () => {
      fetchTopRatedMovies();
      setMoviesMenuVisible(false);
      router.push('/movies');
    }},
    { name: 'Upcoming', action: () => {
      fetchUpcomingMovies();
      setMoviesMenuVisible(false);
      router.push('/movies');
    }},
    { name: 'Anime', action: () => {
      fetchAnimeMovies();
      setMoviesMenuVisible(false);
      router.push('/movies');
    }},
  ];

  const tvSeriesItems = [
    { name: 'Popular', action: () => {
      fetchPopularTvSeries();
      setTvSeriesMenuVisible(false);
      router.push('/movies');
    }},
    { name: 'Airing Today', action: () => {
      fetchAiringTodayTvSeries();
      setTvSeriesMenuVisible(false);
      router.push('/movies');
    }},
    { name: 'On the Air', action: () => {
      fetchOnTheAirTvSeries();
      setTvSeriesMenuVisible(false);
      router.push('/movies');
    }},
    { name: 'Top Rated', action: () => {
      fetchTopRatedTvSeries();
      setTvSeriesMenuVisible(false);
      router.push('/movies');
    }},
  ];
  
  const genreItems = [
    { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' }, { id: 36, name: 'History' },
    { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' }, { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' },
  ];

  return (
    <View style={styles.navContainer} ref={navRef}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.logo}>Cineverse</Text>
      </TouchableOpacity>
      <View style={styles.navLinks}>
        <View>
          <TouchableOpacity onPress={() => setMoviesMenuVisible(!moviesMenuVisible)}>
            <Text style={styles.navText}>Movies</Text>
          </TouchableOpacity>
          {moviesMenuVisible && (
            <View style={styles.dropdownMenu}>
              {movieItems.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.dropdownItem}
                  onPress={() => item.action()}
                >
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity onPress={() => setTvSeriesMenuVisible(!tvSeriesMenuVisible)}>
            <Text style={styles.navText}>TV Series</Text>
          </TouchableOpacity>
          {tvSeriesMenuVisible && (
            <View style={styles.dropdownMenu}>
              {tvSeriesItems.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.dropdownItem}
                  onPress={() => item.action()}
                >
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity onPress={() => setGenresMenuVisible(!genresMenuVisible)}>
            <Text style={styles.navText}>Genres</Text>
          </TouchableOpacity>
          {genresMenuVisible && (
            <View style={[styles.dropdownMenu, styles.genresDropdown]}>
              {genreItems.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.genreItem}
                  onPress={() => {
                    fetchMoviesByGenre(item.id);
                    setGenresMenuVisible(false);
                    router.push('/movies');
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search..." 
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        {user ? (
          <TouchableOpacity style={styles.loginButton} onPress={() => logout()}>
            <Text style={styles.loginButtonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  logo: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    marginLeft: 30,
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#1A213E',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 20,
    width: 250,
  },
  loginButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#0A0F28',
    fontSize: 16,
    fontWeight: 'bold'
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#1A213E',
    borderRadius: 5,
    padding: 10,
    width: 160,
  },
  genresDropdown: {
    width: 320,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  genreItem: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Navigation;
