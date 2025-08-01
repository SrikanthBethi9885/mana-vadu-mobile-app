import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import i18n from '../i18n';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { auth } from '../services/firebase';
const services = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Mechanic',
  'AC Technician',
  'Photo and Video Grapher',
  'Welder',
];

const AddWorkerScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [location, setLocation] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter(s => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };
  const toggleAvailability = async (current: boolean) => {
    if (!auth.currentUser) return;

    const workerRef = doc(db, 'workers', auth.currentUser.uid);
    await updateDoc(workerRef, { isAvailable: !current });
  };
  const toggleLanguage = () => {
    i18n.locale = i18n.locale === 'en' ? 'te' : 'en';
    setForceUpdate((prev) => !prev); // rerender screen
  };
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permission is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone || selectedServices.length === 0 || !location) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'workers'), {
        name,
        phone,
        services: selectedServices,
        location,
        image,
        isAvailable, 
        createdAt: serverTimestamp(),
        isVerified: false,
      });

      Alert.alert('Success', 'Worker submitted for verification');
      setName('');
      setPhone('');
      setSelectedServices([]);
      setLocation('');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not save worker');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={toggleLanguage} style={styles.languageToggle}>
          <Text style={styles.languageToggleText}>
            🌐 {i18n.locale === 'en' ? 'Switch to Telugu' : 'ఇంగ్లీష్‌కు మార్చండి'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.header}>{i18n.t('addWorker')}</Text>

        <TextInput
          placeholder={i18n.t('fullName')}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder={i18n.t('phoneNumber') || "Phone Number"}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>{i18n.t('service') || 'Select Services'}</Text>
        <View style={styles.serviceList}>
          {services.map((svc) => (
            <TouchableOpacity
              key={svc}
              onPress={() => toggleService(svc)}
              style={[
                styles.serviceItem,
                selectedServices.includes(svc) && styles.serviceItemSelected,
              ]}
            >
              <Text
                style={{
                  color: selectedServices.includes(svc) ? '#fff' : '#2980b9',
                  fontWeight: '600',
                }}
              >
                {svc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>


        <TextInput
          placeholder={i18n.t('location') || "Location (e.g., Nandyal)"}
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Available:</Text>
          <TouchableOpacity onPress={() => toggleAvailability(isAvailable)}>
            <Text>{isAvailable ? '🟢 Available' : '⚪️ Not Available'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>📷 Take or Upload Photo</Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 10, marginVertical: 10 }}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>📤 Submit Worker</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddWorkerScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#2980b9',
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  languageToggle: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#dff9fb',
    borderRadius: 8,
  },

  languageToggleText: {
    fontSize: 14,
    color: '#130f40',
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#34495e',
  },

  serviceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  serviceItem: {
    borderWidth: 1,
    borderColor: '#2980b9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
    backgroundColor: '#fff',
  },

  serviceItemSelected: {
    backgroundColor: '#2980b9',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleText: {
    color: '#fff',
    fontWeight: '600',
  },

});
