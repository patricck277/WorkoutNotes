import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { RootStackParamList } from '../../App';

type MainScreenNavigationProp = NavigationProp<RootStackParamList, 'Main'>;

type RoutineItem = {
  id: string;
  name: string;
  exercises: string[];
};

const Main = () => {
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const navigation = useNavigation<MainScreenNavigationProp>();

  const fetchRoutines = async () => {
    const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'routines'));
    const fetchedRoutines: RoutineItem[] = [];
    querySnapshot.forEach(doc => {
      fetchedRoutines.push({ id: doc.id, ...doc.data() } as RoutineItem);
    });
    setRoutines(fetchedRoutines);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRoutines();
    }, [])
  );

  const handleSignOut = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        navigation.navigate('SignIn');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderRoutine = ({ item }: { item: RoutineItem }) => (
    <TouchableOpacity style={styles.routineContainer} onPress={() => navigation.navigate('RoutineDetails', { routineId: item.id })}>
      <Text style={styles.routineDay}>{item.name}</Text>
      <Text style={styles.routineExercises}>{item.exercises.join(', ')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={routines}
        renderItem={renderRoutine}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.routineList}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddRoutine')}>
        <Text style={styles.addButtonText}>Add Routine</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: StatusBar.currentHeight || 0,
  },
  routineList: {
    paddingBottom: 100, // Ensure space for the add button
  },
  routineContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  routineDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  routineExercises: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -100 }], // Center the button horizontally
    width: 200,
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  addButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Main;
