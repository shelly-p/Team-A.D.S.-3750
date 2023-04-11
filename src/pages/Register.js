import { useState } from "react";
import { db, registerUser, collection, getDocs, query, where } from "../firebase";
import { Link, useNavigate } from "react-router-dom";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const navigate = useNavigate();



  const handleEmailChange = async (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);

    const q = query(collection(db, "users"), where("email", "==", emailValue));
    const querySnapshot = await getDocs(q);
    setEmailExists(!querySnapshot.empty);
  };

  const handleUsernameChange = async (event) => {
    const usernameValue = event.target.value;
    setUsername(usernameValue);

    const q = query(collection(db, "users"), where("username", "==", usernameValue));
    const querySnapshot = await getDocs(q);
    setUsernameExists(!querySnapshot.empty);
  };

  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!emailExists && !usernameExists) {
      registerUser(email, password, username);
      navigate("/Dashboard");
    }
  };

  return (

    <div className="login-card-container">
      <div className="login-card">
        <div className="login-card-logo">
          <span className="material-symbols-rounded display-3">
            psychology
          </span>
        </div>
        <div className="login-card-header">
          <h1>Sign Up</h1>
          <div>Please sign up to use the platform</div>
          {emailExists && <p>Email already exists</p>}
          {usernameExists && <p>Username already exists</p>}
        </div>



        <form className="login-card-form" onSubmit={handleSubmit}>
          <div className="form-item">

            <span className="form-item-icon material-symbols-rounded">mail</span>
            <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} autofocus required />
          </div>
          <div className="form-item">
            <span className="form-item-icon material-symbols-rounded">badge</span>
            <input type="text" value={username} onChange={handleUsernameChange} />
          </div>
          <div className="form-item">
            <span className="form-item-icon material-symbols-rounded">lock</span>
            <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} required />
          </div>

          <button type="submit" disabled={emailExists || usernameExists}>Sign Up</button>
        </form>
        <div className="login-card-footer">
          Have an account? <a href="/Login">Please Login.</a>
        </div>
      </div>
      <div className="login-card-social">
        <div>Other Sign-In Options</div>
        <div className="login-card-social-btns">
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-facebook"
              width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path>
            </svg>
          </a>
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-google" width="24"
              height="24" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>

  );
};

export default Register;


/*<form onSubmit={handleSubmit}>
      <label>Email:</label> <br />
      <input type="email" value={email} onChange={handleEmailChange} /> <br />
      {emailExists && <p>Email already exists</p>}

      <label>Username:</label> <br />
      <input type="text" value={username} onChange={handleUsernameChange} /> <br />
      {usernameExists && <p>Username already exists</p>}

      <label>Password:</label> <br />
      <input type="password" value={password} onChange={handlePasswordChange} /> <br />

      <br />
      <button type="submit" disabled={emailExists || usernameExists}>
        Register
      </button>
    </form>*/