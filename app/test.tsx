import React from 'react';
import { Text, View } from 'react-native';

export default function TestPage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>TEST - Expo Router funktioniert!</Text>
      <Text style={{ color: '#fff', fontSize: 16, marginTop: 20 }}>
        Wenn du das siehst, läuft Expo Router korrekt
      </Text>
    </View>
  );
}