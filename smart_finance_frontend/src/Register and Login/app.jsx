import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import hideIcon from '../assets/hide.png';
import viewIcon from '../assets/view.png';
import './style.css';

export default function App() {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { login, register } = useApp();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(loginForm.email, loginForm.password);
      if (data.status === 'success') {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Email atau password salah.');
      }
    } catch {
      setError(
        'Tidak dapat terhubung ke server. Pastikan Back-End sudah berjalan.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(registerForm);
      if (data.status === 'success') {
        setMode('login');
        setRegisterForm({ name: '', email: '', password: '' });
        alert('Registrasi berhasil! Silakan login.');
      } else {
        setError(data.message || 'Gagal mendaftar.');
      }
    } catch {
      setError(
        'Tidak dapat terhubung ke server. Pastikan Back-End sudah berjalan.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                width="26"
                height="26"
              >
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
            </div>
            <span className="auth-brand-name">Smart Finance</span>
          </div>

          <div className="auth-hero">
            <h1 className="auth-hero-title">
              Finansial Sehat,
              <br />
              <em>Masa Depan Cerah</em>
            </h1>
            <p className="auth-hero-sub">
              Platform konsultasi keuangan digital untuk generasi muda
              Indonesia. Cek kesehatan finansialmu dan terhubung dengan
              konsultan terpercaya.
            </p>
          </div>

          <div className="auth-features">
            {[
              {
                icon: '💊',
                label: 'Financial Health Check',
                desc: 'Diagnosa kondisi keuangan secara real-time',
              },
              {
                icon: '👨‍💼',
                label: 'Konsultan Berpengalaman',
                desc: 'Didampingi pakar keuangan bersertifikat',
              },
              {
                icon: '📊',
                label: 'Insight & Analisis',
                desc: 'Data dan rekomendasi berbasis AI',
              },
            ].map((f) => (
              <div key={f.label} className="auth-feature-item">
                <div className="auth-feature-icon">{f.icon}</div>
                <div>
                  <div className="auth-feature-label">{f.label}</div>
                  <div className="auth-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Masuk
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              Daftar
            </button>
          </div>

          <div className="auth-card-header">
            <h2>
              {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </h2>
            <p>
              {mode === 'login'
                ? 'Masuk ke akun Smart Finance Anda'
                : 'Bergabung dan mulai perjalanan finansialmu'}
            </p>
          </div>

          {error && (
            <div className="auth-alert">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="16"
                height="16"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field">
                <label>Alamat Email</label>
                <div className="field-icon-wrap">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    width="16"
                    height="16"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="auth-field">
                <label>Password</label>
                <div className="field-icon-wrap">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    width="16"
                    height="16"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password Anda"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pass"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <img src={hideIcon} alt="Sembunyikan" />
                    ) : (
                      <img src={viewIcon} alt="Tampilkan" />
                    )}
                  </button>
                </div>
              </div>
              <p className="forgot-pw">Lupa password?</p>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="auth-spinner" />
                    &ensp;Masuk...
                  </>
                ) : (
                  'Masuk ke Akun'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-field">
                <label>Nama Lengkap</label>
                <div className="field-icon-wrap">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    width="16"
                    height="16"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Nama Lengkap Anda"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="auth-field">
                <label>Alamat Email</label>
                <div className="field-icon-wrap">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    width="16"
                    height="16"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="auth-field">
                <label>Password</label>
                <div className="field-icon-wrap">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    width="16"
                    height="16"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pass"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <img src={hideIcon} alt="Sembunyikan" />
                    ) : (
                      <img src={viewIcon} alt="Tampilkan" />
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="auth-spinner" />
                    &ensp;Mendaftar...
                  </>
                ) : (
                  'Buat Akun'
                )}
              </button>
            </form>
          )}

          <div className="auth-divider">
            <span>atau lanjutkan dengan</span>
          </div>

          <button className="google-btn" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Login dengan Google
          </button>

          <p className="auth-switch">
            {mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <span
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 'Daftar sekarang' : 'Masuk'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
