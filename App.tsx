import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';

// Import TypeScript screens from app directory instead of deprecated JS screens
import MovieDetails from './screens/MovieDetails'; // This is now a stub pointing to TypeScript
import Popular from './screens/Popular'; // This is now a stub pointing to TypeScript
import TopRated from './screens/TopRated'; // This is now a stub pointing to TypeScript
import Upcoming from './screens/Upcoming'; // This is now a stub pointing to TypeScript

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Popular" component={Popular} />
    <Tab.Screen name="Top Rated" component={TopRated} />
    <Tab.Screen name="Upcoming" component={Upcoming} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Cineverse" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="MovieDetails" component={MovieDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;