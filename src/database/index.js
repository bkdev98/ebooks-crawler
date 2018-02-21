import firebase from 'firebase';

import config from './config';

firebase.initializeApp(config);
const database = firebase.database();

export default database;
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const firebaseAuth = firebase.auth;
