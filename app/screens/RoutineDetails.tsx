import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  FlatList,
} from 'react-native';
import {
  useNavigation,
  RouteProp,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { RootStackParamList } from '../../App';

type RoutineDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'RoutineDetails'
>;

type Props = {
  route: RoutineDetailsScreenRouteProp;
};

const RoutineDetails = ({ route }: Props) => {
  const { routineId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [routine, setRoutine] = useState<any>(null);

  const fetchRoutine = async () => {
    const docRef = doc(FIRESTORE_DB, 'routines', routineId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setRoutine(docSnap.data());
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRoutine();
    }, [routineId])
  );

  const handleDeleteRoutine = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this routine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDoc(doc(FIRESTORE_DB, 'routines', routineId));
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!routine) {
    return (
      <View style={styles.background}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Routine Details</Text>
      <FlatList
        data={routine.exercises}
        renderItem={({ item }) => (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseText}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.exerciseList}
      />
      <TouchableOpacity
        style={styles.startButton}
        onPress={() =>
          navigation.navigate('StartWorkout', { routineId, autoStart: true })
        }
      >
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditRoutine', { routineId })}
      >
        <Text style={styles.editButtonText}>Edit Routine</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteRoutine}
      >
        <Text style={styles.deleteButtonText}>Delete Routine</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  exerciseList: {
    paddingBottom: 16,
  },
  exerciseContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  exerciseText: {
    fontSize: 18,
    color: 'white',
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
  },
  startButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
  },
  editButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RoutineDetails;
