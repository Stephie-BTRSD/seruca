import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">SERUCA</Link>
      </div>
      <div className="navbar-links">
        <Link to="/courses">Courses</Link>
        <Link to="/search">Search</Link>
        <Link to="/assistant">AI Assistant</Link>
        {user?.role === 'ADMIN' && <>
          <Link to="/users">Users</Link>
          <Link to="/taxonomy">Taxonomy</Link>
        </>}
      </div>
      <div className="navbar-user">
        <span>{user?.username} ({user?.role})</span>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>
    </nav>
  );
}
