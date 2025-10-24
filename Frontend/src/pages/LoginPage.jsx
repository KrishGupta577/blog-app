import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!username || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    try {
      await login(username, password);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      {(error || localError) && (
        <p className="error-message">{localError || error}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;