import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export async function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
