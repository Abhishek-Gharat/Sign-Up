import { useState } from "react";

import {
   sendPasswordResetEmail
} from "firebase/auth";

import { auth } from "../../services/firebase";

import {
   Link
} from "react-router-dom";

import "../../styles/Auth.css";

function ForgotPassword(){

   const [email, setEmail] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState("");

   const handleSubmit = async (e) => {

      e.preventDefault();

      setError("");
      setSuccess("");

      if(!email){
         setError("Email is required");
         return;
      }

      setLoading(true);

      try{

         await sendPasswordResetEmail(
            auth,
            email
         );

         setSuccess(
            "Password reset email sent successfully"
         );

         setEmail("");

      }

      catch(error){

         console.log(error);

         switch(error.code){

            case "auth/user-not-found":
               setError("User not found");
               break;

            case "auth/invalid-email":
               setError("Invalid email");
               break;

            default:
               setError(error.message);

         }

      }

      finally{

         setLoading(false);

      }

   };

   return(

      <div className="auth-container">

         <div className="auth-card">

            <form onSubmit={handleSubmit}>

               <h1>Forgot Password</h1>

               <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e)=>
                     setEmail(e.target.value)
                  }
               />

               <button
                  type="submit"
                  disabled={loading}
               >
                  {
                     loading
                     ?
                     "Sending..."
                     :
                     "Send Reset Link"
                  }
               </button>

               <p className="error">
                  {error}
               </p>

               <p className="success">
                  {success}
               </p>

               <p className="bottom-text">

                  Back To

                  <Link to="/">
                     {" "}Login
                  </Link>

               </p>

            </form>

         </div>

      </div>

   )

}

export default ForgotPassword;