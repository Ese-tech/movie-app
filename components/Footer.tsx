import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Footer: React.FC = () => {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#0a0a0a']}
      style={styles.footer}
    >
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#00d4aa', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoContainer}
          >
            <Text style={styles.logo}>CINEVERSE</Text>
          </LinearGradient>
          <Text style={styles.tagline}>Your Ultimate Movie Experience</Text>
        </View>

        {/* Company Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company</Text>
          <TouchableOpacity>
            <Text style={styles.link}>About Ese-tech</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.link}>Careers</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.link}>Press</Text>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.link}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.link}>Cookie Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.link}>Impressum</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.link}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.link}>Report Issue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Copyright */}
      <View style={styles.bottomSection}>
        <View style={styles.divider} />
        <View style={styles.copyrightSection}>
          <Text style={styles.copyright}>
            © 2025 Ese-tech. All rights reserved.
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={20} color="#00d4aa" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={20} color="#00d4aa" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={20} color="#00d4aa" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  footer: {
   
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 170, 0.3)',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  
  },
  logoSection: {
    flex: 1,
    minWidth: 200,
    marginBottom: 20,
  },
  logoContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  tagline: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
  },
  section: {
    flex: 1,
    minWidth: 150,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  link: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
    paddingVertical: 4,
  },
  bottomSection: {
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    marginBottom: 20,
  },
  copyrightSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  copyright: {
    color: '#999',
    fontSize: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 15,
  },
  socialButton: {
    padding: 8,
  },
});