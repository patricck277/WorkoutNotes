import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { RootStackParamList } from '../../App';

type MainScreenNavigationProp = NavigationProp<RootStackParamList, 'Main'>;

type RoutineItem = {
  id: string;
  name: string;
  label: string;
  labelColor: string;
  exercises: string[];
};

const Main = () => {
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const navigation = useNavigation<MainScreenNavigationProp>();

  const fetchRoutines = async () => {
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    const q = query(collection(FIRESTORE_DB, 'routines'), where('userId', '==', userUid));
    const querySnapshot = await getDocs(q);
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

  const renderRoutine = ({ item }: { item: RoutineItem }) => (
    <TouchableOpacity style={styles.routineContainer} onPress={() => navigation.navigate('RoutineDetails', { routineId: item.id })}>
      <View style={styles.routineHeader}>
        <Text style={[styles.routineLabel, { backgroundColor: item.labelColor }]}>{item.label}</Text>
        <Text style={styles.routineName}>{item.name}</Text>
      </View>
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
    paddingBottom: 100,
  },
  routineContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routineLabel: {
    borderRadius: 50,
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  routineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  routineExercises: {
    fontSize: 18,
    color: 'white',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -100 }],
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
