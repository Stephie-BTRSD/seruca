import React, { useState } from 'react';
import './Pages.css';

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleAsk = async function(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    var question = input.trim();
    setMessages(function(m) { return m.concat([{ role: 'user', text: question }]); });
    setInput('');
    setLoading(true);
    try {
      var res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ question: question })
      });
      var data = await res.json();
      var answer = data.answer || data.response || 'No relevant documents found for your question.';
      setMessages(function(m) { return m.concat([{ role: 'assistant', text: answer }]); });
    } catch (err) {
      setMessages(function(m) { return m.concat([{ role: 'assistant', text: 'Could not process your question. Please try again.' }]); });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      <h1 className="page-heading">Assistant</h1>
      <p className="page-sub">Ask questions about course content and get answers from indexed documents</p>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <p>Ask a question about your course documents</p>
            </div>
          ) : (
            messages.map(function(m, i) {
              return (
                <div key={i} className={'msg ' + (m.role === 'user' ? 'msg-q' : 'msg-a')}>
                  <div className="msg-bubble">{m.text}</div>
                </div>
              );
            })
          )}
          {loading && (
            <div className="msg msg-a">
              <div className="msg-bubble" style={{ color: '#a08060' }}>Searching documents...</div>
            </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="chat-input-area">
          <textarea
            className="chat-textarea"
            value={input}
            onChange={function(e) { setInput(e.target.value); }}
            placeholder="Type your question here..."
            rows={1}
            onKeyDown={function(e) {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(e); }
            }}
          />
          <button type="submit" className="chat-send" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
