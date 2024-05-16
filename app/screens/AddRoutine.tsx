import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { RootStackParamList } from '../../App';

type AddRoutineScreenNavigationProp = NavigationProp<RootStackParamList, 'AddRoutine'>;

const AddRoutine = () => {
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState('');
  const navigation = useNavigation<AddRoutineScreenNavigationProp>();

  const handleAddRoutine = async () => {
    try {
      await addDoc(collection(FIRESTORE_DB, 'routines'), {
        name: routineName,
        exercises: exercises.split(',').map(exercise => exercise.trim())
      });
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error adding routine: ', error);
    }
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Add Routine</Text>
      <TextInput
        placeholder="Routine Name"
        value={routineName}
        onChangeText={setRoutineName}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Exercises (comma separated)"
        value={exercises}
        onChangeText={setExercises}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <Button title="Add" onPress={handleAddRoutine} />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
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
});

export default AddRoutine;
