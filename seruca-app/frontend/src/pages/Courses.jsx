import { useState, useEffect, useCallback } from 'react';
import {
  getCourses, getManagedCourses, getMyCourses,
  createCourse, updateCourse, deleteCourse,
  publishCourse, archiveCourse
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { title: '', description: '', code: '', categoryId: '', status: '' };

export default function Courses() {
  const { user } = useAuth();
  const isAdmin    = user?.role === 'ADMIN';
  const isLecturer = user?.role === 'LECTURER';
  const canManage  = isAdmin || isLecturer;

  const [courses, setCourses]     = useState([]);
  const [totalPages, setTotal]    = useState(0);
  const [page, setPage]           = useState(0);
  const [keyword, setKeyword]     = useState('');
  const [searchInput, setSearch]  = useState('');
  const [view, setView]           = useState(isAdmin ? 'all' : isLecturer ? 'my' : 'published');

  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);   // course being edited
  const [form, setForm]           = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [loading, setLoading]     = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (view === 'all')       res = await getManagedCourses(page, 10, keyword);
      else if (view === 'my')   res = await getMyCourses(page, 10);
      else                      res = await getCourses(page, 10, keyword);

      const body = res.data.data ?? res.data;   // unwrap ApiResponse envelope
      setCourses(body.content ?? []);
      setTotal(body.totalPages ?? 1);
    } catch { setCourses([]); }
    setLoading(false);
  }, [view, page, keyword]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(searchInput.trim());
  };

  // ── Open create form ──────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  // ── Open edit form ────────────────────────────────────────────────────────
  const openEdit = (c) => {
    setEditing(c);
    setForm({ title: c.title, description: c.description ?? '', code: c.code,
              categoryId: c.category?.id ?? '', status: c.status });
    setFormError('');
    setShowForm(true);
  };

  // ── Submit create / edit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const payload = {
      title: form.title,
      description: form.description,
      code: form.code,
      categoryId: form.categoryId || null,
      status: form.status || null,
    };
    try {
      if (editing) {
        await updateCourse(editing.id, payload);
      } else {
        await createCourse(payload);
      }
      setShowForm(false);
      setEditing(null);
      fetchCourses();
    } catch (err) {
      setFormError(err.response?.data?.message ?? 'Failed to save course');
    }
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const handlePublish = async (id) => {
    try { await publishCourse(id); fetchCourses(); }
    catch (err) { alert(err.response?.data?.message ?? 'Failed to publish'); }
  };

  const handleArchive = async (id) => {
    try { await archiveCourse(id); fetchCourses(); }
    catch (err) { alert(err.response?.data?.message ?? 'Failed to archive'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try { await deleteCourse(id); fetchCourses(); }
    catch (err) { alert(err.response?.data?.message ?? 'Failed to delete'); }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const canEdit   = (c) => isAdmin || (isLecturer && c.lecturer?.username === user?.username);
  const canDelete = (c) => isAdmin || (isLecturer && c.lecturer?.username === user?.username);

  return (
    <div className="page">

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h1>Courses</h1>
        {canManage && <button className="btn btn-primary" onClick={openCreate}>+ New Course</button>}
      </div>

      {/* View tabs (admin / lecturer only) */}
      {canManage && (
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {isAdmin && (
            <button className={`btn ${view==='all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={()=>{ setView('all'); setPage(0); }}>All Courses</button>
          )}
          <button className={`btn ${view==='my' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={()=>{ setView('my'); setPage(0); }}>My Courses</button>
          <button className={`btn ${view==='published' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={()=>{ setView('published'); setPage(0); }}>Published</button>
        </div>
      )}

      {/* Search bar (not for 'my' view) */}
      {view !== 'my' && (
        <form onSubmit={handleSearch} style={{ display:'flex', gap:8, marginBottom:16 }}>
          <input style={{ marginBottom:0 }} placeholder="Search by title or code…"
            value={searchInput} onChange={e=>setSearch(e.target.value)} />
          <button className="btn btn-primary" type="submit" style={{ whiteSpace:'nowrap' }}>Search</button>
          {keyword && <button className="btn btn-secondary" type="button"
            onClick={()=>{ setSearch(''); setKeyword(''); setPage(0); }}>Clear</button>}
        </form>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="card">
          <h2>{editing ? 'Edit Course' : 'Create Course'}</h2>
          {formError && <p className="error">{formError}</p>}
          <form onSubmit={handleSubmit}>
            <input placeholder="Course Title *" required value={form.title}
              onChange={e=>setForm({...form, title:e.target.value})} />
            <input placeholder="Course Code * (e.g. CS101)" required value={form.code}
              onChange={e=>setForm({...form, code:e.target.value.toUpperCase()})} />
            <textarea placeholder="Description" rows={3} value={form.description}
              onChange={e=>setForm({...form, description:e.target.value})} />
            {editing && (
              <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                <option value="">-- Status --</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            )}
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn btn-primary" type="submit">
                {editing ? 'Save Changes' : 'Create'}
              </button>
              <button className="btn btn-secondary" type="button"
                onClick={()=>{ setShowForm(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Courses table */}
      <div className="card">
        {loading ? (
          <p style={{ textAlign:'center', color:'#888', padding:20 }}>Loading…</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Lecturer</th>
                <th>Status</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.code}</strong></td>
                  <td>{c.title}
                    {c.description && (
                      <div style={{ fontSize:12, color:'#888', marginTop:2 }}>
                        {c.description.length > 80 ? c.description.slice(0,80)+'…' : c.description}
                      </div>
                    )}
                  </td>
                  <td>{c.lecturer ? `${c.lecturer.firstName} ${c.lecturer.lastName}` : '—'}</td>
                  <td><span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                  {canManage && (
                    <td>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {canEdit(c) && (
                          <button className="btn btn-secondary" style={{ padding:'6px 12px' }}
                            onClick={()=>openEdit(c)}>Edit</button>
                        )}
                        {canEdit(c) && c.status === 'DRAFT' && (
                          <button className="btn btn-success" style={{ padding:'6px 12px' }}
                            onClick={()=>handlePublish(c.id)}>Publish</button>
                        )}
                        {canEdit(c) && c.status === 'PUBLISHED' && (
                          <button className="btn btn-secondary" style={{ padding:'6px 12px' }}
                            onClick={()=>handleArchive(c.id)}>Archive</button>
                        )}
                        {canDelete(c) && (
                          <button className="btn btn-danger" style={{ padding:'6px 12px' }}
                            onClick={()=>handleDelete(c.id)}>Delete</button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan={canManage ? 5 : 4}
                  style={{ textAlign:'center', color:'#888', padding:24 }}>
                  No courses found.
                </td></tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:16 }}>
            <button className="btn btn-secondary" disabled={page === 0}
              onClick={()=>setPage(p=>p-1)}>← Prev</button>
            <span style={{ padding:'10px 16px', fontSize:14 }}>Page {page+1} of {totalPages}</span>
            <button className="btn btn-secondary" disabled={page >= totalPages-1}
              onClick={()=>setPage(p=>p+1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
