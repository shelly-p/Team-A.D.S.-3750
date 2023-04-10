import { useState } from "react";
//import { collection, getDocs, query, where } from "firebase/firestore";
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
    <form onSubmit={handleSubmit}>
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
    </form>
  );
};

export default Register;
