import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyChB_lrOI-muB8z0LFQYQjZyVb2eNkju1s",
  authDomain: "topcarefashion-59a4e.firebaseapp.com",
  projectId: "topcarefashion-59a4e",
  databaseURL: "https://topcarefashion-59a4e-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "topcarefashion-59a4e.appspot.com",
  messagingSenderId: "333792591752",
  appId: "1:333792591752:web:877c7fac7ec9df84db443d",
  measurementId: "G-0X2BFHBPSP"
};

// Initialize Firebase
const Fire = initializeApp(firebaseConfig);

export default Fire;