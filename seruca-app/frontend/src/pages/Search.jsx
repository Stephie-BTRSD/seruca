import { useState } from 'react';
import { search } from '../services/api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const r = await search(query);
      setResults(r.data);
      setSearched(true);
    } catch(err) { alert('Search error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <h1>Document Search</h1>
      <div className="card">
        <form onSubmit={handleSearch} style={{display:'flex',gap:12}}>
          <input placeholder="Search documents..." value={query}
            onChange={e=>setQuery(e.target.value)} style={{marginBottom:0,flex:1}} />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      {searched && (
        <div className="card">
          <h2>{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</h2>
          {results.length === 0
            ? <p style={{color:'#888'}}>No documents found.</p>
            : results.map(doc => (
              <div key={doc.id} style={{borderBottom:'1px solid #eee',paddingBottom:16,marginBottom:16}}>
                <h3 style={{color:'#1a3c6e',marginBottom:6}}>{doc.title}</h3>
                <p style={{color:'#666',fontSize:14}}>{doc.content?.substring(0,200)}...</p>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
