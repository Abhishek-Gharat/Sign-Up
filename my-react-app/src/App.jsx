import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Welcome from "./pages/Welcome/Welcome";
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Expenses from "./pages/Expenses/Expenses";
import Counter from "./components/Counter/Counter";
import AuthDemo from "./components/AuthDemo/AuthDemo";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/auth-demo" element={<AuthDemo />} />

        {/* Protected Routes */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;