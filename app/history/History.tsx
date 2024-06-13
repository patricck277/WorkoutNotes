import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { RootStackParamList } from '../../App';

type HistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'History'>;

type WorkoutItem = {
  id: string;
  routineId: string;
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
    querySnapshot.forEach(doc => {
      const data = doc.data();
      fetchedWorkouts.push({
        id: doc.id,
        routineId: data.routineId,
        startTime: data.startTime.toDate().toISOString(),
        endTime: data.endTime.toDate().toISOString(),
      });
    });
    setWorkouts(fetchedWorkouts);
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [])
  );

  const renderWorkout = ({ item }: { item: WorkoutItem }) => (
    <View style={styles.workoutContainer}>
      <Text style={styles.workoutText}>Routine ID: {item.routineId}</Text>
      <Text style={styles.workoutText}>Start Time: {new Date(item.startTime).toLocaleString()}</Text>
      <Text style={styles.workoutText}>End Time: {new Date(item.endTime).toLocaleString()}</Text>
    </View>
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
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -100 }],
    width: 200,
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  calendarButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default History;
