import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUser,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  clearError,
} from "../../store/slices/authSlice";
import "../../styles/Auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/welcome");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const resultAction = await dispatch(signupUser({ email, password }));
    if (signupUser.fulfilled.match(resultAction)) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* autoComplete="off" on form + new-password on inputs prevents browser autofill */}
        <form onSubmit={handleSubmit} autoComplete="off">
          <h1>Signup</h1>

          <input
            type="email"
            name="signup-email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
          />

          <input
            type="password"
            name="signup-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
          />

          <input
            type="password"
            name="signup-confirm"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          {error && <p className="error">{error}</p>}

          <p className="bottom-text">
            Have an account?
            <Link to="/"> Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;