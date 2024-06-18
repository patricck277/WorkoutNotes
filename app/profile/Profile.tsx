import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { RootStackParamList, MeasurementData } from '../../App';

type ProfileScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'Profile'
>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type Measurement = {
  name: string;
  value: string;
};

const Profile = () => {
  const [measurements, setMeasurements] = useState<MeasurementData | null>(
    null
  );
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
      saveMeasurements(route.params.updatedMeasurements);
    } else {
      fetchMeasurements();
    }
  }, [route.params?.updatedMeasurements]);

  const saveMeasurements = async (measurements: MeasurementData) => {
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    if (!userUid) return;

    const docRef = doc(FIRESTORE_DB, 'users', userUid);
    await setDoc(docRef, { latestMeasurements: measurements }, { merge: true });
  };

  const handleSignOut = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        navigation.navigate('SignIn');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderMeasurement = ({ item }: { item: Measurement }) => {
    let unit = 'cm';
    if (item.name === 'Weight') {
      unit = 'kg';
    }
    return (
      <View style={styles.measurementContainer}>
        <Text style={styles.measurementText}>
          {item.name}: {item.value} {unit}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {measurements ? (
          <>
            <Text style={styles.dateText}>
              Measurements from: {measurements.date}
            </Text>
            <FlatList
              data={measurements.measurements}
              renderItem={renderMeasurement}
              keyExtractor={(item) => item.name}
              style={styles.measurementList}
              contentContainerStyle={styles.measurementListContent}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('UpdateMeasurements')}
            >
              <Text style={styles.buttonText}>New Measurements</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('EditMeasurements', { measurements })
              }
            >
              <Text style={styles.buttonText}>Edit Measurements</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('UpdateMeasurements')}
          >
            <Text style={styles.buttonText}>Update Measurements</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    marginTop: 'auto',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  measurementList: {
    width: '100%',
  },
  measurementListContent: {
    paddingBottom: 20,
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
});

export default Profile;
