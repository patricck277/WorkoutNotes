import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { signInWithEmailAndPassword, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { RootStackParamList } from '../../App';

type SignInScreenNavigationProp = NavigationProp<RootStackParamList, 'SignIn'>;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication) {
        const credential = FacebookAuthProvider.credential(authentication.accessToken);
        signInWithCredential(FIREBASE_AUTH, credential)
          .then(userCredential => {
            navigation.navigate('Main' as never);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }, [response]);

  const handleSignIn = () => {
    signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then(userCredential => {
        navigation.navigate('Main' as never);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Image source={require('../../assets/WorkoutNotes_Logo.png')} style={styles.logo} />
        <Text style={styles.title}>Workout Notes</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.facebookButton]} onPress={() => promptAsync()}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' }}
            style={styles.facebookIcon}
          />
          <Text style={styles.buttonText}>Sign In with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black', // Set background color to grey
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -50, // Adjust this value to move everything up
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 13,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#fff', // change to white for better contrast with dark overlay
  },
  subtitle: {
    fontSize: 20,
    color: '#fff', // change to white for better contrast with dark overlay
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    marginBottom: 16,
    flexDirection: 'row',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  facebookIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  link: {
    fontSize: 16,
    color: '#007bff',
  },
});

export default SignIn;
