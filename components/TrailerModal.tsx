import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface TrailerModalProps {
  visible: boolean;
  trailerKey: string | null;
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ visible, trailerKey, onClose }) => {
  if (!trailerKey) {
    return null;
  }

  const trailerUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&showinfo=0&rel=0`;

  const handleError = () => {
    Alert.alert('Error', 'Failed to load trailer');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Movie Trailer</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.webViewContainer}>
          <WebView
            source={{ uri: trailerUrl }}
            style={styles.webView}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            onError={handleError}
            onHttpError={handleError}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading trailer...</Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#141414',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TrailerModal;