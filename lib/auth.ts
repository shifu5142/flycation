import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/services/auth/firebaseConfig";
import { supabase } from "@/app/services/supabase/client";

export async function registerUser(first_name: string, last_name: string, email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      first_name,
      last_name,
      email,
      createdAt: Date.now(),
    });

    const { error } = await supabase.from("users").insert({
      id: auth.currentUser?.uid ?? user.uid,
      first_name,
      last_name,
      email,
    });

    if (error) {
      throw new Error(error.message);
    }

    return user;
  } catch (error: any) {
    console.error(error.code, error.message);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error(error.code, error.message);
    throw error;
  }
}

export async function getUserProfile(uid: string) {
  try {
    const snapshot = await getDoc(doc(db, "users", uid));
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error: any) {
    console.error(error.code, error.message);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error(error.code, error.message);
    throw error;
  }
}
