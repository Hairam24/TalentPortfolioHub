import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Mock data for demonstration purposes when Firebase is not available
export const mockWorkData = [];
export const mockTalentData = [];
export const mockProjectData = [];

// Initialize Firebase variables
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
let initialized = false;

export function initializeFirebase() {
  if (!initialized) {
    try {
      // Only initialize if we have valid Firebase credentials
      if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        storage = getStorage(app);
        auth = getAuth(app);
        console.log("Firebase initialized successfully");
      } else {
        console.warn("Firebase configuration is incomplete. Running in demo mode with limited functionality.");
        // We'll use mock data instead of Firebase in this case
      }
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      // Fall back to mock data
    } finally {
      // Mark as initialized regardless of success/failure
      initialized = true;
    }
  }
  
  return { app, db, storage, auth };
}

// Export Firebase services
export { app, db, storage, auth };

// A function to create demo data if needed for development
export async function seedDemoData() {
  // This function would be used to seed the database with demo data
  // It would only be called in development mode and if specifically requested
  console.log("Seeding demo data functionality is available but not automatically executed");
}
