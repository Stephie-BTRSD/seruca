import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => { getUsers().then(r => setUsers(r.data)).catch(()=>{}); }, []);

  const handleRole = async (id, role) => {
    await updateUserRole(id, role);
    setUsers(users.map(u => u.id === id ? {...u, role} : u));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="page">
      <h1>User Management</h1>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={e=>handleRole(u.id, e.target.value)}
                    style={{width:'auto',marginBottom:0,padding:'4px 8px'}}>
                    <option>ADMIN</option><option>LECTURER</option><option>STUDENT</option>
                  </select>
                </td>
                <td><button className="btn btn-danger" onClick={()=>handleDelete(u.id)}>Delete</button></td>
              </tr>
            ))}
            {users.length===0 && <tr><td colSpan={5} style={{textAlign:'center',color:'#888'}}>No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
