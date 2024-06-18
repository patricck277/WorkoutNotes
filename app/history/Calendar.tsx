import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Calendar } from 'react-native-calendars';

type WorkoutItem = {
  id: string;
  routineId: string;
  startTime: string;
  endTime: string;
};

const CalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  const fetchWorkouts = async () => {
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    const q = query(
      collection(FIRESTORE_DB, 'workouts'),
      where('userId', '==', userUid)
    );
    const querySnapshot = await getDocs(q);
    const fetchedWorkouts: WorkoutItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fetchedWorkouts.push({
        id: doc.id,
        routineId: data.routineId,
        startTime: data.startTime.toDate().toISOString(),
        endTime: data.endTime.toDate().toISOString(),
      });
    });

    const dates = fetchedWorkouts.reduce(
      (acc: { [key: string]: any }, workout) => {
        const date = workout.startTime.split('T')[0];
        acc[date] = {
          customStyles: {
            container: {
              backgroundColor: 'red',
              borderRadius: 15,
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        };
        return acc;
      },
      {}
    );

    setMarkedDates(dates);
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [])
  );

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        theme={{
          calendarBackground: 'black',
          textSectionTitleColor: 'white',
          dayTextColor: 'white',
          todayTextColor: '#00adf5',
          monthTextColor: 'white',
          indicatorColor: 'white',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: StatusBar.currentHeight || 0,
  },
});

export default CalendarScreen;
