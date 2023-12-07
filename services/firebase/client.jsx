import { firebaseConfig } from './config';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

function getFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return firebase;
}

export default getFirebase;