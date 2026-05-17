// Profile.jsx
import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../../services/firebase";
import "../../styles/Auth.css";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

function Profile() {
  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: token }),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message);

        setFullName(data.users[0].displayName || "");
        setPhotoUrl(data.users[0].photoUrl || "");
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !photoUrl) {
      setError("All fields are required");
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: fullName,
        photoURL: photoUrl,
      });
      alert("Profile Updated Successfully");
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Contact Details</h1>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Profile Photo URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <button type="submit">Update</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Profile;