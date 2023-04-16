import { useState, useContext, createContext, useEffect } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  signInWithEmailAndPassword,
  getDoc,
  getDocs,
  query,
  collection,
  where,
  signOutUser,
  signInWithPopup,
  provider
} from "../firebase";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [username, setUsername] = useState();
  const [currentUserEmail, setCurrentUserEmail] = useState();

  const signup = async (email, username, password) => {
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
            const userRef = doc(db, "leaderboard", uid);
            setDoc(userRef, {
              email,
              username,
              pointsTotal: 0
            })
          })
          .catch((error) => {
            console.error("Error adding user to collection: ", error);
          });
      })
      .catch((error) => {
        console.error("Error registering user: ", error);
      });
      
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUsername(user.displayName);
      setCurrentUserEmail(user.email);
      // Check if email already exists in the "users" collection
      const emailQuerySnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", user.email))
      );
      if (emailQuerySnapshot.size > 0) {
        console.log("Email already exists in collection");
        return;
      }

      // Email does not exist so add user to collection
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        username: user.displayName,
        authProvider: "google",
      });

      const leaderboardRef = doc(db, "leaderboard", user.uid);
      await setDoc(leaderboardRef, {
        email: user.email,
        username: user.displayName,
        pointsTotal: 0,
      });
      console.log("User added to collection");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }

  const logout = () => {
    signOutUser();
    setUsername(null);

  };


  // function that handles custom authentication
  const login = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username)
          setCurrentUserEmail(docSnap.data().email);
        }
        console.log("User signed in.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, ": ", errorMessage);
        alert("Invalid email/password");
      });
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    username,
    currentUserEmail,
    signup,
    login,
    logout,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};