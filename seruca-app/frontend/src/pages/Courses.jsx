import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Pages.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', code: '', description: '' });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch { setCourses([]); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setForm({ title: '', code: '', description: '' });
      setShowForm(false);
      fetchCourses();
    } catch { } finally { setLoading(false); }
  };

  const statusBadge = (status) => {
    const cls = status === 'PUBLISHED' ? 'badge-published' : status === 'ARCHIVED' ? 'badge-archived' : 'badge-draft';
    return <span className={`badge ${cls}`}>{status || 'DRAFT'}</span>;
  };

  return (
    <div className="page-root">
      <Navbar />
      <div className="page-body">
        <div className="courses-toolbar">
          <div>
            <h1 className="page-heading">Course Management</h1>
            <p className="page-sub" style={{ marginBottom: 0 }}>Content Management System</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            New Course
          </button>
        </div>

        {showForm && (
          <div className="create-panel">
            <h3>Create New Course</h3>
            <form onSubmit={handleCreate}>
              <div className="field-row">
                <div className="field">
                  <label>Course Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="e.g. Research Methodology" required />
                </div>
                <div className="field">
                  <label>Course Code</label>
                  <input value={form.code} onChange={e => setForm({...form, code: e.target.value})}
                    placeholder="e.g. RSC201" required />
                </div>
              </div>
              <div className="field" style={{ marginBottom: '20px' }}>
                <label>Description</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Describe the course content..." />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Course'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr><td colSpan={4}><div className="empty-state">No courses yet. Create your first course above.</div></td></tr>
              ) : courses.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: '#c8841a' }}>{c.code}</td>
                  <td>{c.title}</td>
                  <td style={{ color: '#6b5540', fontSize: '0.85rem' }}>{c.description || '—'}</td>
                  <td>{statusBadge(c.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
