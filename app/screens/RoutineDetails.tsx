import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type RoutineDetailsScreenRouteProp = RouteProp<RootStackParamList, 'RoutineDetails'>;

type Props = {
  route: RoutineDetailsScreenRouteProp;
};

const RoutineDetails = ({ route }: Props) => {
  const { routineId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Routine Details</Text>
      {/* Render routine details here */}
      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('StartWorkout', { routineId })}>
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  startButton: {
    width: 200,
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  startButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RoutineDetails;
