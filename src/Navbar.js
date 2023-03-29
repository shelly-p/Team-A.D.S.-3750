import { Link } from "react-router-dom";



const Navbar = () => {

    return (
        <nav className="navbar is-info" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to="/" data-link>Home</Link>
            <Link className="navbar-item" to="/About" data-link>
              About
            </Link>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <Link className="button is-primary" to="/Register">
                <strong>Sign Up</strong>
              </Link>
              <Link className="button is-light" to="/Login">
                Log in
              </Link>
            </div>
          </div>
        </div>

      </nav>
    );
  }
   
  export default Navbar;