import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD8L86KAfCrkrVLC3fNCHWXTnWaKuNFqek",
  authDomain: "my-web-app-ef23f.firebaseapp.com",
  projectId: "my-web-app-ef23f",
  storageBucket: "my-web-app-ef23f.firebasestorage.app",
  messagingSenderId: "378141226035",
  appId: "1:378141226035:web:0c5155b70ff36d7ecd1f46",
  measurementId: "G-Z5M74Y22D1",
  databaseURL:
    "https://my-web-app-ef23f-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const database = getDatabase(app);