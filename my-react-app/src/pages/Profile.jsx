// Profile.jsx

import { useState } from "react";

import {
  updateProfile
} from "firebase/auth";

import { auth } from "../firebase";

import "./Profile.css";

function Profile() {

  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {

    e.preventDefault();

    setError("");

    if (!fullName || !photoUrl) {
      setError("All fields are required");
      return;
    }

    try {

      await updateProfile(
        auth.currentUser,
        {
          displayName: fullName,
          photoURL: photoUrl,
        }
      );

      alert("Profile Updated Successfully");

      setFullName("");
      setPhotoUrl("");

    }

    catch (error) {

      console.log(error.message);

      setError(error.message);

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
            onChange={(e)=>setFullName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Profile Photo URL"
            value={photoUrl}
            onChange={(e)=>setPhotoUrl(e.target.value)}
          />

          <button type="submit">
            Update
          </button>

          <p className="error">
            {error}
          </p>

        </form>

      </div>

    </div>

  );
}

export default Profile;