// App.jsx

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Welcome from "./pages/Welcome/Welcome";
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Expenses from "./pages/Expenses/Expenses";
import Counter from "./components/Counter/Counter";
import AuthDemo from "./components/AuthDemo/AuthDemo";
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

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/expenses"
          element={<Expenses />}
        />

        <Route
          path="/counter"
          element={<Counter />}
        />

        <Route
          path="/auth-demo"
          element={<AuthDemo />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;