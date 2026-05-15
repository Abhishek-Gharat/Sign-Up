// App.jsx

import Login from "./pages/login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import Profile from "./pages/Profile";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/welcome"
          element={<Welcome />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;