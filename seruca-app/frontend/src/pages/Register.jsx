import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '', role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = function(e) {
    setForm(function(prev) { return Object.assign({}, prev, { [e.target.name]: e.target.value }); });
  };

  const handleSubmit = async function(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Username or email may already be in use.');
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
            "Education is the most powerful weapon<br/>
            which you can use to change the world."
          </blockquote>
          <cite>— Nelson Mandela</cite>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create account</h2>
            <p>Join the SERUCA research community</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="auth-field">
                <label>First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
              </div>
              <div className="auth-field">
                <label>Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
              </div>
            </div>
            <div className="auth-field">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" required />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create a password" required />
            </div>
            <div className="auth-field">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange} style={{
                padding: '12px 16px', border: '1.5px solid #d4c0a8', borderRadius: '4px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', color: '#1a0e04',
                background: '#fff', outline: 'none', cursor: 'pointer'
              }}>
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
