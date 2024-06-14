import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { RootStackParamList } from '../../App';
import { ExerciseItem, basicExercises } from '../exercises/basicExercises';
import { Picker } from '@react-native-picker/picker';

type EditRoutineScreenRouteProp = RouteProp<RootStackParamList, 'EditRoutine'>;

type Props = {
  route: EditRoutineScreenRouteProp;
};

const EditRoutine = ({ route }: Props) => {
  const { routineId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [routine, setRoutine] = useState<any>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | undefined>();
  const [allExercises, setAllExercises] = useState<ExerciseItem[]>([]);

  useEffect(() => {
    const fetchRoutine = async () => {
      const docRef = doc(FIRESTORE_DB, 'routines', routineId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRoutine(docSnap.data());
      }
    };

    const fetchExercises = async () => {
      const fetchedExercises: ExerciseItem[] = [...basicExercises];
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'exercises'));
      querySnapshot.forEach(doc => {
        const data = doc.data() as ExerciseItem;
        fetchedExercises.push({ id: doc.id, name: data.name });
      });
      setAllExercises(fetchedExercises);
    };

    fetchRoutine();
    fetchExercises();
  }, [routineId]);

  const handleAddExercise = () => {
    if (selectedExercise && routine) {
      const updatedRoutine = { ...routine, exercises: [...routine.exercises, selectedExercise] };
      setRoutine(updatedRoutine);
      setSelectedExercise(undefined);
    }
  };

  const handleRemoveExercise = (exerciseToRemove: string) => {
    if (routine) {
      const updatedExercises = routine.exercises.filter((exercise: string) => exercise !== exerciseToRemove);
      setRoutine({ ...routine, exercises: updatedExercises });
    }
  };

  const handleSaveRoutine = async () => {
    if (routine) {
      const docRef = doc(FIRESTORE_DB, 'routines', routineId);
      await updateDoc(docRef, routine);
      navigation.navigate('RoutineDetails', { routineId });
    }
  };

  if (!routine) {
    return (
      <View style={styles.background}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.background}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Edit Routine</Text>
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>
      <View style={styles.exercisesContainer}>
        <Text style={styles.exercisesTitle}>Selected Exercises:</Text>
        {routine.exercises.map((exercise: string, index: number) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseText}>{exercise}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveExercise(exercise)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveRoutine}>
        <Text style={styles.saveButtonText}>Save Routine</Text>
      </TouchableOpacity>
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
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exercisesContainer: {
    width: '100%',
    marginBottom: 16,
  },
  exercisesTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
  },
  exerciseText: {
    fontSize: 16,
    color: 'white',
  },
  removeButton: {
    backgroundColor: '#d9534f',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditRoutine;
