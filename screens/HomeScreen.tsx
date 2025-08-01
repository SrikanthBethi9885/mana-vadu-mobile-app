import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../i18n';
import { useState } from 'react';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
export default function HomeScreen({ navigation }: any) {
    const [forceUpdate, setForceUpdate] = useState(false);
    const toggleLanguage = () => {
  i18n.locale = i18n.locale === 'en' ? 'te' : 'en';
  setForceUpdate((prev) => !prev); // rerender screen
};

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={toggleLanguage} style={styles.languageToggle}>
  <Text style={styles.languageToggleText}>
    🌐 {i18n.locale === 'en' ? 'Switch to Telugu' : 'ఇంగ్లీష్‌కు మార్చండి'}
  </Text>
</TouchableOpacity>
      <Animated.Text entering={FadeInUp.duration(600)} style={styles.title}>
        {i18n.t('title')}
      </Animated.Text>

      <Animated.Text entering={FadeInDown.duration(800)} style={styles.subtitle}>
        {i18n.t('subtitle')}
      </Animated.Text>

      <Animated.Text entering={FadeInDown.delay(400).duration(600)} style={styles.description}>
        {i18n.t('description')}
      </Animated.Text>

      {/* <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.button}>
        <TouchableOpacity onPress={() => navigation.navigate('AddWorker')}>
          <Text style={styles.buttonText}>➕ {i18n.t('addWorker')}</Text>
        </TouchableOpacity>
      </Animated.View> */}

      <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.button}>
        <TouchableOpacity onPress={() => navigation.navigate('WorkerList')}>
          <Text style={styles.buttonText}>🔍 {i18n.t('findWorkers')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0a3d62',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2980b9',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 12,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
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
description: {
  fontSize: 14,
  color: '#7f8c8d',
  textAlign: 'center',
  marginBottom: 30,
  paddingHorizontal: 10,
},
});
