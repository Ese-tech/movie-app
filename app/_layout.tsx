import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from '../context/AuthContext';
import { MovieProvider } from '../context/MovieContext';

const AppLayout = () => {
  return (
    <AuthProvider>
      <MovieProvider>
        <View style={styles.container}>
          <LinearGradient
            colors={['#0A0F28', '#1A213E', '#2C3A5B']}
            style={styles.gradient}
          />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="movie/[id]" />
          </Stack>
        </View>
      </MovieProvider>
    </AuthProvider>
  );
};

const RootLayout = () => {
  return <AppLayout />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default RootLayout;
