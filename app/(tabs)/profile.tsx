import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, isLoggedIn, login, register, logout } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async () => {
    try {
      if (isLoginMode) {
        const success = await login(email, password);
        if (success) {
          Alert.alert('Success', 'Logged in successfully!');
        } else {
          Alert.alert('Error', 'Please enter valid email and password');
        }
      } else {
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          return;
        }
        const success = await register(email, password, name);
        if (success) {
          Alert.alert('Success', 'Account created successfully!');
        } else {
          Alert.alert('Error', 'Please fill all fields correctly');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    Alert.alert('Success', 'Logged out successfully!');
  };

  if (isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#141414', '#000000']} style={StyleSheet.absoluteFillObject} />
        
        <Header />
        
        <View style={styles.mainLayout}>
          <ScrollView style={styles.content}>
          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={50} color="#FFFFFF" />
            </View>
            <Text style={styles.profileName}>{user?.name || 'Cineverse User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="bookmark" size={24} color="#E50914" />
              <Text style={styles.menuText}>My Watchlist</Text>
              <Ionicons name="chevron-forward" size={20} color="#8C8C8C" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="heart" size={24} color="#E50914" />
              <Text style={styles.menuText}>Favorites</Text>
              <Ionicons name="chevron-forward" size={20} color="#8C8C8C" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="time" size={24} color="#E50914" />
              <Text style={styles.menuText}>Watch History</Text>
              <Ionicons name="chevron-forward" size={20} color="#8C8C8C" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="download" size={24} color="#E50914" />
              <Text style={styles.menuText}>Downloads</Text>
              <Ionicons name="chevron-forward" size={20} color="#8C8C8C" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="settings" size={24} color="#E50914" />
              <Text style={styles.menuText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#8C8C8C" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle" size={24} color="#E50914" />
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#8C8C8C" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
          
          <Footer />
        </ScrollView>

        {/* Sidebar */}
        <Sidebar />
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#141414', '#000000']} style={StyleSheet.absoluteFillObject} />
      
      <Header />
      
      <View style={styles.mainLayout}>
        <ScrollView style={styles.content} contentContainerStyle={styles.authContainer}>
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.authSubtitle}>
            {isLoginMode ? 'Sign in to your account' : 'Join Cineverse today'}
          </Text>

          {!isLoginMode && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#8C8C8C"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8C8C8C"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8C8C8C"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isLoginMode && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#8C8C8C"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isLoginMode ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchModeButton} 
            onPress={() => setIsLoginMode(!isLoginMode)}
          >
            <Text style={styles.switchModeText}>
              {isLoginMode ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <Text style={styles.orText}>Or continue with</Text>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
        
        <Footer />
      </ScrollView>

      {/* Sidebar */}
      <Sidebar />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  authContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: '80%',
  },
  authCard: {
    backgroundColor: '#222222',
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  authTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    color: '#8C8C8C',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  switchModeButton: {
    marginTop: 20,
  },
  switchModeText: {
    color: '#8C8C8C',
    fontSize: 14,
    textAlign: 'center',
  },
  socialContainer: {
    marginTop: 30,
  },
  orText: {
    color: '#8C8C8C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    paddingVertical: 12,
    borderRadius: 8,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Logged in styles
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#333333',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileEmail: {
    color: '#8C8C8C',
    fontSize: 16,
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#E50914',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});