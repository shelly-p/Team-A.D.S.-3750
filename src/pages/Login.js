import { auth, authenticateUser, onAuthStateChanged} from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";


// Create a functional component for the login form
const LoginForm = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const navigate = useNavigate();
    const handleSubmit = (event) => {
      event.preventDefault();
      authenticateUser(email, password);
    };
  
    return (
      <form className="form-container" onSubmit={handleSubmit}>
        <label>
          Email: <br />
          <input type="email" value={email} onChange={handleEmailChange} /> <br />
        </label>
        <br />
        <label>
          Password: <br />
          <input type="password" value={password} onChange={handlePasswordChange} /> <br />
        </label>
        <br />
        <button className="btn btn-primary" type="submit">Log In</button>
      </form>
    );
  };
  
  
  
 
  
  // Create a functional component for the app
  const Login = () => {
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
    const navigate = useNavigate();
  
    // Use useEffect to check for an authenticated user on app load
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is authenticated:", user);
          // Set authenticated user in state
          setAuthenticatedUser(user);
          // Set authenticated user in session storage
          sessionStorage.setItem("authenticatedUser", JSON.stringify(user));
          // Navigate to Dashboard
          navigate("/Dashboard");
        } else {
          console.log("User is not authenticated");
          // Remove authenticated user from state
          setAuthenticatedUser(null);
          // Remove authenticated user from session storage
          window.sessionStorage.removeItem("authenticatedUser");
        }
      });
  
  
      // Unsubscribe from the auth state observer when component unmounts
      return () => unsubscribe();
    }, []);
  
    // Use useEffect to get authenticated user from session storage on app load
    useEffect(() => {
      const authenticatedUserString = window.sessionStorage.getItem("authenticatedUser");
      if (authenticatedUserString) {
        const authenticatedUser = JSON.parse(authenticatedUserString);
        console.log("Retrieved authenticated user from session storage:", authenticatedUser);
        setAuthenticatedUser(authenticatedUser);
        
      }
    }, []);
  
    return (
      <div>
        {authenticatedUser ? (
          <>
            <p>User is logged in</p>
          </>
        ) : (
          <>
            <p>User is not logged in</p>
            <LoginForm />
          </>
        )}
      </div>
    );
  };
  
  export default Login;