import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect, NavigationProp, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ExerciseItem, basicExercises } from '../exercises/basicExercises';
import { RootStackParamList } from '../../App';

const Exercises = () => {
  const [exercises, setExercises] = useState<ExerciseItem[]>(basicExercises);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchUserExercises = async () => {
    try {
      const exerciseCollection = collection(FIRESTORE_DB, 'exercises');
      const userUid = FIREBASE_AUTH.currentUser?.uid;

      const q = query(
        exerciseCollection,
        where('userId', '==', userUid)
      );

      const querySnapshot = await getDocs(q);
      const fetchedExercises: ExerciseItem[] = [];
      querySnapshot.forEach(doc => {
        fetchedExercises.push({ id: doc.id, ...doc.data() } as ExerciseItem);
      });

      console.log('Fetched User Exercises:', fetchedExercises);
      setExercises([...basicExercises, ...fetchedExercises]);
    } catch (error) {
      console.error('Error fetching exercises: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserExercises();
    }, [])
  );

  const renderExercise = ({ item }: { item: ExerciseItem }) => (
    <TouchableOpacity
      style={styles.exerciseContainer}
      onPress={() => navigation.navigate('ExerciseDetails', {
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        id: item.id
      })}
    >
      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={exercises}
        renderItem={renderExercise}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.exerciseList}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExercise')}
      >
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: StatusBar.currentHeight || 0,
    padding: 16,
  },
  exerciseList: {
    paddingBottom: 100,
  },
  exerciseContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Exercises;
