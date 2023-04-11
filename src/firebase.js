// Import the necessary modules
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup
} from "firebase/auth";
import { 
  collection, 
  getDoc , 
  getDocs, 
  getFirestore, 
  query, 
  orderBy, 
  where, 
  doc, 
  setDoc,
  onSnapshot,
  updateDoc,
  addDoc
} from "firebase/firestore";

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
const provider = new GoogleAuthProvider();

const questionsCollectionRef = collection(db, "questions");

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    sessionStorage.setItem("username", user.displayName);
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
}

// function to sign is a user anonymously
async function guestSignIn(name) {
  signInAnonymously(auth)
  .then((userCredential) => {
    const { uid } = userCredential.user;
    const userRef = doc(db, "users", uid);
    setDoc(userRef, {
      name,
      authProvider: "guest"
    })
      .then(() => {
        sessionStorage.setItem("username", name);
      })
      .catch((error) => {
        console.error("Error adding user to collection: ", error);
      });
  })
  .catch((error) => {
    console.error("Error registering user: ", error);
  });
}

// function that handles custom authentication
const authenticateUser = async (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const user = userCredential.user;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if(docSnap.exists()) {
      const username = docSnap.data().username;
      sessionStorage.setItem("username", username);
    }
    console.log("User signed in.");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, ": ", errorMessage);
  });
};

// function that signs the user out
const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    // Remove user from session storage
    window.sessionStorage.clear();
  } catch (error) {
    console.error("Error signing user out:", error);
  }
};

// function that registers a new user
const registerUser = async (email, password, username) => {
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const { uid } = userCredential.user;
    const userRef = doc(db, "users", uid);
    setDoc(userRef, {
      email,
      username,
      authProvider: "custom"
    })
      .then(() => {
        sessionStorage.setItem("username", username);
      })
      .catch((error) => {
        console.error("Error adding user to collection: ", error);
      });
  })
  .catch((error) => {
    console.error("Error registering user: ", error);
  });
};

// Create a function that adds a new game to the 'GameId' collection
const addGame = async (category, numOfQuestions) => {
  const access = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number for access code
  const userEmail = auth.currentUser.email; // Get the email of the user currently logged in
  try {
    await setDoc(doc(db, "GameId", access), {
      access,
      category,
      createdBy: userEmail,
      numOfQuestions
    });
    console.log("Document written with ID: ", access);
    return access;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};


export {
  auth,
  createUserWithEmailAndPassword, 
  authenticateUser, 
  collection,
  signOutUser, 
  registerUser, 
  onAuthStateChanged,
  db, 
  doc,
  getDocs,
  getDoc, 
  questionsCollectionRef, 
  query, 
  orderBy, 
  where,
  signInWithGoogle,
  guestSignIn,
  onSnapshot,
  updateDoc,
  setDoc,
  addDoc,
  addGame // Add this line to export the addGame function
};