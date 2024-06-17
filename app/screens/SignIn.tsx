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
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '1:828603558193:web:b03585fc6ef17981a0e810',
    redirectUri: 'https://workout-notes-7a343.firebaseapp.com/__/auth/handler'
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
            setErrorMessage('Error signing in with Facebook.');
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
        setErrorMessage('Invalid email or password.');
      });
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Image source={require('../../assets/WorkoutNotes_Logo.png')} style={styles.logo} />
        <Text style={styles.title}>Workout Notes</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -50,
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
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 32,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
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
