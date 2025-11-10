import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        Alert.alert('Success', 'Successfully logged in!', [
          { text: 'OK', onPress: () => router.replace('/') }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleDemoLogin = async () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    await handleLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#141414', '#000000']}
        style={styles.gradient}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.logo}>FMOVIES</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>
          <Text style={styles.description}>Sign in to continue watching</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#8c8c8c" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8c8c8c"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#8c8c8c" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8c8c8c"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.disabledButton]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={handleDemoLogin}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>Try Demo Account</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>New to FMovies? </Text>
              <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
                <Text style={styles.signupText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  logo: {
    color: '#e50914',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: '#8c8c8c',
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 350,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#e50914',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#e50914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e50914',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  demoButtonText: {
    color: '#e50914',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#8c8c8c',
    fontSize: 16,
  },
  signupText: {
    color: '#e50914',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
