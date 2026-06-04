import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './Pages.css';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch { setResults([]); } finally { setLoading(false); }
  };

  return (
    <div className="page-root">
      <Navbar />
      <div className="page-body">
        <h1 className="page-heading">Document Search</h1>
        <p className="page-sub">LambdaMART Learning-to-Rank powered retrieval engine</p>

        <form onSubmit={handleSearch} className="search-box">
          <div className="search-input-wrap">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <input
              className="search-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search academic documents and course materials..."
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {results !== null && (
          <>
            <p className="search-results-header">
              {results.length === 0 ? 'No documents found.' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
            </p>
            {results.map((r, i) => (
              <div key={i} className="result-card">
                <div className="result-title">{r.title || r.documentId || `Document ${i+1}`}</div>
                <div className="result-snippet">{r.snippet || r.content || 'No preview available.'}</div>
                {r.score && <div className="result-score">Relevance score: {parseFloat(r.score).toFixed(3)}</div>}
              </div>
            ))}
          </>
        )}

        {results === null && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#a08060' }}>
            <svg viewBox="0 0 60 60" fill="none" width="48" height="48" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.3 }}>
              <circle cx="26" cy="26" r="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="38" y1="38" x2="54" y2="54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: '0.9rem', fontWeight: 300 }}>Enter a query to search documents</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const question = input.trim();
    setMessages(m => [...m, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', text: data.answer || data.response || 'No relevant documents found for your question.' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Unable to process your question. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="page-root">
      <Navbar />
      <div className="page-body">
        <h1 className="page-heading">AI Assistant</h1>
        <p className="page-sub">RAG-powered semantic Q&A — Dense Retrieval + Cross-Encoder Reranking</p>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <svg viewBox="0 0 60 60" fill="none" width="48" height="48">
                  <path d="M10 14a4 4 0 014-4h32a4 4 0 014 4v20a4 4 0 01-4 4H34l-8 8v-8H14a4 4 0 01-4-4V14z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <p>Ask a question about your course content</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`msg msg-${m.role === 'user' ? 'q' : 'a'}`}>
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))
            )}
            {loading && (
              <div className="msg msg-a">
                <div className="msg-bubble" style={{ color: '#a08060' }}>Searching documents…</div>
              </div>
            )}
          </div>

          <form onSubmit={handleAsk} className="chat-input-area">
            <textarea
              className="chat-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question about course content..."
              rows={1}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(e); } }}
            />
            <button type="submit" className="chat-send" disabled={loading || !input.trim()}>
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
