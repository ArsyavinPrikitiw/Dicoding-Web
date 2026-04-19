import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import PageLayout from '../components/PageLayout.jsx';
import { useApp } from '../context/AppContext.jsx';
import './userProfile.css';

export default function UserProfile() {
  const navigate = useNavigate();
  const {
    user,
    healthHistory,
    bookings,
    loading,
    updateProfile,
    changePassword,
    logout,
  } = useApp();
  const [tab, setTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [passForm, setPassForm] = useState({
    old_password: '',
    new_password: '',
    confirm: '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleUpdateProfile = async () => {
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      const data = await updateProfile({
        name: editForm.name,
        phone: editForm.phone || undefined,
      });
      if (data.status === 'success') {
        setEditMode(false);
        setMsg({ type: 'success', text: 'Profil berhasil diperbarui.' });
      } else {
        setMsg({ type: 'error', text: data.message });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal memperbarui profil.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passForm.new_password !== passForm.confirm) {
      setMsg({ type: 'error', text: 'Password baru tidak cocok.' });
      return;
    }
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      const data = await changePassword({
        old_password: passForm.old_password,
        new_password: passForm.new_password,
      });
      if (data.status === 'success') {
        setPassForm({ old_password: '', new_password: '', confirm: '' });
        setMsg({ type: 'success', text: 'Password berhasil diubah.' });
      } else {
        setMsg({ type: 'error', text: data.message });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal mengubah password.' });
    } finally {
      setSaving(false);
    }
  };

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
  const statusColor =
    lastHC?.status === 'Sehat'
      ? 'var(--sage)'
      : lastHC?.status === 'Rawan'
        ? 'var(--amber)'
        : 'var(--rose)';

  const chartData = [...healthHistory]
    .reverse()
    .slice(-8)
    .map((h) => ({
      date: new Date(h.created_at).toLocaleDateString('id-ID', {
        month: 'short',
        day: 'numeric',
      }),
      dti: parseFloat(h.debt_to_income_ratio),
      score: h.score,
      status: h.status,
    }));

  const getBarColor = (status) =>
    status === 'Sehat' ? '#5a8a6a' : status === 'Rawan' ? '#e8a020' : '#c94040';
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(
    (b) => b.status === 'completed',
  ).length;
  const activeBookings = bookings.filter((b) => b.status === 'booked').length;

  return (
    <PageLayout
      title="Profil Saya"
      subtitle="Kelola akun dan pantau perkembangan keuanganmu"
    >
      <div className="prof-top-grid">
        <div className="prof-identity-card">
          <div className="prof-avatar-wrap">
            <div className="prof-avatar">{initials}</div>
          </div>
          <div className="prof-identity-info">
            <h2 className="prof-name">{user?.name}</h2>
            <p className="prof-email">{user?.email}</p>
            {user?.phone && <p className="prof-phone">📱 {user.phone}</p>}
            <p className="prof-joined">
              Bergabung sejak{' '}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('id-ID', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>

        <div className="prof-stats-row">
          {[
            {
              icon: '💊',
              label: 'Total Health Check',
              value: healthHistory.length,
            },
            { icon: '📅', label: 'Total Booking', value: totalBookings },
            { icon: '✅', label: 'Sesi Selesai', value: completedBookings },
            {
              icon: '🎯',
              label: 'Skor Terakhir',
              value: lastHC ? `${lastHC.score}/100` : '—',
            },
          ].map((s, i) => (
            <div key={i} className="prof-stat-card">
              <div className="prof-stat-icon">{s.icon}</div>
              <div className="prof-stat-value">{s.value}</div>
              <div className="prof-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="toggle-tabs">
        {[
          ['profile', 'Edit Profil'],
          ['stats', `Statistik (${healthHistory.length})`],
          ['bookings', `Konsultasi (${totalBookings})`],
          ['security', 'Keamanan'],
        ].map(([v, l]) => (
          <button
            key={v}
            className={`toggle-tab ${tab === v ? 'active' : ''}`}
            onClick={() => {
              setTab(v);
              setMsg({ type: '', text: '' });
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
        >
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Informasi Pribadi</span>
              {!editMode && (
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: 12, padding: '7px 14px' }}
                  onClick={() => {
                    setEditMode(true);
                    setEditForm({
                      name: user?.name || '',
                      phone: user?.phone || '',
                    });
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            <div className="panel-body">
              {msg.text && (
                <div className={`alert alert-${msg.type}`}>{msg.text}</div>
              )}
              {editMode ? (
                <>
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Nomor Telepon</label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      style={{ opacity: 0.5 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn btn-ghost"
                      style={{ flex: 1 }}
                      onClick={() => setEditMode(false)}
                    >
                      Batal
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      onClick={handleUpdateProfile}
                      disabled={saving}
                    >
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="prof-info-rows">
                  {[
                    ['Nama Lengkap', user?.name],
                    ['Email', user?.email],
                    ['Telepon', user?.phone || '—'],
                    ['Status Akun', 'Member Aktif'],
                  ].map(([k, v]) => (
                    <div key={k} className="prof-info-row">
                      <span className="prof-info-key">{k}</span>
                      <span className="prof-info-val">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Status Keuangan Terkini</span>
            </div>
            <div className="panel-body">
              {loading.health ? (
                <div className="loading-center">
                  <div className="spinner spinner-dark" />
                </div>
              ) : lastHC ? (
                <>
                  <div className="prof-status-display">
                    <div
                      className="prof-status-badge"
                      style={{
                        background:
                          lastHC.status === 'Sehat'
                            ? '#dcfce7'
                            : lastHC.status === 'Rawan'
                              ? '#fef3c7'
                              : '#fee2e2',
                        color: statusColor,
                      }}
                    >
                      {lastHC.status === 'Sehat'
                        ? '✅'
                        : lastHC.status === 'Rawan'
                          ? '⚠️'
                          : '🔴'}{' '}
                      {lastHC.status}
                    </div>
                    <div className="prof-score-display">
                      {lastHC.score}
                      <span>/100</span>
                    </div>
                  </div>
                  <div
                    className="progress-bar-wrap"
                    style={{ marginBottom: 20 }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width: `${lastHC.score}%`,
                        background: statusColor,
                      }}
                    />
                  </div>
                  {[
                    ['DTI Ratio', `${lastHC.debt_to_income_ratio}%`],
                    ['EIR Ratio', `${lastHC.expense_to_income_ratio}%`],
                    ['Dana Darurat', `${lastHC.emergency_fund_months} bulan`],
                  ].map(([k, v]) => (
                    <div key={k} className="prof-info-row">
                      <span className="prof-info-key">{k}</span>
                      <span
                        className="prof-info-val"
                        style={{ fontWeight: 700 }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                  <button
                    className="btn btn-ghost btn-full"
                    style={{ marginTop: 12 }}
                    onClick={() => navigate('/financial-health')}
                  >
                    Lihat Riwayat
                  </button>
                </>
              ) : (
                <div className="empty-box">
                  <p>Belum ada data pemeriksaan.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/financial-health')}
                  >
                    Mulai
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {healthHistory.length > 0 ? (
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Tren DTI Ratio</span>
              </div>
              <div className="panel-body">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    barSize={32}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip contentStyle={{ borderRadius: 10 }} />
                    <Bar dataKey="dti" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={getBarColor(entry.status)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="panel">
              <div className="panel-body">Tidak ada statistik tersedia.</div>
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Riwayat Konsultasi</span>
          </div>
          <div className="panel-body">
            {bookings.length > 0 ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Konsultan</th>
                      <th>Tanggal</th>
                      <th>Metode</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td>{b.consultant_name}</td>
                        <td>
                          {new Date(b.booking_date).toLocaleDateString('id-ID')}
                        </td>
                        <td>{b.consultation_method}</td>
                        <td>
                          <span className={`badge badge-${b.status}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Belum ada riwayat booking.</p>
            )}
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
        >
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Ubah Password</span>
            </div>
            <div className="panel-body">
              {msg.text && (
                <div className={`alert alert-${msg.type}`}>{msg.text}</div>
              )}
              <div className="form-group">
                <label>Password Lama</label>
                <input
                  type="password"
                  value={passForm.old_password}
                  onChange={(e) =>
                    setPassForm({ ...passForm, old_password: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Password Baru</label>
                <input
                  type="password"
                  value={passForm.new_password}
                  onChange={(e) =>
                    setPassForm({ ...passForm, new_password: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Konfirmasi Password</label>
                <input
                  type="password"
                  value={passForm.confirm}
                  onChange={(e) =>
                    setPassForm({ ...passForm, confirm: e.target.value })
                  }
                />
              </div>
              <button
                className="btn btn-primary btn-full"
                onClick={handleChangePassword}
                disabled={saving}
              >
                {saving ? 'Memproses...' : 'Ubah Password'}
              </button>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Sesi</span>
            </div>
            <div className="panel-body">
              <p
                style={{ fontSize: 13, color: 'var(--sage)', marginBottom: 20 }}
              >
                Anda masuk sebagai <strong>{user?.email}</strong>
              </p>
              <button
                className="btn btn-danger btn-full"
                onClick={handleLogout}
              >
                Keluar dari Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
