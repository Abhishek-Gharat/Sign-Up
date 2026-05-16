import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectAuthLoading, selectAuthError, selectIsAuthenticated, clearError } from "../../store/slices/authSlice";
import "../../styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/welcome");
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      // Dispatch will handle validation in async thunk
    }

    // Dispatch login action
    const resultAction = await dispatch(
      loginUser({ email, password })
    );

    // Check if login was successful
    if (loginUser.fulfilled.match(resultAction)) {
      // Clear Inputs
      setEmail("");
      setPassword("");
      // Navigate happens in useEffect when isAuthenticated changes
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
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <Link to="/forgot-password">
            <p className="forgot-password">Forgot Password</p>
          </Link>

          {error && <p className="error">{error}</p>}

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
