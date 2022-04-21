import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPIbH5k2ub9U5bGlKchbVs3TFMzfynDv0",
  authDomain: "city-super-market.firebaseapp.com",
  projectId: "city-super-market",
  storageBucket: "city-super-market.appspot.com",
  messagingSenderId: "668623779128",
  appId: "1:668623779128:web:9ad0d1a25de5e0dbb77dcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);