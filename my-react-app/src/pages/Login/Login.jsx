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
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form onSubmit={handleSubmit} autoComplete="on">
          <h1>Login</h1>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
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