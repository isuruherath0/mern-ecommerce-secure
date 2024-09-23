// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtvuhYmDLY9s2lHpN7GkEmyB55VBNOF6w",
    authDomain: "clothify-web-app.firebaseapp.com",
    projectId: "clothify-web-app",
    storageBucket: "clothify-web-app.appspot.com",
    messagingSenderId: "67944257580",
    appId: "1:67944257580:web:7f17f9f572755f6d239989"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);