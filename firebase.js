import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFR9EzIQ9O6UAZpbURCC9VlyFqpifNJz0",
  authDomain: "leodiary-app-6eff0.firebaseapp.com",
  projectId: "leodiary-app-6eff0",
  storageBucket: "leodiary-app-6eff0.firebasestorage.app",
  messagingSenderId: "584697796566",
  appId: "1:584697796566:web:a2d7e223c20b5bef5d3677",
  measurementId: "G-8WQVR40LV8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
