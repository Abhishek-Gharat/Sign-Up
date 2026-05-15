// Login.jsx

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import "./Auth.css";

function Login() {
   
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();
   
   const handleSubmit = async (e) => {
      console.log("Login form submitted");
      e.preventDefault();

      setError("");
      
      if (!email || !password) {
         setError("All fields are required");
         return;
      }

      setIsLoading(true);
      
      try {
         console.log("Attempting Firebase sign in with email:", email);
         const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
         );

         console.log("Sign in successful:", userCredential.user.uid);
         
         // Get ID token
         const token = await userCredential.user.getIdToken();
         console.log("Got ID token");
         
         // Store token
         localStorage.setItem("token", token);
         console.log("Token stored");
         
         // Navigate
         navigate("/welcome", { replace: true });
         console.log("Navigation to welcome initiated");
         
      } catch (error) {
         console.error("Login failed:", error);
         // Handle common Firebase auth errors
         let errorMessage = "Authentication failed";
         if (error.code) {
            switch(error.code) {
               case "auth/invalid-email":
                  errorMessage = "Invalid email address";
                  break;
               case "auth/user-disabled":
                  errorMessage = "User account has been disabled";
                  break;
               case "auth/user-not-found":
                  errorMessage = "No user found with this email";
                  break;
               case "auth/wrong-password":
                  errorMessage = "Incorrect password";
                  break;
               case "auth/too-many-requests":
                  errorMessage = "Too many attempts. Try again later.";
                  break;
               default:
                  errorMessage = error.message;
            }
         }
         setError(errorMessage);
      } finally {
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
                  onChange={(e)=>setEmail(e.target.value)}
               />
               
               <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
               />
               
               <button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
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