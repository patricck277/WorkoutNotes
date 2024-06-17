import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './app/screens/SignUp';
import SignIn from './app/screens/SignIn';
import MyTabs from './app/MyTabs';
import AddRoutine from './app/screens/AddRoutine';
import Profile from './app/profile/Profile';
import RoutineDetails from './app/screens/RoutineDetails';
import StartWorkout from './app/screens/StartWorkout';
import Exercises from './app/screens/Exercises';
import ExerciseDetails from './app/exercises/ExerciseDetails';
import AddExercise from './app/exercises/AddExercise';
import UpdateMeasurements from './app/profile/UpdateMeasurements';
import EditMeasurements from './app/profile/EditMeasurements';
import CalendarScreen from './app/history/Calendar';
import History from './app/history/History';
import EditRoutine from './app/screens/EditRoutine';
import WorkoutDetails from './app/history/WorkoutDetails';

export type Measurement = {
  name: string;
  value: string;
};

export type MeasurementData = {
  date: string;
  measurements: Measurement[];
};

export type RootStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Main: undefined;
  AddRoutine: undefined;
  Profile: { updatedMeasurements?: MeasurementData } | undefined;
  RoutineDetails: { routineId: string };
  StartWorkout: { routineId: string; autoStart?: boolean };
  Exercises: undefined;
  ExerciseDetails: {
    name: string;
    description?: string;
    imageUrl?: string;
    id?: string;
  };
  AddExercise: undefined;
  UpdateMeasurements: undefined;
  EditMeasurements: { measurements: MeasurementData };
  Calendar: undefined;
  History: undefined;
  EditRoutine: { routineId: string };
  WorkoutDetails: { workoutId: string };
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
        <Stack.Screen name="Exercises" component={Exercises} options={{ headerShown: false }} />
        <Stack.Screen name="ExerciseDetails" component={ExerciseDetails} options={{ headerShown: false }} />
        <Stack.Screen name="AddExercise" component={AddExercise} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateMeasurements" component={UpdateMeasurements} options={{ headerShown: false }} />
        <Stack.Screen name="EditMeasurements" component={EditMeasurements} options={{ headerShown: false }} /> 
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false }} />
        <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
        <Stack.Screen name="EditRoutine" component={EditRoutine} options={{ headerShown: false }} />
        <Stack.Screen name="WorkoutDetails" component={WorkoutDetails} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
