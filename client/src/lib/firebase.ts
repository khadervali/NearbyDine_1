import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Add debug logging
console.log("Firebase Config Details:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "exists" : "missing",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "exists" : "missing",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? "exists" : "missing",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? "exists" : "missing"
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

try {
  console.log("Initializing Firebase with config:", JSON.stringify(firebaseConfig, null, 2));
  const app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

export const auth = getAuth();

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    console.log("Starting Google sign-in process...");
    const result = await signInWithPopup(auth, provider);
    console.log("Sign-in successful:", result.user.email);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    if (error.customData) {
      console.error("Custom data:", error.customData);
    }
    throw error;
  }
}