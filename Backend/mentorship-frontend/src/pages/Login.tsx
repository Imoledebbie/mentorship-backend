// Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ added useLocation

const Login = () => {
  const location = useLocation(); // ✅ to read message passed from Dashboard
  const logoutMessage = location.state && typeof location.state === 'object' ? location.state.message : '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("Trying to login with:", email, password);

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      console.log("Login success:", response.data);

      // ✅ Save token to localStorage
      localStorage.setItem('token', response.data.token);

      alert('Login successful!');

      // ✅ Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      {/* ✅ Show message if redirected from logout or token expiration */}
      {logoutMessage && (
        <p style={{ color: 'green' }}>{logoutMessage}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Login;
