// AuthDemo.jsx - Authentication demonstration with conditional rendering
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logout, selectIsAuthenticated } from '../../store/slices/authSlice';
import { useState } from 'react';

function AuthDemo() {
  // Access auth state from Redux store
  // state.auth.isAuthenticated because:
  // - auth is the slice name (from authSlice.name)
  // - isAuthenticated is the property in the slice
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  
  // Local state for form (we don't actually use the values)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // For demo purposes, we'll just dispatch loginUser with dummy data
    // In a real app, this would validate and call API
    await dispatch(loginUser({ email: email || 'demo@test.com', password: password || 'password' }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Conditional rendering based on auth state
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      
      {/* NOT LOGGED IN - Show Login Form */}
      {!isAuthenticated && (
        <div style={{ 
          border: '2px solid #007bff', 
          borderRadius: '8px', 
          padding: '30px',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
            Login
          </h2>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          </form>

          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            (Note: We don't validate the form - any input works!)
          </p>
        </div>
      )}

      {/* LOGGED IN - Show Welcome Screen */}
      {isAuthenticated && (
        <div style={{ 
          border: '2px solid #28a745', 
          borderRadius: '8px', 
          padding: '30px',
          backgroundColor: '#d4edda',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#155724', marginBottom: '20px' }}>
            Welcome Back! 
          </h2>
          
          <p style={{ fontSize: '48px', margin: '20px 0' }}>
            🎉
          </p>
          
          <p style={{ marginBottom: '30px', color: '#155724' }}>
            You are successfully logged in!
          </p>

          <button
            onClick={handleLogout}
            style={{
              padding: '12px 30px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Explanation */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>How it works:</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>isAuthenticated</strong> starts as <code>false</code></li>
          <li>Click Login → dispatches <code>login()</code> action</li>
          <li>Reducer sets <code>isAuthenticated = true</code></li>
          <li>Component re-renders showing Welcome screen</li>
          <li>Click Logout → dispatches <code>logout()</code> action</li>
          <li>Reducer sets <code>isAuthenticated = false</code></li>
          <li>Component re-renders showing Login form</li>
        </ul>
      </div>
    </div>
  );
}

export default AuthDemo;
