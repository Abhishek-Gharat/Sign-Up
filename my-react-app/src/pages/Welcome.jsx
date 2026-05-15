// Welcome.jsx

import { Link } from "react-router-dom";

import "./welcome.css";

function Welcome() {

  return (

    <div className="welcome-container">

      <div className="welcome-card">

        <h1>
          Welcome To Expense Tracker
        </h1>

        <p>
          Your profile is incomplete
        </p>

        <Link
          to="/profile"
          className="complete-btn"
        >
          Complete Now
        </Link>

      </div>

    </div>

  );
}

export default Welcome;