import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { RootStackParamList } from '../../App';

type WorkoutDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'WorkoutDetails'
>;

type Props = {
  route: WorkoutDetailsScreenRouteProp;
};

type SetData = {
  setNumber: number;
  weight: string;
  reps: string;
  comment: string;
};

type ExerciseData = {
  exercise: string;
  sets: SetData[];
};

type WorkoutData = {
  exercises: ExerciseData[];
  startTime: string;
  endTime: string;
};

const WorkoutDetails = ({ route }: Props) => {
  const { workoutId } = route.params;
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      const docRef = doc(FIRESTORE_DB, 'workouts', workoutId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWorkoutData({
          exercises: data.exercises,
          startTime: data.startTime.toDate().toLocaleString(),
          endTime: data.endTime.toDate().toLocaleString(),
        });
      }
    };

    fetchWorkoutData();
  }, [workoutId]);

  if (!workoutData) {
    return (
      <View style={styles.background}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.background}>
      <Text style={styles.title}>Workout Details</Text>
      <Text style={styles.infoText}>Start Time: {workoutData.startTime}</Text>
      <Text style={styles.infoText}>End Time: {workoutData.endTime}</Text>
      {workoutData.exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          <Text style={styles.exerciseTitle}>{exercise.exercise}</Text>
          {exercise.sets.map((set, setIndex) => (
            <View key={setIndex} style={styles.setContainer}>
              <Text style={styles.setText}>Set {set.setNumber}</Text>
              <Text style={styles.setText}>Weight: {set.weight}</Text>
              <Text style={styles.setText}>Reps: {set.reps}</Text>
              <Text style={styles.setText}>Comment: {set.comment}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flexGrow: 1,
    backgroundColor: 'black',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  exerciseContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  setContainer: {
    marginBottom: 16,
  },
  setText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 4,
  },
});

export default WorkoutDetails;
