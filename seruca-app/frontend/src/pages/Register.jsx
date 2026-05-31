import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'', firstName:'', lastName:'', role:'STUDENT' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>SERUCA</h1>
        <p className="auth-subtitle">Create your account</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <input placeholder="First Name" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} required />
          <input placeholder="Last Name" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} required />
          <input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
          <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value="STUDENT">Student</option>
            <option value="LECTURER">Lecturer</option>
          </select>
          <button className="btn btn-primary" type="submit" style={{width:'100%'}}>Register</button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
