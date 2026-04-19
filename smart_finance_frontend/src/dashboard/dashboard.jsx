import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PageLayout from '../components/PageLayout.jsx';
import { useApp } from '../context/AppContext.jsx';
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, dashboard, healthHistory, bookings, loading } = useApp();

  const hc = healthHistory[0] || null;
  const fmtRp = (v) =>
    v !== undefined && v !== null
      ? `Rp ${Number(v).toLocaleString('id-ID')}`
      : '-';
  const fmtPct = (v) => (v !== undefined && v !== null ? `${v}%` : '-');
  const fmtBln = (v) => (v !== undefined && v !== null ? `${v} bln` : '-');
  const statusColor =
    hc?.status === 'Sehat'
      ? 'var(--sage)'
      : hc?.status === 'Rawan'
        ? 'var(--amber)'
        : 'var(--rose)';

  const chartData = [...healthHistory]
    .reverse()
    .slice(-10)
    .map((h) => ({
      bulan: new Date(h.created_at).toLocaleDateString('id-ID', {
        month: 'short',
        day: 'numeric',
      }),
      dti: parseFloat(h.debt_to_income_ratio) || 0,
    }));

  const activeBookings = bookings.filter((b) => b.status === 'booked');

  const menuCards = [
    {
      icon: '💹',
      title: 'Financial Health Check',
      desc: 'Cek kondisi keuanganmu',
      path: '/financial-health',
      color: '#edf7f1',
    },
    {
      icon: '👨‍💼',
      title: 'Konsultasi Keuangan',
      desc: 'Temui konsultan terpercaya',
      path: '/consultation',
      color: '#f0f4ff',
    },
    {
      icon: '📚',
      title: 'Edukasi Finansial',
      desc: 'Pelajari literasi keuangan',
      path: '/education',
      color: '#fffbeb',
    },
    {
      icon: '👤',
      title: 'Profil Saya',
      desc: 'Kelola akun',
      path: '/profile',
      color: '#f9f0ff',
    },
  ];

  return (
    <PageLayout
      title={`Halo, ${user?.name || 'Pengguna'} 👋`}
      subtitle="Selamat datang kembali di Smart Finance"
    >
      {loading.dashboard && !hc ? (
        <div className="loading-center">
          <div className="spinner spinner-dark" />
          <span>Memuat data...</span>
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <div
              className="stat-card green"
              onClick={() => navigate('/financial-health')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon" style={{ background: '#e8f5ee' }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--sage)"
                  strokeWidth="2"
                >
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                </svg>
              </div>
              <div className="stat-label">Skor Finansial</div>
              <div className="stat-value">{hc ? `${hc.score}/100` : '—'}</div>
              {hc ? (
                <span
                  className={`stat-badge badge badge-${hc.status.toLowerCase()}`}
                >
                  {hc.status}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: 'var(--sage)' }}>
                  Belum ada data
                </span>
              )}
            </div>

            <div
              className="stat-card gold"
              onClick={() => navigate('/financial-health')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon" style={{ background: '#fef9ec' }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="2"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <div className="stat-label">DTI Ratio</div>
              <div className="stat-value">
                {hc ? fmtPct(hc.debt_to_income_ratio) : '—'}
              </div>
              <span
                className="stat-badge"
                style={{
                  background: '#fef3c7',
                  color: '#7a5000',
                  fontSize: 11,
                }}
              >
                Debt-to-Income
              </span>
            </div>

            <div
              className="stat-card sky"
              onClick={() => navigate('/financial-health')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon" style={{ background: '#eff6ff' }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--sky)"
                  strokeWidth="2"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="stat-label">Pengeluaran/Pemasukan</div>
              <div className="stat-value">
                {hc ? fmtPct(hc.expense_to_income_ratio) : '—'}
              </div>
              <span
                className="stat-badge"
                style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  fontSize: 11,
                }}
              >
                EIR Ratio
              </span>
            </div>

            <div
              className="stat-card rose"
              onClick={() => navigate('/financial-health')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon" style={{ background: '#fef2f2' }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--rose)"
                  strokeWidth="2"
                >
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                </svg>
              </div>
              <div className="stat-label">Dana Darurat</div>
              <div className="stat-value">
                {hc ? fmtBln(hc.emergency_fund_months) : '—'}
              </div>
              <span
                className="stat-badge"
                style={{
                  background: '#fde8e8',
                  color: 'var(--rose)',
                  fontSize: 11,
                }}
              >
                Emergency Fund
              </span>
            </div>
          </div>

          <div className="content-grid">
            <div className="left-col">
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Tren DTI Ratio</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/financial-health')}
                  >
                    {chartData.length === 0 ? 'Mulai Cek' : 'Cek Sekarang'}
                  </button>
                </div>
                <div className="panel-body">
                  {chartData.length === 0 ? (
                    <div className="empty-box" style={{ padding: '32px 20px' }}>
                      <div className="empty-icon">📊</div>
                      <h3>Belum Ada Data Tren</h3>
                      <p>
                        Lakukan Financial Health Check untuk melihat tren DTI
                        kamu
                      </p>
                      <button
                        className="btn btn-green"
                        style={{ marginTop: 16 }}
                        onClick={() => navigate('/financial-health')}
                      >
                        Mulai Health Check
                      </button>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart
                        data={chartData}
                        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="dtiGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#5a8a6a"
                              stopOpacity={0.15}
                            />
                            <stop
                              offset="95%"
                              stopColor="#5a8a6a"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="bulan"
                          tick={{ fontSize: 11, fill: '#7aab8e' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: '#7aab8e' }}
                          axisLine={false}
                          tickLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 10,
                            border: '1px solid #d8eee1',
                            fontSize: 13,
                          }}
                          formatter={(v) => [`${v}%`, 'DTI']}
                        />
                        <Area
                          type="monotone"
                          dataKey="dti"
                          stroke="#5a8a6a"
                          strokeWidth={2.5}
                          fill="url(#dtiGrad)"
                          dot={{ fill: '#5a8a6a', strokeWidth: 0, r: 4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">
                    Ringkasan Keuangan Terakhir
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/financial-health')}
                  >
                    Detail
                  </button>
                </div>
                <div className="panel-body">
                  {hc ? (
                    <>
                      <div
                        className="dash-summary-status"
                        style={{
                          background:
                            hc.status === 'Sehat'
                              ? '#f0fdf4'
                              : hc.status === 'Rawan'
                                ? '#fffbeb'
                                : '#fef2f2',
                        }}
                      >
                        <span style={{ fontSize: 18 }}>
                          {hc.status === 'Sehat'
                            ? '✅'
                            : hc.status === 'Rawan'
                              ? '⚠️'
                              : '🔴'}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: statusColor,
                            fontSize: 14,
                          }}
                        >
                          Status: {hc.status}
                        </span>
                        <span
                          style={{
                            marginLeft: 'auto',
                            fontFamily: 'var(--font-display)',
                            fontSize: 17,
                            fontWeight: 700,
                            color: 'var(--ink)',
                          }}
                        >
                          Skor {hc.score}/100
                        </span>
                      </div>
                      <div className="dash-summary-table">
                        {[
                          [
                            'Pendapatan Bulanan',
                            fmtRp(hc.monthly_income),
                            '#dcfce7',
                            '#166534',
                          ],
                          [
                            'Pengeluaran Bulanan',
                            fmtRp(hc.monthly_expenses),
                            '#fef3c7',
                            '#7a5000',
                          ],
                          [
                            'Cicilan / Hutang',
                            fmtRp(hc.monthly_debt_payment),
                            '#fde8e8',
                            'var(--rose)',
                          ],
                        ].map(([k, v, bg, c]) => (
                          <div key={k} className="dash-summary-row">
                            <span>{k}</span>
                            <span
                              style={{
                                fontWeight: 700,
                                color: c,
                                background: bg,
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 13,
                              }}
                            >
                              {v}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--sage)',
                          marginTop: 10,
                        }}
                      >
                        Terakhir:{' '}
                        {new Date(hc.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="empty-box" style={{ padding: '28px 16px' }}>
                      <div className="empty-icon">📊</div>
                      <h3>Belum Ada Data</h3>
                      <p>Lakukan Financial Health Check</p>
                      <button
                        className="btn btn-green"
                        style={{ marginTop: 14 }}
                        onClick={() => navigate('/financial-health')}
                      >
                        Mulai Sekarang
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="right-col">
              {dashboard?.daily_tip && (
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">💡 Tips Hari Ini</span>
                  </div>
                  <div className="panel-body">
                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--ink-2)',
                        lineHeight: 1.7,
                        fontStyle: 'italic',
                      }}
                    >
                      "{dashboard.daily_tip}"
                    </p>
                    <button
                      className="btn btn-ghost btn-full"
                      style={{ marginTop: 12, fontSize: 13 }}
                      onClick={() => navigate('/education')}
                    >
                      Baca Selengkapnya
                    </button>
                  </div>
                </div>
              )}

              <div className="menu-cards-grid">
                {menuCards.map((m, i) => (
                  <div
                    key={i}
                    className="menu-mini-card"
                    style={{ background: m.color }}
                    onClick={() => navigate(m.path)}
                  >
                    <div className="menu-mini-icon">{m.icon}</div>
                    <div className="menu-mini-title">{m.title}</div>
                    <div className="menu-mini-desc">{m.desc}</div>
                  </div>
                ))}
              </div>

              {activeBookings.length > 0 && (
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Jadwal Aktif</span>
                    <span className="badge badge-booked">
                      {activeBookings.length}
                    </span>
                  </div>
                  {activeBookings.slice(0, 3).map((b) => (
                    <div key={b.id} className="booking-mini-row">
                      <div className="booking-mini-icon">📅</div>
                      <div className="booking-mini-info">
                        <div className="booking-mini-name">
                          {b.consultant_name}
                        </div>
                        <div className="booking-mini-meta">
                          {b.booking_date} · {b.booking_time}
                        </div>
                      </div>
                      <span className="badge badge-booked">Aktif</span>
                    </div>
                  ))}
                  <div style={{ padding: '10px 20px' }}>
                    <button
                      className="btn btn-ghost btn-full"
                      style={{ fontSize: 13 }}
                      onClick={() => navigate('/consultation')}
                    >
                      Lihat Semua
                    </button>
                  </div>
                </div>
              )}

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Statistik Cepat</span>
                </div>
                <div className="quick-stats">
                  {[
                    ['💊', 'Health Check', healthHistory.length],
                    ['📅', 'Total Booking', bookings.length],
                    [
                      '✅',
                      'Sesi Selesai',
                      bookings.filter((b) => b.status === 'completed').length,
                    ],
                  ].map(([icon, label, val]) => (
                    <div key={label} className="quick-stat-item">
                      <span className="quick-stat-icon">{icon}</span>
                      <div>
                        <div className="quick-stat-val">{val}</div>
                        <div className="quick-stat-label">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
