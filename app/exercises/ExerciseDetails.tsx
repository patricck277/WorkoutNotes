import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

type ExerciseDetailsRouteProp = RouteProp<RootStackParamList, 'ExerciseDetails'>;

const ExerciseDetails = () => {
  const route = useRoute<ExerciseDetailsRouteProp>();
  const { name, description, imageUrl, id } = route.params;
  const navigation = useNavigation();

  const handleDeleteExercise = async () => {
    if (id) {
      try {
        await deleteDoc(doc(FIRESTORE_DB, 'exercises', id));
        navigation.goBack();
      } catch (error) {
        console.error('Error deleting exercise: ', error);
      }
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this exercise?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: handleDeleteExercise,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <Text style={styles.description}>{description}</Text>
      {id && (
        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Text style={styles.deleteButtonText}>Delete Exercise</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExerciseDetails;
