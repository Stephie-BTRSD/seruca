import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="page">
      <h1>Welcome, {user?.username}</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
        {[
          { title: 'Courses', desc: 'Browse and manage academic courses', link: '/courses' },
          { title: 'AI Assistant', desc: 'Ask questions about course content', link: '/assistant' },
          { title: 'Search', desc: 'Search documents and materials', link: '/search' },
        ].map(item => (
          <div key={item.title} className="card" style={{cursor:'pointer'}} onClick={()=>window.location.href=item.link}>
            <h2>{item.title}</h2>
            <p style={{color:'#666',fontSize:14}}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
