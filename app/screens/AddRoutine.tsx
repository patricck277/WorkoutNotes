import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { RootStackParamList } from '../../App';
import { Picker } from '@react-native-picker/picker';
import { ExerciseItem, basicExercises } from '../exercises/basicExercises';
import { MaterialIcons } from '@expo/vector-icons';

type AddRoutineScreenNavigationProp = NavigationProp<RootStackParamList, 'AddRoutine'>;

const AddRoutine = () => {
  const [routineName, setRoutineName] = useState('');
  const [label, setLabel] = useState('Mon'); // Default to first label
  const [labelColor, setLabelColor] = useState('#007bff'); // Default color
  const [exercises, setExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | undefined>(undefined);
  const [allExercises, setAllExercises] = useState<ExerciseItem[]>([]);
  const navigation = useNavigation<AddRoutineScreenNavigationProp>();

  useEffect(() => {
    const fetchExercises = async () => {
      const userUid = FIREBASE_AUTH.currentUser?.uid;
      if (!userUid) return;

      const fetchedExercises: ExerciseItem[] = [...basicExercises];
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'exercises'));

      querySnapshot.forEach(doc => {
        const data = doc.data() as ExerciseItem;
        if (data.userId === userUid) {
          fetchedExercises.push({ id: doc.id, name: data.name });
        }
      });
      setAllExercises(fetchedExercises);
      if (fetchedExercises.length > 0) {
        setSelectedExercise(fetchedExercises[0].name); // default to first exercise
      }
    };

    fetchExercises();
  }, []);

  const handleAddExercise = () => {
    if (selectedExercise) {
      setExercises([...exercises, selectedExercise]);
      setSelectedExercise(undefined);
    }
  };

  const handleAddRoutine = async () => {
    if (routineName.length < 4) {
      Alert.alert('Validation Error', 'Routine Name must be at least 4 characters long.');
      return;
    }

    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    try {
      await addDoc(collection(FIRESTORE_DB, 'routines'), {
        name: routineName,
        label: label,
        labelColor: labelColor,
        exercises: exercises,
        userId: userUid,
      });
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error adding routine: ', error);
    }
  };

  const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];

  return (
    <ScrollView contentContainerStyle={styles.background}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Add Routine</Text>
      <TextInput
        placeholder="Routine Name (Min. 4 characters)"
        value={routineName}
        onChangeText={setRoutineName}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <Text style={styles.labelText}>Select Label:</Text>
      <Picker
        selectedValue={label}
        onValueChange={(itemValue: string) => setLabel(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Mon" value="Mon" />
        <Picker.Item label="Tue" value="Tue" />
        <Picker.Item label="Wed" value="Wed" />
        <Picker.Item label="Thu" value="Thu" />
        <Picker.Item label="Fri" value="Fri" />
        <Picker.Item label="Sat" value="Sat" />
        <Picker.Item label="Sun" value="Sun" />
        <Picker.Item label="WO" value="WO" />
      </Picker>
      <Text style={styles.labelText}>Select Label Color:</Text>
      <View style={styles.colorContainer}>
        {colors.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => setLabelColor(color)}
          >
            {labelColor === color && (
              <MaterialIcons name="check" size={24} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.labelText}>Select Exercise:</Text>
      <Picker
        selectedValue={selectedExercise}
        onValueChange={(itemValue: string) => setSelectedExercise(itemValue || undefined)}
        style={styles.picker}
      >
        {allExercises.map(exercise => (
          <Picker.Item key={exercise.id} label={exercise.name} value={exercise.name} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>
      {exercises.length > 0 && (
        <View style={styles.exercisesContainer}>
          <Text style={styles.exercisesTitle}>Selected Exercises:</Text>
          {exercises.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>{exercise}</Text>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.saveButton} onPress={handleAddRoutine}>
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
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
    fontSize: 16,
    color: 'white',
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
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  exerciseText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: '#007bff',
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

export default AddRoutine;
