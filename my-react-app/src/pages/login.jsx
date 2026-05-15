// Login.jsx

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import "./Auth.css";

function Login() {

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = async (e) => {

      e.preventDefault();

      setError("");

      if (!email || !password) {
         setError("All fields are required");
         return;
      }

      try {

         const userCredential =
         await signInWithEmailAndPassword(
            auth,
            email,
            password
         );

         console.log(userCredential.user);

         const token =
         userCredential.user.accessToken;

         localStorage.setItem("token", token);

         setEmail("");
         setPassword("");

      }

      catch (error) {

         console.log(error.message);

         setError(error.message);

      }

   }

   return (

      <div className="auth-container">

         <div className="auth-card">

            <form onSubmit={handleSubmit}>

               <h1>Login</h1>

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

               <button type="submit">
                  Login
               </button>

               <p className="forgot-password">
                  Forgot Password
               </p>

               <p className="error">
                  {error}
               </p>

               <p className="bottom-text">
                  Don't have an account?
                  <Link to="/signup"> Sign Up</Link>
               </p>

            </form>

         </div>

      </div>

   );
}

export default Login;