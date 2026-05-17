import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuthenticated, selectEmail } from "../../store/slices/authSlice";
import "./Welcome.css";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const Icons = {
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  expenses: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  counter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  auth: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  verify: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  user: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  spinner: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
  )
};

function Welcome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector(selectEmail);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const verifyEmailHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestType: "VERIFY_EMAIL", idToken: token }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);
      alert("Verification email sent! Check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="welcome-page redirecting">
        <div className="redirect-card">
          {Icons.spinner}
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const initials = email ? email.substring(0, 2).toUpperCase() : "U";

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="user-header">
          <div className="avatar">
            {Icons.user}
            <span className="avatar-fallback">{initials}</span>
          </div>
          <div className="user-info">
            <h2>Welcome Back</h2>
            <p className="user-email">{email}</p>
          </div>
          <button className="logout-icon-btn" onClick={handleLogout} title="Logout">
            {Icons.logout}
          </button>
        </div>

        <p className="subtitle">Manage your finances and explore app features</p>

        <div className="actions-grid">
          <button onClick={() => navigate("/profile")} className="action-btn primary">
            <span className="btn-icon">{Icons.profile}</span>
            <div className="btn-content">
              <span className="btn-title">Complete Profile</span>
              <span className="btn-desc">Update your personal details</span>
            </div>
          </button>

          <button onClick={() => navigate("/expenses")} className="action-btn success">
            <span className="btn-icon">{Icons.expenses}</span>
            <div className="btn-content">
              <span className="btn-title">Manage Expenses</span>
              <span className="btn-desc">Track and analyze spending</span>
            </div>
          </button>
        </div>

        <div className="section-divider">
          <span>Interactive Demos</span>
        </div>

        <div className="actions-grid demos">
          <button onClick={() => navigate("/counter")} className="action-btn purple">
            <span className="btn-icon">{Icons.counter}</span>
            <div className="btn-content">
              <span className="btn-title">Redux Counter</span>
              <span className="btn-desc">State management demo</span>
            </div>
          </button>

          <button onClick={() => navigate("/auth-demo")} className="action-btn pink">
            <span className="btn-icon">{Icons.auth}</span>
            <div className="btn-content">
              <span className="btn-title">Redux Auth Demo</span>
              <span className="btn-desc">Authentication flow demo</span>
            </div>
          </button>
        </div>

        <div className="footer-actions">
          <button onClick={verifyEmailHandler} className="text-btn verify">
            {Icons.verify}
            <span>Verify Email Address</span>
          </button>
          <button onClick={handleLogout} className="text-btn danger">
            {Icons.logout}
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;