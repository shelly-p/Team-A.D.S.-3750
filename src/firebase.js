// Import the necessary modules
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAKPql_YnibnGkJPQper-xxGPbnnyHJ2CA",
  authDomain: "triviads-31954.firebaseapp.com",
  projectId: "triviads-31954",
  storageBucket: "triviads-31954.appspot.com",
  messagingSenderId: "52314723167",
  appId: "1:52314723167:web:791b8552c70f256b941cea",
  measurementId: "G-F52PV6LQ24"
};
const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
const auth = getAuth(app);

const questionsCollectionRef = collection(db, "questions");

// Create a function that handles custom authentication
const authenticateUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Authenticated user:", user);
    // Set user as authenticated in session storage
    window.sessionStorage.setItem("authenticatedUser", JSON.stringify(user));
  } catch (error) {
    console.error("Error authenticating user:", error);
  }
};

// Create a function that signs the user out
const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    // Remove user from session storage
    window.sessionStorage.removeItem("authenticatedUser");
  } catch (error) {
    console.error("Error signing user out:", error);
  }
};

// Create a function that registers a new user
const registerUser = async (emailRef, passwordRef) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailRef, passwordRef);
    const user = userCredential.user;
    console.log("Registered user:", user);
    // Set user as authenticated in session storage
    window.sessionStorage.setItem("authenticatedUser", JSON.stringify(user));
  } catch (error) {
    console.error("Error registering user:", error);
  }
};






export { auth, authenticateUser, signOutUser, registerUser, onAuthStateChanged,
   getDocs, questionsCollectionRef, query, orderBy };