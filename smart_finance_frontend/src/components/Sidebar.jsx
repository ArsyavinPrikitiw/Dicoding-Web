import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Financial Health',
    path: '/financial-health',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
  },
  {
    label: 'Konsultasi',
    path: '/consultation',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: 'Edukasi',
    path: '/education',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
  {
    label: 'Profil Saya',
    path: '/profile',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout, healthHistory, bookings } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SF';
  const lastHC = healthHistory[0];
  const activeBookings = bookings.filter((b) => b.status === 'booked').length;

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      <div
        className={`mobile-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <div className="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
            </div>
            <span className="logo-title">Smart Finance</span>
          </div>
          <div className="logo-sub">Konsultasi Keuangan Digital</div>
        </div>

        {lastHC && (
          <div
            style={{
              margin: '0 10px 8px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: '10px 12px',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
            }}
            onClick={() => handleNav('/financial-health')}
          >
            <div
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.35)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 6,
              }}
            >
              Status Keuangan
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  color:
                    lastHC.status === 'Sehat'
                      ? '#7fbf96'
                      : lastHC.status === 'Rawan'
                        ? '#f59e0b'
                        : '#ef4444',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {lastHC.status === 'Sehat'
                  ? '✅'
                  : lastHC.status === 'Rawan'
                    ? '⚠️'
                    : '🔴'}{' '}
                {lastHC.status}
              </span>
              <span
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {lastHC.score}/100
              </span>
            </div>
            <div
              style={{
                height: 4,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${lastHC.score}%`,
                  background:
                    lastHC.status === 'Sehat'
                      ? '#7fbf96'
                      : lastHC.status === 'Rawan'
                        ? '#f59e0b'
                        : '#ef4444',
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu Utama</div>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-link ${pathname === item.path || pathname.startsWith(item.path + '/') ? 'active' : ''}`}
              onClick={() => handleNav(item.path)}
            >
              {item.icon}
              {item.label}
              {item.path === '/consultation' && activeBookings > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: '#7fbf96',
                    color: '#0d1f14',
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {activeBookings}
                </span>
              )}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 12 }}>
            Akun
          </div>
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Keluar
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {user?.name || 'Pengguna'}
              </div>
              <div className="sidebar-user-role">Member</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
