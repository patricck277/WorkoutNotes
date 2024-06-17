import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Collapsible from 'react-native-collapsible';

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
  startTime: Date;
  endTime: Date;
};

type Measurement = {
  name: string;
  value: string;
};

type MeasurementData = {
  date: string;
  measurements: Measurement[];
};

const Statistics = () => {
  const [measurementData, setMeasurementData] = useState<{ [key: string]: number[] }>({});
  const [dates, setDates] = useState<string[]>([]);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [activeSections, setActiveSections] = useState<{ [key: string]: boolean }>({
    measurementStats: false,
    workoutStats: false,
    exerciseStats: false,
  });

  useEffect(() => {
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    const measurementsCollection = collection(FIRESTORE_DB, 'users', userUid, 'measurements');
    const measurementsQuery = query(measurementsCollection);
    const unsubscribeMeasurements = onSnapshot(measurementsQuery, (snapshot) => {
      const measurementData: MeasurementData[] = [];
      snapshot.forEach(doc => {
        measurementData.push(doc.data() as MeasurementData);
      });

      // Sort data by date
      measurementData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Extract dates and measurements
      const dates = measurementData.map(md => md.date);
      const measurements = measurementData.reduce((acc, md) => {
        md.measurements.forEach((measurement: Measurement) => {
          if (!acc[measurement.name]) {
            acc[measurement.name] = [];
          }
          acc[measurement.name].push(parseFloat(measurement.value));
        });
        return acc;
      }, {} as { [key: string]: number[] });

      setDates(dates);
      setMeasurementData(measurements);
    });

    const workoutsQuery = query(collection(FIRESTORE_DB, 'workouts'), where('userId', '==', userUid));
    const unsubscribeWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
      const fetchedWorkouts: WorkoutData[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        fetchedWorkouts.push({
          exercises: data.exercises,
          startTime: data.startTime.toDate(),
          endTime: data.endTime.toDate(),
        } as WorkoutData);
      });
      setWorkoutData(fetchedWorkouts);
    });

    // Clean up subscriptions on unmount
    return () => {
      unsubscribeMeasurements();
      unsubscribeWorkouts();
    };
  }, []);

  const toggleSection = (section: string) => {
    setActiveSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const calculateAverageWeight = (exerciseName: string) => {
    let totalWeight = 0;
    let count = 0;

    workoutData.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.exercise === exerciseName) {
          exercise.sets.forEach(set => {
            totalWeight += parseFloat(set.weight);
            count += 1;
          });
        }
      });
    });

    return count > 0 ? totalWeight / count : 0;
  };

  const calculateTotalReps = (exerciseName: string) => {
    let totalReps = 0;

    workoutData.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.exercise === exerciseName) {
          exercise.sets.forEach(set => {
            totalReps += parseFloat(set.reps);
          });
        }
      });
    });

    return totalReps;
  };

  const calculateWorkoutDurations = () => {
    return workoutData.map(workout => {
      const duration = (workout.endTime.getTime() - workout.startTime.getTime()) / (1000 * 60); // duration in minutes
      return duration;
    });
  };

  const chartConfig = {
    backgroundColor: '#000',
    backgroundGradientFrom: '#1e2923',
    backgroundGradientTo: '#08130d',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Statistics</Text>

      <TouchableOpacity onPress={() => toggleSection('measurementStats')} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Measurement Statistics</Text>
      </TouchableOpacity>
      <Collapsible collapsed={!activeSections.measurementStats}>
        {Object.keys(measurementData).map((key, index) => (
          <View key={index}>
            <Text style={styles.chartTitle}>{key}</Text>
            <LineChart
              data={{
                labels: dates,
                datasets: [
                  {
                    data: measurementData[key],
                  },
                ],
              }}
              width={Dimensions.get('window').width - 16}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        ))}
      </Collapsible>

      <TouchableOpacity onPress={() => toggleSection('workoutStats')} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Workout Durations</Text>
      </TouchableOpacity>
      <Collapsible collapsed={!activeSections.workoutStats}>
        <BarChart
          data={{
            labels: workoutData.map(workout => new Date(workout.startTime).toLocaleDateString()),
            datasets: [
              {
                data: calculateWorkoutDurations(),
              },
            ],
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel=""
          yAxisSuffix="m"
          style={styles.chart}
        />
      </Collapsible>

      <TouchableOpacity onPress={() => toggleSection('exerciseStats')} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Exercise Statistics</Text>
      </TouchableOpacity>
      <Collapsible collapsed={!activeSections.exerciseStats}>
        {Array.from(new Set(workoutData.flatMap(workout => workout.exercises.map(ex => ex.exercise)))).map((exerciseName, index) => (
          <View key={index}>
            <Text style={styles.chartTitle}>{exerciseName} - Average Weight</Text>
            <Text style={styles.chartValue}>{calculateAverageWeight(exerciseName).toFixed(2)} kg</Text>
            <Text style={styles.chartTitle}>{exerciseName} - Total Reps</Text>
            <Text style={styles.chartValue}>{calculateTotalReps(exerciseName)}</Text>
          </View>
        ))}
      </Collapsible>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  sectionHeader: {
    width: '100%',
    padding: 16,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
  chartValue: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Statistics;
