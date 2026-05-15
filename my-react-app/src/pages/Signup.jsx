// Signup.jsx

import { useState } from "react";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../firebase";

import { Link } from "react-router-dom";

import "./Auth.css";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(userCredential.user);

      setEmail("");
      setPassword("");
      setConfirmPassword("");

    }

    catch (error) {

      console.log(error.message);

      setError(error.message);

    }

  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <form onSubmit={handleSubmit}>

          <h1>Signup</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />

          <button type="submit">
            Sign Up
          </button>

          <p className="error">
            {error}
          </p>

          <p className="bottom-text">
            Have an account?
            <Link to="/">
              {" "}Login
            </Link>
          </p>

        </form>

      </div>

    </div>

  );
}

export default Signup;