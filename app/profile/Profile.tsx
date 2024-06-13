import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';
import { useNavigation, NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { RootStackParamList, MeasurementData } from '../../App';

type ProfileScreenNavigationProp = NavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type Measurement = {
  name: string;
  value: string;
};

const Profile = () => {
  const [measurements, setMeasurements] = useState<MeasurementData | null>(null);
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute<ProfileScreenRouteProp>();

  const fetchMeasurements = async () => {
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    const docRef = doc(FIRESTORE_DB, 'users', userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.latestMeasurements) {
        setMeasurements(data.latestMeasurements);
      }
    }
  };

  useEffect(() => {
    if (route.params?.updatedMeasurements) {
      setMeasurements(route.params.updatedMeasurements);
    } else {
      fetchMeasurements();
    }
  }, [route.params?.updatedMeasurements]);

  const handleSignOut = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        navigation.navigate('SignIn');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderMeasurement = ({ item }: { item: Measurement }) => (
    <View style={styles.measurementContainer}>
      <Text style={styles.measurementText}>{item.name}: {item.value}</Text>
    </View>
  );

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        {measurements ? (
          <>
            <Text style={styles.dateText}>Measurements from: {measurements.date}</Text>
            <FlatList
              data={measurements.measurements}
              renderItem={renderMeasurement}
              keyExtractor={item => item.name}
              style={styles.measurementList}
            />
            <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('UpdateMeasurements')}>
              <Text style={styles.updateButtonText}>New Measurements</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('EditMeasurements', { measurements })}>
              <Text style={styles.updateButtonText}>Edit Measurements</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('UpdateMeasurements')}>
            <Text style={styles.updateButtonText}>Update Measurements</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  signOutButton: {
    width: 200,
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  signOutButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  measurementList: {
    width: '100%',
    marginBottom: 20,
  },
  measurementContainer: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  measurementText: {
    fontSize: 18,
    color: 'white',
  },
  dateText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;
