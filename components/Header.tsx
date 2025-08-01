import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header({ navigation, routeName }: { navigation: any, routeName: string }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Image
            source={require('../assets/logo.png')} // your avatar image
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{routeName}</Text>

        <TouchableOpacity onPress={() => alert('Options')}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderColor: '#ccc',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});
