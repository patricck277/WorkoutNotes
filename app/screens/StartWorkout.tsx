import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { RootStackParamList } from '../../App';
import { ExerciseItem, basicExercises } from '../exercises/basicExercises';
import { Picker } from '@react-native-picker/picker';

type StartWorkoutScreenRouteProp = RouteProp<RootStackParamList, 'StartWorkout'>;

type Props = {
  route: StartWorkoutScreenRouteProp;
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
  startTime: Date | null;
  endTime: Date | null;
};

const StartWorkout = ({ route }: Props) => {
  const { routineId, autoStart } = route.params;
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(autoStart);
  const [workoutData, setWorkoutData] = useState<WorkoutData>({ exercises: [], startTime: null, endTime: null });
  const [currentExercise, setCurrentExercise] = useState<string | undefined>();
  const [setData, setSetData] = useState<SetData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | undefined>();
  const [allExercises, setAllExercises] = useState<ExerciseItem[]>([]);
  const [currentSetNumber, setCurrentSetNumber] = useState(1);
  const [completedExercises, setCompletedExercises] = useState<ExerciseData[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchExercises = async () => {
      const userUid = FIREBASE_AUTH.currentUser?.uid;
      const fetchedExercises: ExerciseItem[] = [...basicExercises];
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'exercises'));
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ExerciseItem;
        if (data.userId === userUid) {
          fetchedExercises.push({ id: doc.id, name: data.name });
        }
      });
      const docRef = doc(FIRESTORE_DB, 'routines', routineId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const routineData = docSnap.data();
        const routineExercises = routineData.exercises;
        const filteredExercises = fetchedExercises.filter(exercise => routineExercises.includes(exercise.name));
        setAllExercises(filteredExercises);
        if (filteredExercises.length > 0) {
          setSelectedExercise(filteredExercises[0].name); // dfault to first exercise
        }
      }
    };

    fetchExercises();

    if (autoStart) {
      handleStartWorkout();
    }
  }, [routineId, autoStart]);

  const handleStartWorkout = () => {
    setIsWorkoutStarted(true);
    setWorkoutData({ ...workoutData, startTime: new Date() });
  };

  const handleAddSet = () => {
    const newSet: SetData = {
      setNumber: currentSetNumber,
      weight: '',
      reps: '',
      comment: '',
    };
    setSetData([...setData, newSet]);
    setCurrentSetNumber(currentSetNumber + 1);
  };

  const handleEndExercise = () => {
    const newExercise: ExerciseData = { exercise: currentExercise!, sets: setData };
    setWorkoutData(prevData => ({
      ...prevData,
      exercises: [...prevData.exercises, newExercise]
    }));
    setCompletedExercises([...completedExercises, newExercise]);
    setSetData([]);
    setCurrentSetNumber(1);
    setCurrentExercise(undefined);
  };

  const handleEndWorkout = async () => {
    Alert.alert(
      'Confirm End Workout',
      'Are you sure you want to end the workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Workout',
          style: 'destructive',
          onPress: async () => {
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
          },
        },
      ]
    );
  };

  const handleSetChange = (index: number, field: keyof SetData, value: string) => {
    const updatedSets = [...setData];
    (updatedSets[index][field] as string) = value;
    setSetData(updatedSets);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.background}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Workout</Text>
        {!isWorkoutStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        ) : (
          <>
            {!currentExercise ? (
              <>
                <Text style={styles.labelText}>Select Exercise:</Text>
                <Picker
                  selectedValue={selectedExercise}
                  onValueChange={(itemValue: string) => setSelectedExercise(itemValue)}
                  style={styles.picker}
                >
                  {allExercises.map(exercise => (
                    <Picker.Item key={exercise.id} label={exercise.name} value={exercise.name} />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.startExerciseButton}
                  onPress={() => {
                    setCurrentExercise(selectedExercise);
                    setSelectedExercise(undefined);
                  }}
                >
                  <Text style={styles.startExerciseButtonText}>Start Exercise</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>Exercise: {currentExercise}</Text>
                {setData.map((item, index) => (
                  <View style={styles.setContainer} key={index}>
                    <Text style={styles.setText}>Set {item.setNumber}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Weight"
                      placeholderTextColor="#999"
                      value={item.weight}
                      onChangeText={(text) => handleSetChange(index, 'weight', text)}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Reps"
                      placeholderTextColor="#999"
                      value={item.reps}
                      onChangeText={(text) => handleSetChange(index, 'reps', text)}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Comment"
                      placeholderTextColor="#999"
                      value={item.comment}
                      onChangeText={(text) => handleSetChange(index, 'comment', text)}
                    />
                  </View>
                ))}
                <TouchableOpacity style={styles.addButton} onPress={handleAddSet}>
                  <Text style={styles.addButtonText}>Add Set</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.endExerciseButton} onPress={handleEndExercise}>
                  <Text style={styles.endExerciseButtonText}>End Exercise</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.endButton} onPress={handleEndWorkout}>
              <Text style={styles.endButtonText}>End Workout</Text>
            </TouchableOpacity>
            {completedExercises.length > 0 && (
              <View style={styles.completedExercisesContainer}>
                <Text style={styles.completedExercisesTitle}>Completed Exercises:</Text>
                {completedExercises.map((exercise, index) => (
                  <Text key={index} style={styles.completedExerciseText}>
                    {exercise.exercise}: {exercise.sets.length} sets
                  </Text>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  picker: {
    width: '100%',
    height: 50,
    color: 'white',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 16,
  },
  startButton: {
    width: '100%',
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
  startExerciseButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  startExerciseButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  setContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    width: '100%',
  },
  setText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#1e1e1e',
    fontSize: 16,
    color: 'white',
  },
  addButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  endExerciseButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 8,
  },
  endExerciseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  endButton: {
    width: '100%',
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
  completedExercisesContainer: {
    marginTop: 16,
  },
  completedExercisesTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completedExerciseText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
});

export default StartWorkout;
