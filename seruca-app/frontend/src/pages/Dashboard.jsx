import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Pages.css';

const cards = [
  {
    to: '/courses',
    title: 'Courses',
    desc: 'Create and manage course content, upload documents, and organise learning materials by module.',
    stat: 'Content Management',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="22" height="22">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
      </svg>
    ),
  },
  {
    to: '/search',
    title: 'Search',
    desc: 'Find documents and course materials using ranked retrieval across the full document collection.',
    stat: 'Document Retrieval',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="22" height="22">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    to: '/assistant',
    title: 'Assistant',
    desc: 'Ask questions in plain language and receive answers drawn directly from indexed course documents.',
    stat: 'Semantic Q&A',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="22" height="22">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
      </svg>
    ),
  },
];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="page-root">
      <Navbar />
      <div className="page-body">
        <h1 className="page-heading">Welcome, {user.username}</h1>
        <p className="page-sub">SERUCA — Academic Knowledge Management System</p>

        <div className="dash-grid">
          {cards.map(function(card) {
            return (
              <Link key={card.to} to={card.to} className="dash-card">
                <div className="dash-card-icon">{card.icon}</div>
                <div className="dash-card-title">{card.title}</div>
                <div className="dash-card-desc">{card.desc}</div>
                <span className="dash-stat">{card.stat}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
