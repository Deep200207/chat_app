// auth.js
import { auth, googleProvider } from "../FireBase";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User:", user.displayName, user.email, user.photoURL);
    return user;
  } catch (error) {
    console.error("Login error:", error.message);
  }
};
export const signInWithGoogleRedirect = () => {
  signInWithRedirect(auth, googleProvider);
};
export const handleRedirectResult = async () => {
  const result = await getRedirectResult(auth);
  if (result) return result.user;
};
export const logOut = async () => {
  await signOut(auth);
  console.log("User signed out");
};
export const listenToAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};