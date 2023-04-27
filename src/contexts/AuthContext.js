import { useState, useContext, createContext, useEffect } from "react";
import { auth, createUserWithEmailAndPassword, onAuthStateChanged, db, doc, setDoc } from "../firebase";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();

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

    const logout = () => {

    };

    const login = () => {

    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};