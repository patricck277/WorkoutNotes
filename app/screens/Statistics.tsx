import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

type Measurement = {
  name: string;
  value: string;
};

type MeasurementData = {
  date: string;
  measurements: Measurement[];
};

const Statistics = () => {
  const [data, setData] = useState<{ [key: string]: number[] }>({});
  const [dates, setDates] = useState<string[]>([]);

  const fetchMeasurements = async () => {
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    const measurementsCollection = collection(FIRESTORE_DB, 'users', userUid, 'measurements');
    const q = query(measurementsCollection);
    const querySnapshot = await getDocs(q);
    const measurementData: MeasurementData[] = [];
    
    querySnapshot.forEach(doc => {
      measurementData.push(doc.data() as MeasurementData);
    });

    // Sort data by date
    measurementData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Extract dates and measurements
    const dates = measurementData.map(md => md.date);
    const measurements = measurementData.reduce((acc, md) => {
      md.measurements.forEach(measurement => {
        if (!acc[measurement.name]) {
          acc[measurement.name] = [];
        }
        acc[measurement.name].push(parseFloat(measurement.value));
      });
      return acc;
    }, {} as { [key: string]: number[] });

    setDates(dates);
    setData(measurements);
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

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
      <Text style={styles.header}>Measurement Statistics</Text>
      {Object.keys(data).map((key, index) => (
        <View key={index}>
          <Text style={styles.chartTitle}>{key}</Text>
          <LineChart
            data={{
              labels: dates,
              datasets: [
                {
                  data: data[key],
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Statistics;
