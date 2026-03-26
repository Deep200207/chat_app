import {initializeApp} from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmIsBJpOttKUuXGM3l_fa1DuwaKTzLpII",
  authDomain: "chat-41b71.firebaseapp.com",
  projectId: "chat-41b71",
  storageBucket: "chat-41b71.firebasestorage.app",
  messagingSenderId: "1031859176555",
  appId: "1:1031859176555:web:6ae0d12b9ee7a6b42a1d2e"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();