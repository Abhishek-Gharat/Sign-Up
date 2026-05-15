

import { useState } from "react";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../../services/firebase";

import {
  Link,
  useNavigate
} from "react-router-dom";

import "../../styles/Auth.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    // Validation

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);

    try {

      // Firebase Login

      const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(userCredential.user);

      // IMPORTANT
      // Get Firebase ID Token

      const token =
      await userCredential.user.getIdToken();

      // Store token

      localStorage.setItem(
        "token",
        token
      );

      // Clear Inputs

      setEmail("");
      setPassword("");

      // Navigate

      navigate("/welcome");

    }

    catch (error) {

      console.log(error);

      // Firebase Errors

      switch(error.code){

        case "auth/invalid-email":
          setError("Invalid Email");
          break;

        case "auth/user-not-found":
          setError("User Not Found");
          break;

        case "auth/wrong-password":
          setError("Wrong Password");
          break;

        case "auth/invalid-credential":
          setError("Invalid Credentials");
          break;

        default:
          setError(error.message);

      }

    }

    finally{

      setIsLoading(false);

    }

  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <form onSubmit={handleSubmit}>

          <h1>Login</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={isLoading}
          >
            {
              isLoading
              ? "Logging in..."
              : "Login"
            }
          </button>

          <p className="forgot-password">
            Forgot Password
          </p>

          <p className="error">
            {error}
          </p>

          <p className="bottom-text">

            Don't have an account?

            <Link to="/signup">
              {" "}Sign Up
            </Link>

          </p>

        </form>

      </div>

    </div>

  );
}

export default Login;