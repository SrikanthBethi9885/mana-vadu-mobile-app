import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function MyLoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2980b9" />
      <Text style={styles.text}>Checking your role...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
});
