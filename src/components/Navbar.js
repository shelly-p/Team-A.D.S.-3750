import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOutUser } from "../firebase";
import { AuthContext } from "../contexts/AuthContext";


const Navbar = () => {
  const { currentUser, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container-xxl">
        <a className="navbar-brand">
          <span className="fw-bolder text-light fs-3 text">TriviADS</span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {currentUser ? (
          <div className="collapse navbar-collapse justify-content-end align-items-center"
            id="main-nav">
            <ul className="navbar-nav fw-bold">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/" data-link>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/Dashboard" data-link>Play</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/About" data-link>About</Link>
              </li>
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle text-white"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false">
                  Welcome, {username}!
                </span>
                <ul className="dropdown-menu">
                  <li className="nav-item">
                    <Link className="dropdown-item" to="/Profile" data-link>Profile</Link>
                  </li>
                  <li className="nav-item">
                    <a className="dropdown-item" onClick={handleSignOut}>Log Out</a>
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