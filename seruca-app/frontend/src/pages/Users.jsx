import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, updateUserProfile, toggleUserActive, deleteUser } from '../services/api';
import './Pages.css';
import './Users.css';

const ROLE_COLORS = {
  ADMIN:    { bg: '#2d1a08', color: '#f5c96a' },
  LECTURER: { bg: '#1e4a2a', color: '#8fe0a0' },
  STUDENT:  { bg: '#1a2e4a', color: '#8abfe0' },
};

function RoleBadge({ role }) {
  const s = ROLE_COLORS[role] || { bg: '#444', color: '#fff' };
  return (
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em',
        textTransform: 'uppercase', background: s.bg, color: s.color,
      }}>
      {role}
    </span>
  );
}

function StatusDot({ active }) {
  return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: active ? '#2ecc71' : '#e74c3c',
        display: 'inline-block', flexShrink: 0,
      }} />
      <span style={{ fontSize: '0.82rem', color: active ? '#1e6a34' : '#8b1a1a' }}>
        {active ? 'Active' : 'Inactive'}
      </span>
    </span>
  );
}

// ── Edit Profile Modal ──────────────────────────────────────────────────────
function EditModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName:  user.lastName  || '',
    email:     user.email     || '',
    password:  '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {};
      if (form.firstName.trim()) payload.firstName = form.firstName.trim();
      if (form.lastName.trim())  payload.lastName  = form.lastName.trim();
      if (form.email.trim())     payload.email     = form.email.trim();
      if (form.password.trim())  payload.password  = form.password.trim();

      const res = await updateUserProfile(user.id, payload);
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h3 className="modal-title">Edit Profile</h3>
              <p className="modal-sub">{user.username} · {user.role}</p>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          {error && <div className="users-error">{error}</div>}

          <div className="modal-body">
            <div className="field-row">
              <div className="field">
                <label>First Name</label>
                <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                />
              </div>
              <div className="field">
                <label>Last Name</label>
                <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                />
              </div>
            </div>
            <div className="field">
              <label>Email</label>
              <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
              />
            </div>
            <div className="field">
              <label>New Password <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(leave blank to keep current)</span></label>
              <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="New password"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? <span className="spinner-sm" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
  );
}

