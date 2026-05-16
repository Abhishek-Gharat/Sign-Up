import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectEmail, selectIsAuthenticated } from "../../store/slices/authSlice";

function Welcome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get auth state from Redux
  const email = useSelector(selectEmail);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const verifyEmailHandler = async () => {
    try {
      // Get token from Redux state or localStorage
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyD8L86KAfCrkrVLC3fNCHWXTnWaKuNFqek",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      alert("Verification email sent!");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="welcome-page">
      <h1>Welcome To Expense Tracker</h1>

      {email && <p style={{ marginBottom: "20px", color: "#666" }}>{email}</p>}

      <button onClick={() => navigate("/profile")}>Complete Profile</button>

      <button onClick={() => navigate("/expenses")} className="expenses-btn">
        💰 Manage Expenses
      </button>

      <button onClick={() => navigate("/counter")} className="counter-btn">
        🔢 Redux Counter Demo
      </button>

      <button onClick={() => navigate("/auth-demo")} className="auth-btn">
        🔐 Redux Auth Demo
      </button>

      <button onClick={verifyEmailHandler}>Verify Email</button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Welcome;
