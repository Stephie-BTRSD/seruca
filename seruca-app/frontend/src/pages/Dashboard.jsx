import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const allCards = [
    { title: 'Courses',      desc: 'Browse and manage academic courses',  link: '/courses',   roles: ['ADMIN','LECTURER','STUDENT'] },
    { title: 'Search',       desc: 'Search documents and materials',       link: '/search',    roles: ['ADMIN','LECTURER','STUDENT'] },
    { title: 'AI Assistant', desc: 'Ask questions about course content',   link: '/assistant', roles: ['ADMIN','LECTURER','STUDENT'] },
    { title: 'Users',        desc: 'Manage user accounts and roles',       link: '/users',     roles: ['ADMIN'] },
    { title: 'Taxonomy',     desc: 'Manage content category hierarchy',    link: '/taxonomy',  roles: ['ADMIN'] },
  ];

  const cards = allCards.filter(c => c.roles.includes(user?.role));

  return (
    <div className="page">
      <h1>Welcome, {user?.username}</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Role: {user?.role}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {cards.map(item => (
          <div key={item.title} className="card"
            style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
            onClick={() => navigate(item.link)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,60,110,0.15)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}>
            <h2>{item.title}</h2>
            <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
