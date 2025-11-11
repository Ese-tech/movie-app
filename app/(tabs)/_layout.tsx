import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#8C8C8C',
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderBottomColor: 'rgba(0, 212, 170, 0.3)',
          borderBottomWidth: 1,
          shadowColor: '#00d4aa',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        tabBarPosition: 'top',
        headerShown: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Movies',
          tabBarIcon: ({ color }) => <TabBarIcon name="film" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tv-series"
        options={{
          title: 'TV Series',
          tabBarIcon: ({ color }) => <TabBarIcon name="tv" color={color} />,
        }}
      />
      <Tabs.Screen
        name="genres"
        options={{
          title: 'Genres',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
