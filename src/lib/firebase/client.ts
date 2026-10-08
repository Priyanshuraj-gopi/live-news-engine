import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { User, UserRole } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoFakeApiKeyForOffline12345",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "newsengine-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "newsengine-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "newsengine-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

// Singleton initialization
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user, "reader");
  return result.user;
}

export async function signInAsGuest(): Promise<FirebaseUser> {
  const result = await signInAnonymously(auth);
  await ensureUserProfile(result.user, "reader", true);
  return result.user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export async function ensureUserProfile(
  fbUser: FirebaseUser,
  defaultRole: UserRole = "reader",
  isGuest = false
): Promise<User> {
  const userRef = doc(db, "users", fbUser.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as User;
    }
  } catch (err) {
    console.warn("Firestore getDoc fallback for user profile:", err);
  }

  const newUser: User = {
    id: fbUser.uid,
    email: fbUser.email || (isGuest ? `guest_${fbUser.uid.slice(0, 6)}@newsengine.local` : "reader@newsengine.com"),
    displayName: fbUser.displayName || (isGuest ? `Guest Reader ${fbUser.uid.slice(0, 4)}` : "Verified Reader"),
    photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
    role: defaultRole,
    credibilityLevel: 1,
    createdAt: Date.now(),
  };

  try {
    await setDoc(userRef, newUser, { merge: true });
  } catch (err) {
    console.warn("Firestore setDoc fallback for user profile:", err);
  }

  return newUser;
}
