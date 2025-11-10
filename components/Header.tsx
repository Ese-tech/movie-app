import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { useRouter } from 'expo-router';

const Header = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>FMOVIES</Text>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger><Text style={styles.menuText}>Movies</Text></MenubarTrigger>
          <MenubarContent>
            <MenubarItem onPress={() => router.push('/')}><Text>Featured</Text></MenubarItem>
            <MenubarItem onPress={() => router.push('/')}><Text>Popular</Text></MenubarItem>
            <MenubarItem onPress={() => router.push('/')}><Text>Top Rated</Text></MenubarItem>
            <MenubarItem onPress={() => router.push('/')}><Text>Upcoming</Text></MenubarItem>
            <MenubarItem onPress={() => router.push('/')}><Text>Anime</Text></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger><Text style={styles.menuText}>TV Series</Text></MenubarTrigger>
          <MenubarContent>
            <MenubarItem onPress={() => router.push('/')}><Text>Popular</Text></MenubarItem>
            <MenubarItem onPress={() => router.push('/')}><Text>Airing Today</Text></MenubarItem>
            <MenubarItem onPress={() => router.push('/')}><Text>On the Air</Text></MenubarItem>
            <MenubarItem onPress={() => router.push('/')}><Text>Top Rated</Text></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {/* Add more menus here */}
      </Menubar>
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={() => alert('Search!')}><Text style={styles.menuText}>Search</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Login!')}><Text style={styles.loginText}>Login</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Header;
