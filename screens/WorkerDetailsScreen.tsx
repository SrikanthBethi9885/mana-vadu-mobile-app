import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function WorkerDetailScreen({ route }: any) {
  const { worker } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={worker.image ? { uri: worker.image } : require('../assets/logo.png')}
        style={styles.image}
      />
      <Text style={styles.name}>{worker.name}</Text>
      <Text style={styles.detail}>📍 {worker.location}</Text>
      <Text style={styles.detail}>🛠️ {worker.service}</Text>
      <Text style={styles.detail}>📞 {worker.phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    flex: 1,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
  },
});
