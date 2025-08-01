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
  isAvailable?: boolean; // 👈 add this
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
        contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
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
                {/* <Text style={styles.name}>{item.name}</Text> */}
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.isAvailable && <Text style={styles.statusBadge}>Available</Text>}
                  {!item.isAvailable && <Text style={styles.statusBadgeOffline}>Offline</Text>}
                </View>
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
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No verified workers found.</Text>}
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
    flex: 1,
    backgroundColor: '#f2f2f2', // subtle background
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1e272e',
    textAlign: 'left',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  info: {
    fontSize: 13,
    color: '#636e72',
    marginVertical: 4,
  },
  callButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 6,
  },
  callText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },

  workerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dcdde1',
    marginRight: 12,
  },
  detailsLink: {
    color: '#2980b9',
    fontWeight: '600',
    marginTop: 4,
    fontSize: 13,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusBadge: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    borderRadius: 12,
    marginLeft: 8,
  },

  statusBadgeOffline: {
    backgroundColor: '#bdc3c7',
    color: '#2f3542',
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    borderRadius: 12,
    marginLeft: 8,
  },


});
