import { auth, signOutUser } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOutUser();
    navigate("/");
  };

  return (
    <nav>
      <p><Link to="/" data-link>Home</Link></p>
      <p><Link to="/About" data-link>About</Link></p>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleSignOut}>Log Out</button>
        </div>
      ) : (
        <div>
          <p><Link to="/Register">Sign Up</Link></p>
          <p><Link to="/Login">Log in</Link></p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;