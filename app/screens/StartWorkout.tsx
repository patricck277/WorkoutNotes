import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { RootStackParamList } from '../../App';

type StartWorkoutScreenRouteProp = RouteProp<RootStackParamList, 'StartWorkout'>;

type Props = {
  route: StartWorkoutScreenRouteProp;
};

type WorkoutData = {
  sets: any[];
  startTime: Date | null;
  endTime: Date | null;
};

const StartWorkout = ({ route }: Props) => {
  const { routineId } = route.params;
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [workoutData, setWorkoutData] = useState<WorkoutData>({ sets: [], startTime: null, endTime: null });
  const navigation = useNavigation();

  const handleStartWorkout = () => {
    setIsWorkoutStarted(true);
    setWorkoutData({ ...workoutData, startTime: new Date() });
  };

  const handleEndWorkout = async () => {
    const endTime = new Date();
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return; // Ensure the user is logged in

    setWorkoutData(prevWorkoutData => ({ ...prevWorkoutData, endTime }));

    try {
      await addDoc(collection(FIRESTORE_DB, 'workouts'), {
        routineId,
        ...workoutData,
        endTime,
        userId: userUid,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error ending workout: ', error);
    }
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Workout</Text>
      <Text style={styles.subtitle}>Routine ID: {routineId}</Text>
      {!isWorkoutStarted ? (
        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.endButton} onPress={handleEndWorkout}>
          <Text style={styles.endButtonText}>End Workout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  startButton: {
    width: 200,
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  startButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  endButton: {
    width: 200,
    height: 50,
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 16,
  },
  endButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StartWorkout;
