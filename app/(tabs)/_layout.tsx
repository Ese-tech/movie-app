import React from 'react';
import { Tabs } from 'expo-router';
import Navigation from '../../components/navigation';
import { MovieProvider, useMovieContext } from '../../context/MovieContext';

const TabsLayoutContent = () => {
  const { fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies } = useMovieContext();

  return (
    <>
      <Navigation />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#121212',
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#888',
        }}>
        <Tabs.Screen
          name="index"
          options={{ title: 'Popular' }}
          listeners={{
            tabPress: () => fetchPopularMovies(),
          }}
        />
        <Tabs.Screen
          name="top-rated"
          options={{ title: 'Top Rated' }}
          listeners={{
            tabPress: () => fetchTopRatedMovies(),
          }}
        />
        <Tabs.Screen
          name="upcoming"
          options={{ title: 'Upcoming' }}
          listeners={{
            tabPress: () => fetchUpcomingMovies(),
          }}
        />
      </Tabs>
    </>
  );
}

const TabsLayout = () => {
  return (
    <MovieProvider>
      <TabsLayoutContent />
    </MovieProvider>
  );
};

export default TabsLayout;