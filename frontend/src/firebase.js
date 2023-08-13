// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChB_lrOI-muB8z0LFQYQjZyVb2eNkju1s",
  authDomain: "topcarefashion-59a4e.firebaseapp.com",
  projectId: "topcarefashion-59a4e",
  storageBucket: "topcarefashion-59a4e.appspot.com",
  messagingSenderId: "333792591752",
  appId: "1:333792591752:web:877c7fac7ec9df84db443d",
  measurementId: "G-0X2BFHBPSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
