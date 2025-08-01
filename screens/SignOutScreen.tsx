import { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { signOut, getAuth } from 'firebase/auth';

export default function SignOutScreen({ navigation }: any) {
  useEffect(() => {
    const doSignOut = async () => {
      try {
        await signOut(getAuth());
        navigation.replace('Auth'); // go back to login screen
      } catch (error: any) {
        console.error(error);
        Alert.alert('Error', 'Sign out failed. Try again.');
      }
    };
    doSignOut();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Signing out...</Text>
    </View>
  );
}
