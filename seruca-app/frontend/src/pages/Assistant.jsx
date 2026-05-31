import { useState } from 'react';
import { askAssistant } from '../services/api';

export default function Assistant() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const r = await askAssistant(question);
      const entry = { question, ...r.data };
      setHistory([entry, ...history]);
      setResponse(r.data);
      setQuestion('');
    } catch(err) { alert('Assistant error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <h1>AI Assistant</h1>
      <div className="card">
        <form onSubmit={handleAsk}>
          <textarea placeholder="Ask a question about course content..."
            value={question} onChange={e=>setQuestion(e.target.value)} rows={3}
            style={{resize:'vertical'}} />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>
      </div>
      {history.map((entry, i) => (
        <div key={i} className="card">
          <p style={{color:'#888',fontSize:13,marginBottom:8}}>Q: {entry.question}</p>
          <p style={{marginBottom:16,lineHeight:1.6}}>{entry.answer}</p>
          {entry.sources?.length > 0 && (
            <div>
              <p style={{fontSize:13,fontWeight:600,color:'#555',marginBottom:8}}>Sources:</p>
              {entry.sources.slice(0,3).map((s,j) => (
                <div key={j} style={{background:'#f8f9fa',padding:12,borderRadius:6,marginBottom:8}}>
                  <p style={{fontWeight:600,fontSize:13}}>{s.title}</p>
                  <p style={{fontSize:12,color:'#666'}}>{s.snippet}</p>
                  <p style={{fontSize:11,color:'#999'}}>Score: {s.score?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
