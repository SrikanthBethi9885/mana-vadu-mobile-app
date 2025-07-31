import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import AddWorkerScreen from './screens/AddWorkerScreen';
import WorkerListScreen from './screens/WorkerListScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AddWorker') {
              iconName = focused ? 'person-add' : 'person-add-outline';
            } else if (route.name === 'WorkerList') {
              iconName = focused ? 'call' : 'call-outline';
            } else {
              iconName = 'alert-circle';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2980b9',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="AddWorker" component={AddWorkerScreen} options={{ title: 'Add Worker' }} />
        <Tab.Screen name="WorkerList" component={WorkerListScreen} options={{ title: 'Workers' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
