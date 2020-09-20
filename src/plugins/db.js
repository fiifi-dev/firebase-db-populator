import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";

//put project settings here
firebase.initializeApp({});

let getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();
const Timestamp = firebase.firestore.Timestamp;

const { GeoPoint, FieldValue } = firebase.firestore;

export {
  getCurrentUser,
  db,
  auth,
  storage,
  functions,
  Timestamp,
  GeoPoint,
  FieldValue,
};
