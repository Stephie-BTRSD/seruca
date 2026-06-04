import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <svg viewBox="0 0 36 36" fill="none" className="navbar-logo">
            <polygon points="18,2 34,11 34,25 18,34 2,25 2,11" fill="none" stroke="#e8a83e" strokeWidth="1.5"/>
            <circle cx="18" cy="18" r="4" fill="#e8a83e"/>
          </svg>
          <span>SERUCA</span>
        </Link>

        <div className="navbar-links">
          <Link to="/courses" className={`nav-link ${isActive('/courses') ? 'active' : ''}`}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
            Courses
          </Link>
          <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            Search
          </Link>
          <Link to="/assistant" className={`nav-link ${isActive('/assistant') ? 'active' : ''}`}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
            </svg>
            AI Assistant
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-pill">
            <div className="user-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
