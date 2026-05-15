// Profile.jsx

import {
  useState,
  useEffect
} from "react";

import {
  updateProfile
} from "firebase/auth";

import { auth } from "../../services/firebase";

import "../../styles/Auth.css";

function Profile() {

  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  // FETCH USER DATA WHEN PAGE LOADS

  useEffect(() => {

    const fetchUserData = async () => {

      const token =
      localStorage.getItem("token");

      try {

        const response = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyD8L86KAfCrkrVLC3fNCHWXTnWaKuNFqek",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              idToken: token
            })

          }
        );

        const data =
        await response.json();

        console.log(data);

        // PREFILL INPUTS

        setFullName(
          data.users[0].displayName || ""
        );

        setPhotoUrl(
          data.users[0].photoUrl || ""
        );

      }

      catch(error){

        console.log(error.message);

      }

    };

    fetchUserData();

  }, []);

  // UPDATE PROFILE

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
            onChange={(e)=>
              setFullName(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Profile Photo URL"
            value={photoUrl}
            onChange={(e)=>
              setPhotoUrl(e.target.value)
            }
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