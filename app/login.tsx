import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Fehler', 'Bitte alle Felder ausfüllen');
      return;
    }

    try {
      // Hier würde normalerweise die MongoDB-Authentifizierung stattfinden
      console.log('Login attempt:', { email, password });
      
      // Simuliere erfolgreichen Login
      Alert.alert('Erfolg', 'Erfolgreich eingeloggt!', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
    } catch (error) {
      Alert.alert('Fehler', 'Login fehlgeschlagen');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#141414', '#000000']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <Text style={styles.logo}>NETFLIX</Text>
        <Text style={styles.subtitle}>Anmelden</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="E-Mail"
            placeholderTextColor="#8c8c8c"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Passwort"
            placeholderTextColor="#8c8c8c"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Anmelden</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Neu bei Netflix? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.signupText}>Jetzt registrieren</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    color: '#e50914',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  subtitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#e50914',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
