import {useState} from 'react';
import './Signup.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
function Signup() {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    setEmail("")
setPassword("")
setConfirmPassword("")
    setError("")
    e.preventDefault();
    if(!email || !password || !confirmPassword){
        setError('All fields are required');
        return;
    }
    
    if(password !== confirmPassword){
        setError('Passwords do not match');

        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
    } catch (error) {
      console.log(error.message);

      setError(error.message);
    }

  }
  console.log(email, password, confirmPassword);
  return (
    <form onSubmit={handleSubmit}>
    <div className="signup-container">

        <div className='sign-up-card'>
   
      <h1>Signup</h1>
      <input type='email' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <input type='password' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <input type='password' placeholder='confirm password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>

<h1>have an account?</h1>   
<button type="submit">

   Sign Up
</button>

        </div>
<p>{error}</p>
             <p>{email}</p>
<p>{password}</p>
<p>{confirmPassword}</p>
    </div>
    </form>
  );
}

export default Signup;