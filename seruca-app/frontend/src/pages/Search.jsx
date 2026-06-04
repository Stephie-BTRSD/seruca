import React, { useState } from 'react';
import './Pages.css';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSearch = async function(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      var res = await fetch('/api/search?q=' + encodeURIComponent(query), {
        headers: { Authorization: 'Bearer ' + token }
      });
      var data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      <h1 className="page-heading">Document Search</h1>
      <p className="page-sub">Search and retrieve documents across all course collections</p>

      <form onSubmit={handleSearch} className="search-box">
        <div className="search-input-wrap">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            className="search-input"
            value={query}
            onChange={function(e) { setQuery(e.target.value); }}
            placeholder="Search documents, course materials, topics..."
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results !== null && (
        <div>
          <p className="search-results-header">
            {results.length === 0
              ? 'No documents matched your query.'
              : results.length + ' document(s) found for "' + query + '"'}
          </p>
          {results.map(function(r, i) {
            return (
              <div key={i} className="result-card">
                <div className="result-title">{r.title || ('Document ' + (i + 1))}</div>
                <div className="result-snippet">{r.snippet || r.content || 'No preview available.'}</div>
                {r.score && (
                  <div className="result-score">Score: {parseFloat(r.score).toFixed(3)}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {results === null && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#a08060' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 300 }}>Enter a search term to begin</p>
        </div>
      )}
    </div>
  );
}
