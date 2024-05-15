import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { RootStackParamList } from '../../App';

type MainScreenNavigationProp = NavigationProp<RootStackParamList, 'Main'>;

const Main = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();

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
    <View>
      <Text>Home</Text>
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile' as never)} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Main;
