import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { useApp } from '../context/AppContext.jsx';
import './bookingConsultation.css';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

export default function BookingConsultation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const consultant = location.state?.consultant;
  const { submitBooking, API_URL } = useApp();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [method, setMethod] = useState('video_meeting');
  const [topic, setTopic] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    fetch(`${API_URL}/consultants/${id}/available-slots?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'success') setSlots(data.data.slots);
      })
      .catch(console.error)
      .finally(() => setSlotsLoading(false));
    setSelectedTime('');
  }, [selectedDate]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Pilih tanggal dan waktu terlebih dahulu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await submitBooking({
        consultant_id: parseInt(id),
        booking_date: selectedDate,
        booking_time: selectedTime,
        consultation_method: method,
        duration_minutes: 60,
        topic: topic || undefined,
      });
      if (data.status === 'success') {
        setSuccess(true);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Topbar title="Booking Berhasil" />
          <div className="page-body">
            <div className="bk-success-wrapper">
              <div className="bk-success-card">
                <div className="bk-success-checkmark">✓</div>
                <h2 className="bk-success-title">Booking Berhasil!</h2>
                <p className="bk-success-msg">
                  Konsultasi Anda telah dijadwalkan dengan{' '}
                  <strong>{consultant?.name}</strong>
                </p>
                <div className="bk-success-details">
                  {[
                    ['📅 Tanggal', selectedDate],
                    ['🕐 Waktu', `${selectedTime} WIB`],
                    [
                      method === 'video_meeting' ? '📹 Metode' : '💬 Metode',
                      method === 'video_meeting' ? 'Video Meeting' : 'Chat',
                    ],
                    ['⏱ Durasi', '60 menit'],
                  ].map(([k, v]) => (
                    <div key={k} className="bk-detail-row">
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
                <div className="bk-notice">
                  <strong>Menunggu Konfirmasi</strong>
                  <p>
                    Konsultan akan segera menghubungi Anda. Dashboard dan jadwal
                    konsultasi sudah diperbarui otomatis.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ flex: 1 }}
                    onClick={() => navigate('/consultation')}
                  >
                    Lihat Jadwal
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => navigate('/dashboard')}
                  >
                    Ke Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Booking Konsultasi"
          subtitle={consultant ? `Booking dengan ${consultant.name}` : ''}
        />
        <div className="page-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 360px',
              gap: 24,
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {consultant && (
                <div className="panel">
                  <div
                    className="panel-body"
                    style={{ display: 'flex', gap: 20, alignItems: 'center' }}
                  >
                    <div className="bk-consultant-avatar">
                      {consultant.photo_url ? (
                        <img src={consultant.photo_url} alt="" />
                      ) : (
                        <span>{consultant.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 20,
                          fontWeight: 600,
                          color: 'var(--ink)',
                          marginBottom: 4,
                        }}
                      >
                        {consultant.name}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: 'var(--sage)',
                          marginBottom: 6,
                        }}
                      >
                        {consultant.specialization}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: 13, color: '#e8a020' }}>
                          {'★'.repeat(Math.round(consultant.rating))}{' '}
                          {consultant.rating}
                        </span>
                        <span className="tag">
                          {consultant.experience_years} tahun pengalaman
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'var(--ink)',
                          }}
                        >
                          Rp {Number(consultant.rate).toLocaleString('id-ID')}
                          /sesi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Pilih Tanggal</span>
                </div>
                <div className="panel-body">
                  <div className="bk-dates-row">
                    {dates.map((d, i) => {
                      const str = d.toISOString().split('T')[0];
                      return (
                        <button
                          key={i}
                          className={`date-btn ${selectedDate === str ? 'active' : ''}`}
                          onClick={() => setSelectedDate(str)}
                        >
                          <span className="dn">{d.getDate()}</span>
                          <span className="dm">{MONTHS[d.getMonth()]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedDate && (
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Pilih Waktu</span>
                  </div>
                  <div className="panel-body">
                    {slotsLoading ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="shimmer"
                            style={{ width: 80, height: 42 }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bk-slots-row">
                        {slots.map((s, i) => (
                          <button
                            key={i}
                            disabled={!s.is_available}
                            className={`time-btn ${selectedTime === s.time ? 'active' : ''}`}
                            onClick={() => setSelectedTime(s.time)}
                          >
                            {s.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Metode Konsultasi</span>
                </div>
                <div className="panel-body">
                  <div style={{ display: 'flex', gap: 16 }}>
                    {[
                      ['chat', '💬', 'Chat'],
                      ['video_meeting', '📹', 'Video Meeting'],
                    ].map(([v, icon, l]) => (
                      <label
                        key={v}
                        className={`method-option ${method === v ? 'active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="method"
                          value={v}
                          checked={method === v}
                          onChange={() => setMethod(v)}
                        />
                        <span className="method-icon">{icon}</span>
                        <span className="method-label">{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Topik Konsultasi</span>
                </div>
                <div className="panel-body">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <textarea
                      placeholder="Ceritakan topik yang ingin Anda diskusikan... (opsional)"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="panel bk-summary-panel">
              <div className="panel-header">
                <span className="panel-title">Ringkasan Booking</span>
              </div>
              <div className="panel-body">
                {error && <div className="alert alert-error">{error}</div>}
                <div className="bk-summary-rows">
                  <div className="bk-sum-row">
                    <span>Konsultan</span>
                    <strong>{consultant?.name || '—'}</strong>
                  </div>
                  <div className="bk-sum-row">
                    <span>Tanggal</span>
                    <strong>{selectedDate || '—'}</strong>
                  </div>
                  <div className="bk-sum-row">
                    <span>Waktu</span>
                    <strong>{selectedTime || '—'}</strong>
                  </div>
                  <div className="bk-sum-row">
                    <span>Metode</span>
                    <strong>
                      {method === 'video_meeting' ? 'Video Meeting' : 'Chat'}
                    </strong>
                  </div>
                  <div className="bk-sum-row">
                    <span>Durasi</span>
                    <strong>60 menit</strong>
                  </div>
                </div>
                {consultant && (
                  <div className="bk-sum-total">
                    <span>Total Biaya</span>
                    <span className="bk-sum-price">
                      Rp {Number(consultant.rate).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                <button
                  className="btn btn-primary btn-full"
                  style={{ marginTop: 20 }}
                  onClick={handleBooking}
                  disabled={loading || !selectedDate || !selectedTime}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      &ensp;Memproses...
                    </>
                  ) : (
                    'Konfirmasi Booking'
                  )}
                </button>
                <button
                  className="btn btn-ghost btn-full"
                  style={{ marginTop: 10 }}
                  onClick={() => navigate('/consultation')}
                >
                  Batal
                </button>
                <div className="bk-guarantee">
                  <span>🔒</span>
                  <p>
                    Data booking otomatis diperbarui di Dashboard dan Profil
                    Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
