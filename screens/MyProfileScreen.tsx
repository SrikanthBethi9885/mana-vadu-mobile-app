import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [services, setServices] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      const ref = doc(db, 'workers', auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || '');
        setPhone(data.phone || '');
        setLocation(data.location || '');
        setServices(data.services?.join(', ') || '');
        setIsAvailable(data.isAvailable || false);
      } else {
        await setDoc(ref, {
          name: '',
          phone: '',
          location: '',
          services: [],
          isAvailable: false,
          createdAt: new Date(),
          isVerified: false,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      const ref = doc(db, 'workers', auth.currentUser.uid);
      await updateDoc(ref, {
        name,
        phone,
        location,
        services: services.split(',').map(s => s.trim()),
        isAvailable,
      });
      Alert.alert('Profile updated!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2980b9" />
        <Text>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>👤 My Profile</Text>

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
          placeholder="Services (comma-separated)"
          value={services}
          onChangeText={setServices}
        />

        <View style={styles.availabilityRow}>
          <Text style={styles.availabilityText}>
            {isAvailable ? '🟢 Available' : '⚪ Not Available'}
          </Text>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            thumbColor={isAvailable ? '#2ecc71' : '#ccc'}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>💾 Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f6f8',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
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
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
});
