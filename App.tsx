import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Main from './app/screens/Main';
import SignUp from './app/screens/SignUp';
import SignIn from './app/screens/SignIn';
import Profile from './app/screens/Profile';
import HCalendar from './app/screens/HCalendar';
import History from './app/screens/History';
import PSettings from './app/screens/PSettings';
import MAdd from './app/screens/MAdd';
import PBody from './app/screens/PBody';
import Records from './app/screens/Records';
import Statistics from './app/screens/Statistics';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
<NavigationContainer>
  <Stack.Navigator initialRouteName="SignIn">
    <Stack.Screen name="Main" component={Main} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="HCalendar" component={HCalendar} />
    <Stack.Screen name="History" component={History} />
    <Stack.Screen name="PSettings" component={PSettings} />
    <Stack.Screen name="MAdd" component={MAdd} /> 
    <Stack.Screen name="PBody" component={PBody} />
    <Stack.Screen name="Records" component={Records} />
    <Stack.Screen name="Statistics" component={Statistics} />
 </Stack.Navigator>
</NavigationContainer>
  );
}
