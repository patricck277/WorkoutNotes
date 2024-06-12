import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type UpdateMeasurementsScreenNavigationProp = NavigationProp<RootStackParamList, 'UpdateMeasurements'>;

const UpdateMeasurements = () => {
  const [newMeasurements, setNewMeasurements] = useState([
    { name: 'Chest', value: '' },
    { name: 'Biceps (left)', value: '' },
    { name: 'Biceps (right)', value: '' },
    { name: 'Thigh (left)', value: '' },
    { name: 'Thigh (right)', value: '' },
    { name: 'Waist', value: '' },
    { name: 'Hips', value: '' },
  ]);
  const navigation = useNavigation<UpdateMeasurementsScreenNavigationProp>();

  const handleSaveMeasurements = async () => {
    const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const newMeasurementData = {
      date,
      measurements: newMeasurements,
    };

    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (userUid) {
      await setDoc(doc(FIRESTORE_DB, 'users', userUid), { measurements: newMeasurementData }, { merge: true });
    }

    navigation.navigate('Profile', { updatedMeasurements: newMeasurementData });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" />
      {newMeasurements.map((measurement, index) => (
        <View key={measurement.name} style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{measurement.name}</Text>
          <TextInput
            style={styles.input}
            value={measurement.value}
            onChangeText={(text) => {
              const updatedMeasurements = [...newMeasurements];
              updatedMeasurements[index].value = text;
              setNewMeasurements(updatedMeasurements);
            }}
            keyboardType="numeric"
            placeholder="Enter value"
            placeholderTextColor="#999"
          />
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeasurements}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1e1e1e',
    fontSize: 16,
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateMeasurements;
