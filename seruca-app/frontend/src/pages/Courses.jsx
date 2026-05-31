import { useState, useEffect } from 'react';
import { getCourses, createCourse, deleteCourse } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', code:'' });
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => { getCourses().then(r => setCourses(r.data)).catch(()=>{}); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const r = await createCourse(form);
      setCourses([...courses, r.data]);
      setForm({ title:'', description:'', code:'' });
      setShowForm(false);
    } catch(err) { alert('Error creating course'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await deleteCourse(id);
    setCourses(courses.filter(c => c.id !== id));
  };

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1>Content Management — Courses</h1>
        {(user?.role === 'ADMIN' || user?.role === 'LECTURER') &&
          <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}>+ New Course</button>}
      </div>
      {showForm && (
        <div className="card">
          <h2>Create Course</h2>
          <form onSubmit={handleCreate}>
            <input placeholder="Course Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
            <input placeholder="Course Code (e.g. CS101)" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} required />
            <textarea placeholder="Description" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            <button className="btn btn-primary" type="submit">Create</button>
          </form>
        </div>
      )}
      <div className="card">
        <table>
          <thead><tr><th>Code</th><th>Title</th><th>Status</th>{user?.role==='ADMIN'&&<th>Actions</th>}</tr></thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.title}</td>
                <td><span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                {user?.role==='ADMIN' && <td><button className="btn btn-danger" onClick={()=>handleDelete(c.id)}>Delete</button></td>}
              </tr>
            ))}
            {courses.length === 0 && <tr><td colSpan={4} style={{textAlign:'center',color:'#888'}}>No courses yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
