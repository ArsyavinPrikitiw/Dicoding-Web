import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { useApp } from '../context/AppContext.jsx';
import './consultationList.css';

export default function ConsultationList() {
  const navigate = useNavigate();
  const { consultants, bookings, loading, cancelBooking } = useApp();
  const [tab, setTab] = useState('list');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [cancelling, setCancelling] = useState(null);

  const filtered = consultants
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.specialization.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sortBy === 'rating' ? b.rating - a.rating : a.rate - b.rate,
    );

  const renderStars = (r) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < Math.floor(r) ? '#e8a020' : '#d1d5db',
          fontSize: 13,
        }}
      >
        ★
      </span>
    ));

  const getStatusBadge = (s) => {
    const map = {
      booked: 'badge-booked',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    };
    const labels = {
      booked: 'Terjadwal',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      pending: 'Pending',
    };
    return (
      <span className={`badge ${map[s] || 'badge-cancelled'}`}>
        {labels[s] || s}
      </span>
    );
  };

  const handleCancel = async (id) => {
    if (!confirm('Yakin ingin membatalkan booking ini?')) return;
    setCancelling(id);
    try {
      await cancelBooking(id);
    } finally {
      setCancelling(null);
    }
  };

  const activeBookings = bookings.filter((b) => b.status === 'booked');

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Konsultasi Keuangan"
          subtitle="Temukan konsultan keuangan terbaik untuk kebutuhanmu"
        />
        <div className="page-body">
          <div className="toggle-tabs">
            <button
              className={`toggle-tab ${tab === 'list' ? 'active' : ''}`}
              onClick={() => setTab('list')}
            >
              Daftar Konsultan
            </button>
            <button
              className={`toggle-tab ${tab === 'my' ? 'active' : ''}`}
              onClick={() => setTab('my')}
            >
              Konsultasi Saya{' '}
              {activeBookings.length > 0 && (
                <span
                  style={{
                    background: 'var(--sage)',
                    color: 'white',
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontSize: 11,
                    marginLeft: 6,
                  }}
                >
                  {activeBookings.length}
                </span>
              )}
            </button>
          </div>

          {tab === 'list' && (
            <>
              <div className="cl-toolbar">
                <div className="cl-search-wrap">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="cl-search-icon"
                    width="16"
                    height="16"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari konsultan atau spesialisasi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="cl-search-input"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cl-sort-select"
                >
                  <option value="rating">Rating Tertinggi</option>
                  <option value="rate">Tarif Terendah</option>
                </select>
              </div>

              {loading.consultants ? (
                <div className="loading-center">
                  <div className="spinner spinner-dark" />
                  <span>Memuat konsultan...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-box">
                  <div className="empty-icon">🔍</div>
                  <h3>Tidak Ditemukan</h3>
                  <p>Coba kata kunci lain</p>
                </div>
              ) : (
                <div className="cl-grid">
                  {filtered.map((c) => (
                    <div key={c.id} className="cl-card">
                      <div className="cl-card-top">
                        <div className="cl-avatar">
                          {c.photo_url ? (
                            <img src={c.photo_url} alt={c.name} />
                          ) : (
                            <span>{c.name.charAt(0)}</span>
                          )}
                        </div>
                        <div
                          className={`cl-avail-dot ${c.is_available ? 'avail' : 'unavail'}`}
                          title={c.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                        />
                      </div>
                      <div className="cl-card-body">
                        <div className="cl-name">{c.name}</div>
                        <div className="cl-spec">{c.specialization}</div>
                        <div className="cl-stars">
                          {renderStars(c.rating)}
                          <span className="cl-rating-num">{c.rating}</span>
                          <span className="cl-reviews">
                            ({c.total_reviews})
                          </span>
                        </div>
                        <div className="cl-meta-row">
                          <span className="cl-exp-badge">
                            {c.experience_years} tahun
                          </span>
                          <span className="cl-rate">
                            Rp {Number(c.rate).toLocaleString('id-ID')}
                          </span>
                        </div>
                        {c.bio && (
                          <p className="cl-bio">
                            {c.bio.slice(0, 90)}
                            {c.bio.length > 90 ? '...' : ''}
                          </p>
                        )}
                      </div>
                      <div className="cl-card-footer">
                        <button
                          className="btn btn-primary"
                          style={{ flex: 1, fontSize: 13 }}
                          onClick={() =>
                            navigate(`/consultation/booking/${c.id}`, {
                              state: { consultant: c },
                            })
                          }
                        >
                          Pilih Konsultan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'my' && (
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Riwayat Konsultasi</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="tag">{bookings.length} total</span>
                  <span
                    className="tag"
                    style={{ background: '#dcfce7', color: '#166534' }}
                  >
                    {bookings.filter((b) => b.status === 'completed').length}{' '}
                    selesai
                  </span>
                  <span
                    className="tag"
                    style={{ background: '#dbeafe', color: '#1e40af' }}
                  >
                    {activeBookings.length} aktif
                  </span>
                </div>
              </div>
              {loading.bookings ? (
                <div className="loading-center">
                  <div className="spinner spinner-dark" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="empty-box">
                  <div className="empty-icon">📅</div>
                  <h3>Belum Ada Booking</h3>
                  <p>Mulai konsultasi dengan ahli keuangan terpercaya</p>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 16 }}
                    onClick={() => setTab('list')}
                  >
                    Cari Konsultan
                  </button>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Konsultan</th>
                        <th>Tanggal</th>
                        <th>Waktu</th>
                        <th>Metode</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id}>
                          <td>
                            <div
                              style={{ fontWeight: 600, color: 'var(--ink)' }}
                            >
                              {b.consultant_name}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--sage)' }}>
                              {b.specialization}
                            </div>
                          </td>
                          <td>
                            {new Date(b.booking_date).toLocaleDateString(
                              'id-ID',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </td>
                          <td>{b.booking_time}</td>
                          <td>
                            <span className="tag">
                              {b.consultation_method === 'video_meeting'
                                ? '📹 Video'
                                : '💬 Chat'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {b.total_fee
                              ? `Rp ${Number(b.total_fee).toLocaleString('id-ID')}`
                              : '—'}
                          </td>
                          <td>{getStatusBadge(b.status)}</td>
                          <td>
                            {b.status === 'booked' && (
                              <button
                                className="btn btn-danger"
                                style={{ fontSize: 12, padding: '6px 12px' }}
                                onClick={() => handleCancel(b.id)}
                                disabled={cancelling === b.id}
                              >
                                {cancelling === b.id ? '...' : 'Batalkan'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
