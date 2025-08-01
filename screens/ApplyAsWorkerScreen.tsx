import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ApplyAsWorkerScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [services, setServices] = useState('');
  const [loading, setLoading] = useState(false);

  const user = getAuth().currentUser;

  useEffect(() => {
    if (user?.phoneNumber) {
      setPhone(user.phoneNumber);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;

    if (!name.trim() || !phone.trim() || !location.trim() || !services.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, 'workers', user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        services: services.split(',').map((s) => s.trim()),
        isAvailable: true,
        isVerified: false,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'You are now registered as a worker!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'App' }], // Go to authenticated flow
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>👷 Apply as Worker</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          style={styles.input}
          placeholder="Services (comma separated)"
          value={services}
          onChangeText={setServices}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
  style={{ marginTop: 20 }}
  onPress={() =>
    navigation.reset({
      index: 0,
      routes: [{ name: 'App' }],
    })
  }
>
  <Text style={{ color: '#2980b9', textAlign: 'center', fontWeight: '600' }}>
    👀 Continue Without Applying
  </Text>
</TouchableOpacity>
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
