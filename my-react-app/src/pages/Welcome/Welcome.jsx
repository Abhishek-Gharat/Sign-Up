import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";

function Welcome() {

  const navigate = useNavigate();

  const verifyEmailHandler = async () => {

    try {

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

  return (
    <div>

      <h1>Welcome To Expense Tracker</h1>

      <button onClick={() => navigate("/profile")}>
        Complete Profile
      </button>

      {auth.currentUser?.emailVerified ? (
        <h3>Email Verified ✅</h3>
      ) : (
        <button onClick={verifyEmailHandler}>
          Verify Email
        </button>
      )}

    </div>
  );
}

export default Welcome;