import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async function(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-pattern" />
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo-mark">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="30,4 56,18 56,42 30,56 4,42 4,18" fill="none" stroke="#e8a83e" strokeWidth="2"/>
              <polygon points="30,14 46,23 46,37 30,46 14,37 14,23" fill="none" stroke="#e8a83e" strokeWidth="1.5" opacity="0.6"/>
              <circle cx="30" cy="30" r="6" fill="#e8a83e"/>
            </svg>
          </div>
          <h1 className="auth-title">SERUCA</h1>
          <p className="auth-tagline">Knowledge Management for African Academic Excellence</p>
        </div>
        <div className="auth-visual-text">
          <blockquote>
            "If you want to go fast, go alone.<br/>
            If you want to go far, go together."
          </blockquote>
          <cite>— African Proverb</cite>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your SERUCA account</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={function(e) { setUsername(e.target.value); }}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={function(e) { setPassword(e.target.value); }}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            No account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
