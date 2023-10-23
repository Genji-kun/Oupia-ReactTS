import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCIW7pM3yhbOywrot9_JELsfU5ZrlAziGQ",
  authDomain: "oupia-aed75.firebaseapp.com",
  projectId: "oupia-aed75",
  storageBucket: "oupia-aed75.appspot.com",
  messagingSenderId: "358294480804",
  appId: "1:358294480804:web:da0ac9017b03ba0c18c331"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export default firebaseApp;
export { auth };