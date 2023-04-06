import { auth, signOutUser } from "../firebase";
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
    <nav className="navbar navbar-expand-md navbar-light">
      <div className="container-xxl">
        <a className="navbar-brand">
          <span className="fw-bold text-secondary">
            TriviADS
          </span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {user ? (
          <div className="collapse navbar-collapse justify-content-end align-center"
            id="main-nav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link">
                  <Link to="/" data-link>Home</Link>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link">
                  <Link className="nav-link" to="/About" data-link>About</Link>
                </a>
              </li>
              <li className="nav-item">
              Welcome, {sessionStorage.getItem('username')}!
                <a className="nav-link" onClick={handleSignOut}>Log Out</a>
              </li>
            </ul>


          </div>
        ) : (
          <div className="collapse navbar-collapse justify-content-end align-center"
            id="main-nav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/" data-link>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/About" data-link>About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Register" data-link>Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Login" data-link>Login</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>


  );
};

export default Navbar;