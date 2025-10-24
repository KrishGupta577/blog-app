import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Reader');
  const { register, error } = useAuth();
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!username || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    try {
      await register(username, password, role);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>
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
        <div className="form-group">
          <label htmlFor="role">Register as:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Reader">Reader</option>
            <option value="Writer">Writer</option>
          </select>
        </div>
        <button type="submit" className="btn-submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;