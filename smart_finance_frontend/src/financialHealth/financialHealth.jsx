import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { useApp } from '../context/AppContext.jsx';
import './financialHealth.css';

const INC = [
  1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000,
  10000000, 15000000, 20000000,
];
const EXP = [
  500000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000,
  6000000, 8000000, 10000000,
];
const DEBT = [
  0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000,
  8000000, 10000000,
];
const EMFUND = [
  0, 1000000, 2000000, 3000000, 5000000, 10000000, 15000000, 20000000,
];
const fmtRp = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`;
const PIE_COLORS = ['#c94040', '#e8a020', '#5a8a6a'];

export default function FinancialHealth() {
  const navigate = useNavigate();
  const { healthHistory, loading, submitHealthCheck } = useApp();
  const [tab, setTab] = useState('check');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    monthly_income: 8000000,
    monthly_expenses: 5200000,
    monthly_debt_payment: 1500000,
    emergency_fund: 0,
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const data = await submitHealthCheck(form);
      if (data.status === 'success') {
        setResult(data.data.result);
        setTab('result');
      } else {
        setError(data.message);
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayResult =
    result || (healthHistory.length > 0 ? healthHistory[0] : null);
  const sc =
    displayResult?.status === 'Sehat'
      ? '#5a8a6a'
      : displayResult?.status === 'Rawan'
        ? '#e8a020'
        : '#c94040';

  const pieData = displayResult
    ? [
        {
          name: 'Cicilan/Utang',
          value: parseFloat(displayResult.debt_to_income_ratio || 0),
        },
        {
          name: 'Pengeluaran Lain',
          value: Math.max(
            0,
            parseFloat(displayResult.expense_to_income_ratio || 0) -
              parseFloat(displayResult.debt_to_income_ratio || 0),
          ),
        },
        {
          name: 'Tersisa',
          value: Math.max(
            0,
            100 - parseFloat(displayResult.expense_to_income_ratio || 0),
          ),
        },
      ]
    : [];

  const rekom =
    displayResult?.recommendation?.split('\n\n').filter(Boolean) || [];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Financial Health Check"
          subtitle="Diagnosa kondisi keuanganmu secara real-time"
        />
        <div className="page-body">
          <div className="toggle-tabs">
            {[
              ['check', 'Cek Keuangan'],
              ['result', 'Hasil Analisis'],
              ['history', `Riwayat (${healthHistory.length})`],
            ].map(([v, l]) => (
              <button
                key={v}
                className={`toggle-tab ${tab === v ? 'active' : ''}`}
                onClick={() => setTab(v)}
                disabled={v === 'result' && !displayResult}
              >
                {l}
              </button>
            ))}
          </div>

          {tab === 'check' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 24,
              }}
            >
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Data Keuangan Anda</span>
                </div>
                <div className="panel-body">
                  {error && <div className="alert alert-error">{error}</div>}
                  <div className="fh-form-grid">
                    <div className="form-group">
                      <label>Pendapatan Bulanan</label>
                      <select
                        value={form.monthly_income}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            monthly_income: Number(e.target.value),
                          })
                        }
                      >
                        {INC.map((v) => (
                          <option key={v} value={v}>
                            {fmtRp(v)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Pengeluaran Bulanan</label>
                      <select
                        value={form.monthly_expenses}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            monthly_expenses: Number(e.target.value),
                          })
                        }
                      >
                        {EXP.map((v) => (
                          <option key={v} value={v}>
                            {fmtRp(v)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Cicilan / Hutang per Bulan</label>
                      <select
                        value={form.monthly_debt_payment}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            monthly_debt_payment: Number(e.target.value),
                          })
                        }
                      >
                        {DEBT.map((v) => (
                          <option key={v} value={v}>
                            {fmtRp(v)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Dana Darurat yang Dimiliki</label>
                      <select
                        value={form.emergency_fund}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            emergency_fund: Number(e.target.value),
                          })
                        }
                      >
                        {EMFUND.map((v) => (
                          <option key={v} value={v}>
                            {fmtRp(v)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-full"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner" />
                        &ensp;Menghitung & Menyimpan...
                      </>
                    ) : (
                      'Hitung Kondisi Keuangan'
                    )}
                  </button>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--sage)',
                      marginTop: 10,
                      textAlign: 'center',
                    }}
                  >
                    Hasil akan otomatis tersimpan dan diperbarui di Dashboard &
                    Profil
                  </p>
                </div>
              </div>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div className="fh-info-banner">
                  <div className="fh-banner-icon">💡</div>
                  <div>
                    <div className="fh-banner-title">
                      Apa itu Financial Health Check?
                    </div>
                    <p className="fh-banner-text">
                      Sistem kami menganalisis 3 indikator utama: DTI Ratio, EIR
                      Ratio, dan Dana Darurat untuk memberikan diagnosa keuangan
                      yang akurat. Hasilnya otomatis diperbarui di seluruh
                      halaman.
                    </p>
                  </div>
                </div>
                {[
                  {
                    label: 'DTI (Debt-to-Income)',
                    sehat: '< 30%',
                    rawan: '30–50%',
                    kritis: '> 50%',
                    desc: 'Rasio cicilan terhadap pemasukan',
                  },
                  {
                    label: 'EIR (Expense-to-Income)',
                    sehat: '< 70%',
                    rawan: '70–90%',
                    kritis: '> 90%',
                    desc: 'Rasio pengeluaran terhadap pemasukan',
                  },
                  {
                    label: 'Dana Darurat',
                    sehat: '≥ 3 bulan',
                    rawan: '1–3 bulan',
                    kritis: '< 1 bulan',
                    desc: 'Ketahanan finansial tanpa penghasilan',
                  },
                ].map((ind) => (
                  <div key={ind.label} className="panel" style={{ padding: 0 }}>
                    <div className="panel-header">
                      <div>
                        <div className="panel-title" style={{ fontSize: 14 }}>
                          {ind.label}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--sage)',
                            marginTop: 2,
                          }}
                        >
                          {ind.desc}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ padding: '12px 24px', display: 'flex', gap: 8 }}
                    >
                      {[
                        ['Sehat', ind.sehat, 'badge-sehat'],
                        ['Rawan', ind.rawan, 'badge-rawan'],
                        ['Kritis', ind.kritis, 'badge-kritis'],
                      ].map(([s, v, cls]) => (
                        <div key={s} style={{ flex: 1, textAlign: 'center' }}>
                          <span
                            className={`badge ${cls}`}
                            style={{ display: 'block', marginBottom: 4 }}
                          >
                            {s}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: 'var(--ink-2)',
                              fontWeight: 600,
                            }}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'result' && displayResult && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 24,
              }}
            >
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Status Keuangan Anda</span>
                    <span
                      className={`badge badge-${displayResult.status?.toLowerCase()}`}
                      style={{ fontSize: 13, padding: '5px 14px' }}
                    >
                      {displayResult.status}
                    </span>
                  </div>
                  <div className="panel-body">
                    <div className="score-ring-wrap">
                      <div className="score-ring">
                        <svg width="140" height="140" viewBox="0 0 140 140">
                          <circle
                            cx="70"
                            cy="70"
                            r="56"
                            fill="none"
                            stroke="var(--mist)"
                            strokeWidth="12"
                          />
                          <circle
                            cx="70"
                            cy="70"
                            r="56"
                            fill="none"
                            stroke={sc}
                            strokeWidth="12"
                            strokeDasharray={`${((displayResult.score || 0) / 100) * 351.86} 351.86`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="score-ring-text">
                          <span className="score-num" style={{ color: sc }}>
                            {displayResult.score}
                          </span>
                          <span className="score-label">dari 100</span>
                        </div>
                      </div>
                    </div>
                    {[
                      [
                        'DTI Ratio',
                        displayResult.debt_to_income_ratio,
                        '%',
                        50,
                      ],
                      [
                        'EIR Ratio',
                        displayResult.expense_to_income_ratio,
                        '%',
                        90,
                      ],
                      [
                        'Dana Darurat',
                        displayResult.emergency_fund_months,
                        ' bulan',
                        6,
                      ],
                    ].map(([l, v, u, max]) => (
                      <div key={l} style={{ marginBottom: 14 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 13,
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{ color: 'var(--ink-2)', fontWeight: 500 }}
                          >
                            {l}
                          </span>
                          <span
                            style={{ fontWeight: 700, color: 'var(--ink)' }}
                          >
                            {v}
                            {u}
                          </span>
                        </div>
                        <div className="progress-bar-wrap">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${Math.min((v / max) * 100, 100)}%`,
                              background: sc,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Rekomendasi</span>
                  </div>
                  <div className="panel-body" style={{ paddingTop: 16 }}>
                    {rekom.map((r, i) => (
                      <div key={i} className="fh-rekom-item">
                        <div
                          className="fh-rekom-dot"
                          style={{ background: sc }}
                        />
                        <p
                          style={{
                            fontSize: 13,
                            color: 'var(--ink-2)',
                            lineHeight: 1.6,
                          }}
                        >
                          {r.replace(/^[^\w\s]+\s*/, '')}
                        </p>
                      </div>
                    ))}
                    <button
                      className="btn btn-green btn-full"
                      style={{ marginTop: 16 }}
                      onClick={() => navigate('/consultation')}
                    >
                      Konsultasi dengan Ahli
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Distribusi Keuangan</span>
                  </div>
                  <div className="panel-body">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          dataKey="value"
                          paddingAngle={3}
                          strokeWidth={0}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) => [`${Number(v).toFixed(1)}%`]}
                          contentStyle={{
                            borderRadius: 10,
                            border: '1px solid var(--border)',
                            fontSize: 13,
                          }}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={10}
                          formatter={(v) => (
                            <span
                              style={{ fontSize: 12, color: 'var(--ink-2)' }}
                            >
                              {v}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ padding: '0' }}>
                  <button
                    className="btn btn-ghost btn-full"
                    onClick={() => setTab('check')}
                  >
                    Hitung Ulang
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">
                  Riwayat Financial Health Check
                </span>
                <span style={{ fontSize: 13, color: 'var(--sage)' }}>
                  {healthHistory.length} data tersimpan
                </span>
              </div>
              {loading.health ? (
                <div className="loading-center">
                  <div className="spinner spinner-dark" />
                </div>
              ) : healthHistory.length === 0 ? (
                <div className="empty-box">
                  <div className="empty-icon">📋</div>
                  <h3>Belum Ada Riwayat</h3>
                  <p>Lakukan Financial Health Check pertamamu</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>DTI</th>
                        <th>EIR</th>
                        <th>Dana Darurat</th>
                        <th>Skor</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthHistory.map((h) => (
                        <tr key={h.id}>
                          <td>
                            {new Date(h.created_at).toLocaleDateString(
                              'id-ID',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {h.debt_to_income_ratio}%
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {h.expense_to_income_ratio}%
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {h.emergency_fund_months} bln
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, fontSize: 15 }}>
                              {h.score}
                            </span>
                            <span
                              style={{ color: 'var(--sage)', fontSize: 11 }}
                            >
                              /100
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge badge-${h.status.toLowerCase()}`}
                            >
                              {h.status}
                            </span>
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
