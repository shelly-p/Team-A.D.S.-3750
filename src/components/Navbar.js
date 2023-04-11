import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, doc, getDoc, auth, onAuthStateChanged, signOutUser } from "../firebase";



const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticatedUser(user);
      } else {
        setAuthenticatedUser(null);
      }
    });
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (authenticatedUser) {
        try {
          const docRef = doc(db, "users", authenticatedUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUsername(docSnap.data().username);
          } else {
            setUsername(sessionStorage.getItem("username"));
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchUsername();
  }, [authenticatedUser, db]);

  const handleSignOut = () => {
    signOutUser();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-xxl">
        <a className="navbar-brand">
          <span className="fw-bolder text-light">
            TriviADS
          </span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {authenticatedUser ? (
          <div className="collapse navbar-collapse justify-content-end align-items-center"
            id="main-nav">
            <ul className="navbar-nav fw-bold">
              <li className="nav-item">
                <Link className="nav-link" to="/" data-link>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Dashboard" data-link>Play</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/About" data-link>About</Link>
              </li>
              <li className="nav-item dropdown">
                <span 
                className="nav-link dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false">
                Welcome, {username}!
                </span>
                <ul className="dropdown-menu dropdown-menu-right">
                  <li className="nav-item">
                  <button className="nav-link text-center" type="button" onClick={handleSignOut}>Log Out</button>
                  </li>
                </ul>
                </li>
            </ul>
          </div>
        ) : (
          <div className="collapse navbar-collapse justify-content-end align-center"
            id="main-nav">
            <ul className="navbar-nav fw-bold ">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/" data-link>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/Dashboard" data-link>Play</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/About" data-link>About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/Register" data-link>Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/Login" data-link>Login</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>

  );
};

export default Navbar;