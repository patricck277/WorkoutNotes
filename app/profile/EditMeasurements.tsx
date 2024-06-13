import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation, NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, MeasurementData } from '../../App';

type EditMeasurementsScreenNavigationProp = NavigationProp<RootStackParamList, 'EditMeasurements'>;
type EditMeasurementsScreenRouteProp = RouteProp<RootStackParamList, 'EditMeasurements'>;

const EditMeasurements = () => {
  const route = useRoute<EditMeasurementsScreenRouteProp>();
  const { measurements } = route.params;
  const [editedMeasurements, setEditedMeasurements] = useState(measurements.measurements);
  const navigation = useNavigation<EditMeasurementsScreenNavigationProp>();

  const handleSaveMeasurements = async () => {
    const date = new Date().toISOString().split('T')[0]; // Data  format YYYY-MM-DD
    const newMeasurementData: MeasurementData = {
      date,
      measurements: editedMeasurements,
    };

    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (userUid) {
      await addDoc(collection(FIRESTORE_DB, 'users', userUid, 'measurements'), newMeasurementData);
    }

    navigation.navigate('Main', { screen: 'Profile', params: { updatedMeasurements: newMeasurementData } } as any);
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: 'black' }}
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      <StatusBar barStyle="light-content" />
      {editedMeasurements.map((measurement, index) => (
        <View key={measurement.name} style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{measurement.name}</Text>
          <TextInput
            style={styles.input}
            value={measurement.value}
            onChangeText={(text) => {
              const updatedMeasurements = [...editedMeasurements];
              updatedMeasurements[index].value = text;
              setEditedMeasurements(updatedMeasurements);
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
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

export default EditMeasurements;
