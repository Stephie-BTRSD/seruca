import { useState, useEffect } from 'react';
import { getTaxonomy, createCategory } from '../services/api';

export default function Taxonomy() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name:'', description:'' });

  useEffect(() => { getTaxonomy().then(r => setCategories(r.data)).catch(()=>{}); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const r = await createCategory({...form, level:0, slug: form.name.toLowerCase().replace(/\s+/g,'-')});
      setCategories([...categories, r.data]);
      setForm({ name:'', description:'' });
    } catch(err) { alert('Error creating category'); }
  };

  return (
    <div className="page">
      <h1>Taxonomy Management</h1>
      <div className="card">
        <h2>Add Category</h2>
        <form onSubmit={handleCreate} style={{display:'flex',gap:12,alignItems:'flex-end'}}>
          <input placeholder="Category Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required style={{marginBottom:0}} />
          <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{marginBottom:0}} />
          <button className="btn btn-primary" type="submit" style={{whiteSpace:'nowrap'}}>Add</button>
        </form>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Description</th><th>Slug</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}><td>{c.name}</td><td>{c.description}</td><td>{c.slug}</td></tr>
            ))}
            {categories.length===0 && <tr><td colSpan={3} style={{textAlign:'center',color:'#888'}}>No categories yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
