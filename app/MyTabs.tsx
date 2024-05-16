import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from './screens/Main';
import Statistics from './screens/Statistics';
import History from './screens/History';
import Exercises from './screens/Exercises';
import Profile from './screens/Profile';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#fff', // Background color of the tab bar
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          height: 60, // Increase the height of the tab bar
        },
        tabBarActiveTintColor: '#28a745', // Active icon and text color
        tabBarInactiveTintColor: '#000', // Inactive icon and text color
        tabBarLabelStyle: {
          fontSize: 14, // Increase the font size
          fontWeight: 'bold',
          marginBottom: 5, // Adjust the margin to center the text vertically
        },
        tabBarIconStyle: {
          marginTop: 5, // Adjust the margin to center the icons vertically
        },
        headerShown: false, // Hide the header for all tabs
      }}
    >
      <Tab.Screen
        name="Home"
        component={Main}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={30} color={color} /> // Increase icon size
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Statistic"
        component={Statistics}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="linechart" size={30} color={color} /> // Increase icon size
          ),
          tabBarLabel: 'Statistic',
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" size={30} color={color} /> // Increase icon size
          ),
          tabBarLabel: 'History',
        }}
      />
      <Tab.Screen
        name="Exercise"
        component={Exercises}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" size={30} color={color} /> // Increase icon size
          ),
          tabBarLabel: 'Exercise',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={30} color={color} /> // Increase icon size
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
