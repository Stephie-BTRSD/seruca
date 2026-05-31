import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>SERUCA</h1>
        <p className="auth-subtitle">Academic Event Management System</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <input placeholder="Username" value={form.username}
            onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required />
          <button className="btn btn-primary" type="submit" disabled={loading} style={{width:'100%'}}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-link">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