// ── Confirm Delete Modal ────────────────────────────────────────────────────
function ConfirmModal({ user, onClose, onConfirm }) {
  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card modal-card-sm" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Delete User</h3>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">
            <p style={{ color: '#4a3420', lineHeight: 1.6 }}>
              Are you sure you want to permanently delete <strong>{user.firstName} {user.lastName}</strong> ({user.username})?
              This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-danger" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Users() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('ALL');   // ALL | ADMIN | LECTURER | STUDENT
  const [editUser,   setEditUser]   = useState(null);
  const [deleteUser_, setDeleteUser_] = useState(null);
  const [toast,   setToast]   = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      setError('Failed to load users. Make sure you are connected to the backend.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      showToast('Role updated successfully.');
    } catch {
      showToast('Failed to update role.');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const res = await toggleUserActive(user.id, !user.active);
      setUsers(prev => prev.map(u => u.id === user.id ? res.data : u));
      showToast(`User ${res.data.active ? 'activated' : 'deactivated'}.`);
    } catch {
      showToast('Failed to update status.');
    }
  };

  const handleSavedProfile = (updated) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    showToast('Profile updated successfully.');
  };

  const handleDelete = async () => {
    if (!deleteUser_) return;
    try {
      await deleteUser(deleteUser_.id);
      setUsers(prev => prev.filter(u => u.id !== deleteUser_.id));
      setDeleteUser_(null);
      showToast('User deleted.');
    } catch {
      showToast('Failed to delete user.');
    }
  };

  // Filtering
  const filtered = users.filter(u => {
    const matchRole   = filter === 'ALL' || u.role === filter;
    const q           = search.toLowerCase();
    const matchSearch = !q ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const counts = {
    ALL:      users.length,
    ADMIN:    users.filter(u => u.role === 'ADMIN').length,
    LECTURER: users.filter(u => u.role === 'LECTURER').length,
    STUDENT:  users.filter(u => u.role === 'STUDENT').length,
  };

  return (
      <div className="page-root">
        <div className="page-body">

          {/* Header */}
          <div className="users-header">
            <div>
              <h1 className="page-heading">User Management</h1>
              <p className="page-sub">Manage accounts, roles, and access across the platform</p>
            </div>
            <button className="btn-primary" onClick={loadUsers}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
              Refresh
            </button>
          </div>

          {/* Error banner */}
          {error && <div className="users-error">{error}</div>}

          {/* Stats chips */}
          <div className="users-stats">
            {['ALL', 'ADMIN', 'LECTURER', 'STUDENT'].map(role => (
                <button
                    key={role}
                    className={`stat-chip ${filter === role ? 'stat-chip-active' : ''}`}
                    onClick={() => setFilter(role)}
                >
                  <span className="stat-chip-label">{role}</span>
                  <span className="stat-chip-count">{counts[role]}</span>
                </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="users-search-wrap">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="users-search-icon">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <input
                className="users-search"
                placeholder="Search by name, username or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            {search && (
                <button className="users-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Table */}
          <div className="data-table">
            <table>
              <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {loading && (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      <span className="spinner-sm" style={{ marginRight: 8 }} />
                      Loading users…
                    </td>
                  </tr>
              )}
              {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      {search || filter !== 'ALL'
                          ? 'No users match your filters.'
                          : 'No users found.'}
                    </td>
                  </tr>
              )}
              {!loading && filtered.map(u => (
                  <tr key={u.id}>
                    {/* Name + avatar */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="user-avatar-sm">
                          {u.firstName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1a0e04' }}>
                            {u.firstName} {u.lastName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#a08060' }}>
                            ID #{u.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {u.username}
                    </td>

                    {/* Email */}
                    <td style={{ color: '#6b5540', fontSize: '0.88rem' }}>
                      {u.email}
                    </td>

                    {/* Role select */}
                    <td>
                      <select
                          value={u.role}
                          onChange={e => handleRole(u.id, e.target.value)}
                          className="role-select"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="LECTURER">LECTURER</option>
                        <option value="STUDENT">STUDENT</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusDot active={u.active !== false} />
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-group">
                        <button
                            className="action-btn action-btn-edit"
                            title="Edit profile"
                            onClick={() => setEditUser(u)}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                          </svg>
                          Edit
                        </button>
                        <button
                            className={`action-btn ${u.active !== false ? 'action-btn-warn' : 'action-btn-ok'}`}
                            title={u.active !== false ? 'Deactivate' : 'Activate'}
                            onClick={() => handleToggleActive(u)}
                        >
                          {u.active !== false ? (
                              <>
                                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524L13.477 14.89zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                                </svg>
                                Deactivate
                              </>
                          ) : (
                              <>
                                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                Activate
                              </>
                          )}
                        </button>
                        <button
                            className="action-btn action-btn-danger"
                            title="Delete user"
                            onClick={() => setDeleteUser_(u)}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {!loading && (
              <p style={{ marginTop: 12, fontSize: '0.82rem', color: '#a08060', textAlign: 'right' }}>
                Showing {filtered.length} of {users.length} users
              </p>
          )}
        </div>

        {/* Modals */}
        {editUser && (
            <EditModal
                user={editUser}
                onClose={() => setEditUser(null)}
                onSaved={handleSavedProfile}
            />
        )}
        {deleteUser_ && (
            <ConfirmModal
                user={deleteUser_}
                onClose={() => setDeleteUser_(null)}
                onConfirm={handleDelete}
            />
        )}

        {/* Toast notification */}
        {toast && (
            <div className="toast">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={{ flexShrink: 0 }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {toast}
            </div>
        )}
      </div>
  );
}