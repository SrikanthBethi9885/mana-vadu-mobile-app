import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Modal, Pressable } from 'react-native';
import { onSnapshot } from 'firebase/firestore';
type Worker = {
  id: string;
  name: string;
  phone: string;
  services: string[];
  location: string;
  image?: string;
};

export default function WorkerListScreen() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fetchWorkers = async () => {
  try {
    const q = query(collection(db, 'workers'), where('isVerified', '==', true));
    const snapshot = await getDocs(q);
    const list: Worker[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Worker, 'id'>),
    }));
    setWorkers(list);
  } catch (error) {
    console.error('🔥 Firebase fetch error:', error);
  } finally {
    setRefreshing(false);
    setLoading(false);
  }
};

useEffect(() => {
  fetchWorkers();
}, []);
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };
  const handleViewDetails = (worker: Worker) => {
    setSelectedWorker(worker);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2980b9" />
        <Text style={{ marginTop: 10 }}>Loading workers...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Available Workers</Text>

      <FlatList
        data={workers}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchWorkers();
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Image
                source={item.image ? { uri: item.image } : require('../assets/logo.png')}
                style={styles.workerImage}
              />
              <View style={styles.infoColumn}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.info}>

                  {item.services?.join(', ')} • {item.location}
                </Text>
                <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.phone)}>
                  <Text style={styles.callText}>📞 Call {item.phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleViewDetails(item)}>
                  <Text style={styles.detailsLink}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        )}
        ListEmptyComponent={<Text>No verified workers found.</Text>}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={
                selectedWorker?.image
                  ? { uri: selectedWorker.image }
                  : require('../assets/logo.png')
              }
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>{selectedWorker?.name}</Text>
            <Text style={styles.modalText}>📍 {selectedWorker?.location}</Text>
            {selectedWorker?.services?.map((svc, index) => (
              <Text key={index} style={styles.modalText}>• {svc}</Text>
            ))}
            <Text style={styles.modalText}>📞 {selectedWorker?.phone}</Text>

            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ecf0f1',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
  },
  info: {
    fontSize: 14,
    color: '#7f8c8d',
    marginVertical: 6,
  },
  callButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  callText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoColumn: {
    flex: 1,
    marginLeft: 12,
  },

  workerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
  },
  detailsLink: {
    color: '#2980b9',
    fontWeight: '600',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },

  modalText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 4,
  },

  closeButton: {
    marginTop: 16,
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },


});
