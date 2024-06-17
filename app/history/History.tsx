import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { RootStackParamList } from '../../App';

type HistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'History'>;

type WorkoutItem = {
  id: string;
  routineId: string;
  routineName: string;
  startTime: string;
  endTime: string;
};

const History = () => {
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const navigation = useNavigation<HistoryScreenNavigationProp>();

  const fetchWorkouts = async () => {
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    const q = query(collection(FIRESTORE_DB, 'workouts'), where('userId', '==', userUid));
    const querySnapshot = await getDocs(q);
    const fetchedWorkouts: WorkoutItem[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const routineDoc = await getDoc(doc(FIRESTORE_DB, 'routines', data.routineId));
      const routineData = routineDoc.data();

      if (routineData) {
        fetchedWorkouts.push({
          id: docSnapshot.id,
          routineId: data.routineId,
          routineName: routineData.name,
          startTime: data.startTime.toDate().toISOString(),
          endTime: data.endTime.toDate().toISOString(),
        });
      }
    }

    setWorkouts(fetchedWorkouts);
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [])
  );

  const renderWorkout = ({ item }: { item: WorkoutItem }) => (
    <TouchableOpacity
      style={styles.workoutContainer}
      onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.id })}
    >
      <Text style={styles.workoutText}>Routine: {item.routineName}</Text>
      <Text style={styles.workoutText}>Date: {new Date(item.startTime).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={workouts}
        renderItem={renderWorkout}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.workoutList}
      />
      <TouchableOpacity style={styles.calendarButton} onPress={() => navigation.navigate('Calendar')}>
        <Text style={styles.calendarButtonText}>Open Calendar</Text>
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
  workoutList: {
    paddingBottom: 100,
  },
  workoutContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  workoutText: {
    fontSize: 18,
    color: 'white',
  },
  calendarButton: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: '#007bff',
  },
  calendarButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default History;
