import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { RootStackParamList } from '../../App';

type ProfileScreenNavigationProp = NavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleSignOut = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        navigation.navigate('SignIn');
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
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
  },
  signOutButton: {
    width: 200,
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  signOutButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;
