import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './app/screens/SignUp';
import SignIn from './app/screens/SignIn';
import MyTabs from './app/MyTabs';
import AddRoutine from './app/screens/AddRoutine';
import Profile from './app/screens/Profile';
import RoutineDetails from './app/screens/RoutineDetails';
import StartWorkout from './app/screens/StartWorkout'; // Import StartWorkout

export type RootStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Main: undefined;
  AddRoutine: undefined;
  Profile: undefined;
  RoutineDetails: { routineId: string };
  StartWorkout: { routineId: string }; // Add StartWorkout
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MyTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AddRoutine" component={AddRoutine} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="RoutineDetails" component={RoutineDetails} options={{ headerShown: false }} />
        <Stack.Screen name="StartWorkout" component={StartWorkout} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
