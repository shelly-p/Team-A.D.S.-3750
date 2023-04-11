import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, authenticateUser, onAuthStateChanged, signInWithGoogle } from "../firebase";


const Login = () => {
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();



  


  //const handleEmailChange = (event) => setEmail(event.target.value);
  //const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticateUser(emailRef.current.value, passwordRef.current.value);
  };

  /*useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticatedUser(user);
      } else {
        setAuthenticatedUser(null);
      }
    });
    return unsubscribe;
  }, [auth]);*/
 
  return (
    <div>
      {authenticatedUser ? (
        <>
          <p>User is logged in</p>
          {navigate("/Dashboard")}
        </>
      ) : (
        <div className="container-lg">
          <div className='row justify-content-center '>

            <div className="col-md-5 text-center">
              <div className="card shadow p-3 mb-5 bg-white rounded">
                <div className="card-body">
                  <h5 class="card-title display-5">Sign In</h5>
                  <form className="form-signin" onSubmit={handleSubmit}>
                    
                      <input
                        type="email"
                        ref={emailRef}
                        className="form-control shadow-sm p-2 mb-5 bg-white rounded"
                        placeholder="Email" />
                   
                   
                      <input
                        type="password"
                        ref={passwordRef}
                        className="form-control shadow-sm p-2 mb-5 bg-white rounded"
                        placeholder="Password" />
                    
                    <button type="submit" className="btn btn-primary btn-block">Sign in</button>
                  </form>
                  <br />
                  <div className="col">
                    <a>Forgot password?</a>
                  </div>
                  <div>
                    <button className="btn btn-primary" onClick={signInWithGoogle}>Sign In with Google</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>




      )
      }
    </div >
  );
};

export default Login;