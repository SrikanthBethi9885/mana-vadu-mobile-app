import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './services/firebase';

// Screens
import HomeScreen from './screens/HomeScreen';
import AddWorkerScreen from './screens/AddWorkerScreen';
import WorkerListScreen from './screens/WorkerListScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import SignOutScreen from './screens/SignOutScreen';
import AuthScreen from './screens/AuthScreen';
import ApplyAsWorkerScreen from './screens/ApplyAsWorkerScreen';
import MyLoadingScreen from './screens/MyLoadingScreen';
import Header from './components/Header';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function TabsWithHeader({ navigation, isWorker }: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => (
          <Header navigation={navigation} routeName={route.name} />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'alert-circle';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'WorkerList') iconName = focused ? 'call' : 'call-outline';
          else if (route.name === 'MyProfile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'AddWorker') iconName = focused ? 'person-add' : 'person-add-outline';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2980b9',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="WorkerList" component={WorkerListScreen} />
      {isWorker && (
        <>
          <Tab.Screen name="MyProfile" component={MyProfileScreen} />
          {/* <Tab.Screen name="AddWorker" component={AddWorkerScreen} /> */}
        </>
      )}
    </Tab.Navigator>
  );
}

function DrawerWithTabs({ isWorker }: any) {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Main">
        {(props) => <TabsWithHeader {...props} isWorker={isWorker} />}
      </Drawer.Screen>
      {isWorker && (
        <Drawer.Screen name="My Profile" component={MyProfileScreen} />
      )}
      <Drawer.Screen name="Sign Out" component={SignOutScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isWorker, setIsWorker] = useState<boolean | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const ref = doc(db, 'workers', firebaseUser.uid);
        const snap = await getDoc(ref);
        setIsWorker(snap.exists());
      } else {
        setIsWorker(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Auth" component={AuthScreen} />
          ) : isWorker === null ? (
            <Stack.Screen name="Loading" component={MyLoadingScreen} />
          ) : isWorker ? (
            <Stack.Screen name="App">
              {(props) => <DrawerWithTabs {...props} isWorker={true} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="ApplyAsWorker" component={ApplyAsWorkerScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
