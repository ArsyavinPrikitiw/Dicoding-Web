import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title, subtitle, onMenuToggle }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SF';

  return (
    <header className="topbar">
      <button
        className="mobile-menu-btn"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          width="22"
          height="22"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="topbar-left">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="topbar-right">
        <span className="topbar-date">
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <div
          className="topbar-avatar"
          onClick={() => navigate('/profile')}
          title="Profil Saya"
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
