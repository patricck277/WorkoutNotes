import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

//Firebase - kodWEB
const firebaseConfig = {
    apiKey: "AIzaSyArdDKPtN9_ixSDfMcmawTnC6D79-o0Vhk",
    authDomain: "workout-notes-7a343.firebaseapp.com",
    projectId: "workout-notes-7a343",
    storageBucket: "workout-notes-7a343.appspot.com",
    messagingSenderId: "828603558193",
    appId: "1:828603558193:web:b03585fc6ef17981a0e810",
    measurementId: "G-1GTW1LWCP2"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);