import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import './educationPage.css';

const ARTICLES = [
  {
    id: 1,
    category: 'Manajemen Utang',
    readTime: 5,
    icon: '🔓',
    color: '#fde8e8',
    textColor: '#c94040',
    title: 'Cara Keluar dari Jerat Pinjol Ilegal',
    desc: 'Pinjaman online ilegal sering menjerat generasi muda dengan bunga yang mencekik. Kenali ciri-cirinya dan pelajari langkah strategis untuk keluar dari jeratannya sebelum terlambat.',
    content: [
      'Pinjaman online (pinjol) ilegal adalah salah satu ancaman finansial terbesar bagi generasi muda Indonesia. Dengan kemudahan akses dan proses yang cepat, banyak orang terjebak tanpa menyadari konsekuensi jangka panjangnya.',
      'Ciri-ciri pinjol ilegal meliputi: tidak terdaftar di OJK, bunga harian yang sangat tinggi (bisa mencapai 1-4% per hari), ancaman dan intimidasi saat penagihan, serta akses ke seluruh kontak di ponsel peminjam.',
      'Langkah keluar dari jerat pinjol: (1) Hentikan meminjam dari aplikasi baru, (2) Konsolidasikan semua utang, (3) Hubungi OJK di 157 untuk bantuan, (4) Pertimbangkan restrukturisasi dengan bank resmi, (5) Konsultasikan dengan ahli keuangan.',
      'Ingat: tidak ada jalan pintas dari masalah keuangan. Disiplin dan rencana yang matang adalah kunci untuk bebas dari utang.',
    ],
    tips: [
      'Cek legalitas pinjol di website OJK sebelum meminjam',
      'Jangan pernah meminjam untuk membayar utang lain',
      'Simpan bukti semua transaksi sebagai perlindungan hukum',
    ],
  },
  {
    id: 2,
    category: 'Budgeting',
    readTime: 4,
    icon: '📊',
    color: '#dbeafe',
    textColor: '#1e40af',
    title: 'Metode 50/30/20 untuk Pemula',
    desc: 'Atur keuangan dengan cara paling mudah dan terbukti efektif: 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan dan investasi.',
    content: [
      'Metode 50/30/20 adalah salah satu strategi penganggaran paling populer yang dipopulerkan oleh Senator Elizabeth Warren dalam bukunya "All Your Worth: The Ultimate Lifetime Money Plan".',
      '50% Kebutuhan: Alokasikan setengah pendapatan bersih untuk biaya hidup esensial seperti sewa/KPR, makanan, transportasi, tagihan utilitas, dan asuransi kesehatan.',
      '30% Keinginan: Gunakan 30% untuk hal-hal yang membuat hidup lebih menyenangkan — makan di restoran, hiburan, langganan streaming, hobi, dan belanja non-esensial.',
      '20% Tabungan & Utang: Sisihkan 20% untuk dana darurat, investasi, dan pelunasan utang lebih cepat. Prioritaskan dana darurat 3-6 bulan pengeluaran terlebih dahulu.',
    ],
    tips: [
      'Hitung pendapatan bersih setelah pajak sebelum membagi',
      'Otomatiskan transfer ke rekening tabungan setiap gajian',
      'Review alokasi setiap 3 bulan dan sesuaikan dengan kondisi',
    ],
  },
  {
    id: 3,
    category: 'Investasi',
    readTime: 6,
    icon: '📈',
    color: '#dcfce7',
    textColor: '#166534',
    title: 'Mulai Investasi dengan Modal Rp 100.000',
    desc: 'Modal kecil bukan halangan untuk mulai berinvestasi. Pelajari instrumen investasi yang cocok untuk pemula dengan dana terbatas dan potensi pertumbuhan optimal.',
    content: [
      'Banyak orang menunda investasi karena merasa belum punya cukup modal. Padahal, dengan Rp 100.000 saja Anda sudah bisa mulai membangun portofolio investasi yang solid.',
      'Reksa Dana Pasar Uang: Cocok untuk pemula, likuiditas tinggi, risiko rendah. Beberapa platform seperti Bibit, Bareksa, dan Ajaib memungkinkan investasi mulai Rp 10.000.',
      'Reksa Dana Indeks: Diversifikasi otomatis mengikuti indeks pasar seperti IDX30 atau LQ45. Return historis lebih konsisten dibanding reksa dana aktif dengan biaya lebih rendah.',
      'Saham Partial: Platform seperti Stockbit memungkinkan pembelian saham mulai dari 1 lot (100 lembar). Mulai dengan saham blue chip yang stabil dan berkapitalisasi besar.',
      'Prinsip DCA (Dollar Cost Averaging): Investasikan jumlah tetap secara rutin tanpa mempedulikan kondisi pasar. Strategi ini terbukti efektif mengurangi risiko timing pasar.',
    ],
    tips: [
      'Diversifikasi ke minimal 3 instrumen berbeda',
      'Jangan investasikan dana darurat',
      'Pelajari profil risiko sebelum memilih instrumen',
    ],
  },
  {
    id: 4,
    category: 'Dana Darurat',
    readTime: 4,
    icon: '🛡️',
    color: '#fef3c7',
    textColor: '#92400e',
    title: 'Pentingnya Dana Darurat untuk Gen Z',
    desc: 'Dana darurat adalah fondasi keuangan yang sering diabaikan. Ketahui berapa jumlah ideal yang perlu disiapkan dan strategi membangunnya dari nol.',
    content: [
      'Dana darurat adalah sejumlah uang yang disimpan khusus untuk menghadapi situasi tak terduga: kehilangan pekerjaan, biaya medis mendadak, perbaikan kendaraan, atau keperluan mendesak lainnya.',
      'Berapa jumlah ideal? Para ahli keuangan merekomendasikan 3-6 bulan pengeluaran untuk karyawan, dan 6-12 bulan untuk freelancer atau wirausaha yang memiliki penghasilan tidak tetap.',
      'Contoh: Jika pengeluaran bulanan Anda Rp 3.000.000, maka dana darurat minimal yang harus dimiliki adalah Rp 9.000.000 - Rp 18.000.000.',
      'Strategi membangun dana darurat: Mulai dari Rp 500.000/bulan, pisahkan ke rekening berbeda, pilih instrumen likuid seperti tabungan atau reksa dana pasar uang.',
    ],
    tips: [
      'Simpan di rekening terpisah yang tidak memiliki kartu ATM',
      'Jangan gunakan untuk investasi — likuiditas adalah prioritas',
      'Isi kembali segera setelah menggunakannya',
    ],
  },
  {
    id: 5,
    category: 'DTI Ratio',
    readTime: 3,
    icon: '💡',
    color: '#f3e8ff',
    textColor: '#7c3aed',
    title: 'Memahami Debt-to-Income Ratio (DTI)',
    desc: 'DTI adalah indikator paling penting dalam menilai kesehatan keuangan. Pelajari cara menghitung, menginterpretasi, dan memperbaiki rasio DTI Anda.',
    content: [
      'Debt-to-Income Ratio (DTI) adalah persentase penghasilan bulanan yang digunakan untuk membayar cicilan utang. Ini adalah salah satu metrik utama yang digunakan bank dan lembaga keuangan untuk menilai kelayakan kredit.',
      'Cara Menghitung: DTI = (Total Cicilan Bulanan ÷ Pendapatan Bruto Bulanan) × 100%. Contoh: cicilan Rp 1.500.000 dari pendapatan Rp 5.000.000 = DTI 30%.',
      'Interpretasi DTI: < 30% = Sehat (ideal untuk mengajukan kredit), 30-50% = Rawan (perlu perhatian), > 50% = Kritis (prioritas restrukturisasi).',
      'Cara memperbaiki DTI: (1) Lunasi utang dengan bunga tertinggi terlebih dahulu (Avalanche Method), (2) Konsolidasikan utang ke bunga lebih rendah, (3) Tingkatkan penghasilan melalui side hustle, (4) Hindari utang baru.',
    ],
    tips: [
      'Hitung DTI Anda setiap bulan untuk memantau perkembangan',
      'Target DTI < 20% untuk kondisi finansial yang optimal',
      'Konsultasikan dengan perencana keuangan jika DTI > 40%',
    ],
  },
  {
    id: 6,
    category: 'Tabungan',
    readTime: 5,
    icon: '🏦',
    color: '#e8f5ee',
    textColor: '#1a7a4a',
    title: 'Strategi Menabung di Era Inflasi Tinggi',
    desc: 'Inflasi menggerus nilai uang yang tersimpan di bawah kasur. Temukan instrumen dan strategi menabung yang mampu mengalahkan laju inflasi untuk menjaga daya beli Anda.',
    content: [
      'Inflasi adalah musuh tabungan. Ketika inflasi 5% per tahun sementara bunga tabungan hanya 1-2%, nilai riil uang Anda berkurang setiap tahun meskipun nominalnya bertambah.',
      'Instrumen yang bisa mengalahkan inflasi: (1) Deposito dengan bunga 4-6%, (2) Obligasi Negara Ritel (ORI) dengan kupon tetap, (3) Reksa dana campuran atau pendapatan tetap, (4) Properti untuk investasi jangka panjang.',
      'Strategi Laddering Deposito: Bagi tabungan ke beberapa deposito dengan tenor berbeda (1, 3, 6, 12 bulan) untuk menjaga likuiditas sekaligus mendapat bunga lebih tinggi.',
      'Prioritas alokasi tabungan: Dana darurat → Pelunasan utang bunga tinggi → Investasi jangka panjang → Tujuan finansial spesifik (DP rumah, pendidikan, dll).',
    ],
    tips: [
      'Otomatisasi tabungan di hari gajian sebelum membelanjakan',
      'Pisahkan rekening tabungan dari rekening operasional',
      'Review dan bandingkan bunga antar bank secara rutin',
    ],
  },
];

const CATEGORIES = [
  'Semua',
  'Manajemen Utang',
  'Budgeting',
  'Investasi',
  'Dana Darurat',
  'DTI Ratio',
  'Tabungan',
];

export default function EducationPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filtered = ARTICLES.filter((a) => {
    const matchCat =
      activeCategory === 'Semua' || a.category === activeCategory;
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (selectedArticle)
    return (
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Topbar
            title="Edukasi Finansial"
            subtitle={selectedArticle.category}
          />
          <div className="page-body">
            <button
              className="btn btn-ghost"
              style={{ marginBottom: 20 }}
              onClick={() => setSelectedArticle(null)}
            >
              ← Kembali ke Daftar Artikel
            </button>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 320px',
                gap: 24,
                alignItems: 'start',
              }}
            >
              <div className="panel">
                <div
                  className="edu-article-hero"
                  style={{
                    background: `linear-gradient(135deg, ${selectedArticle.color}, white)`,
                  }}
                >
                  <span className="edu-article-hero-icon">
                    {selectedArticle.icon}
                  </span>
                  <div>
                    <span
                      className="edu-cat-chip"
                      style={{
                        background: selectedArticle.color,
                        color: selectedArticle.textColor,
                      }}
                    >
                      {selectedArticle.category}
                    </span>
                    <h1 className="edu-article-title">
                      {selectedArticle.title}
                    </h1>
                    <span style={{ fontSize: 13, color: 'var(--sage)' }}>
                      ⏱ {selectedArticle.readTime} menit baca
                    </span>
                  </div>
                </div>
                <div className="panel-body edu-article-body">
                  {selectedArticle.content.map((p, i) => (
                    <p key={i} className="edu-paragraph">
                      {p}
                    </p>
                  ))}
                  <div className="edu-tips-box">
                    <div className="edu-tips-title">💡 Tips Praktis</div>
                    {selectedArticle.tips.map((t, i) => (
                      <div key={i} className="edu-tip-item">
                        <span className="edu-tip-dot" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div className="edu-cta-box">
                    <div className="edu-cta-text">
                      <strong>Butuh panduan lebih personal?</strong>
                      <p>
                        Konsultasikan kondisi keuanganmu dengan ahli keuangan
                        berpengalaman kami
                      </p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/consultation')}
                    >
                      Konsultasi Sekarang
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Artikel Terkait</span>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    {ARTICLES.filter(
                      (a) =>
                        a.id !== selectedArticle.id &&
                        a.category === selectedArticle.category,
                    )
                      .concat(
                        ARTICLES.filter(
                          (a) =>
                            a.id !== selectedArticle.id &&
                            a.category !== selectedArticle.category,
                        ),
                      )
                      .slice(0, 3)
                      .map((a) => (
                        <div
                          key={a.id}
                          className="edu-related-item"
                          onClick={() => setSelectedArticle(a)}
                        >
                          <div
                            className="edu-related-icon"
                            style={{ background: a.color }}
                          >
                            {a.icon}
                          </div>
                          <div>
                            <div className="edu-related-title">{a.title}</div>
                            <div className="edu-related-meta">
                              {a.category} · {a.readTime} menit
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="panel">
                  <div
                    className="panel-body"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--ink), var(--ink-2))',
                      borderRadius: 'var(--radius)',
                      color: 'white',
                      textAlign: 'center',
                      padding: 24,
                    }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 17,
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      Cek Kondisi Keuanganmu
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        opacity: 0.7,
                        marginBottom: 16,
                        lineHeight: 1.6,
                      }}
                    >
                      Gunakan Financial Health Check gratis untuk mengetahui
                      status keuanganmu
                    </p>
                    <button
                      className="btn"
                      style={{
                        background: 'white',
                        color: 'var(--ink)',
                        width: '100%',
                      }}
                      onClick={() => navigate('/financial-health')}
                    >
                      Mulai Health Check
                    </button>
                  </div>
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
          title="Edukasi Finansial"
          subtitle="Tingkatkan literasi keuanganmu dengan artikel pilihan"
        />
        <div className="page-body">
          <div className="edu-toolbar">
            <div className="edu-search-wrap">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="edu-search-icon"
                width="16"
                height="16"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="edu-search-input"
              />
            </div>
            <span
              style={{
                fontSize: 13,
                color: 'var(--sage)',
                white_space: 'nowrap',
              }}
            >
              {filtered.length} artikel
            </span>
          </div>

          <div className="edu-cats-row">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`edu-cat-btn ${activeCategory === c ? 'active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-box">
              <div className="empty-icon">📚</div>
              <h3>Artikel Tidak Ditemukan</h3>
              <p>Coba kata kunci atau kategori lain</p>
            </div>
          ) : (
            <div className="edu-grid">
              {filtered.map((a) => (
                <div
                  key={a.id}
                  className="edu-card"
                  onClick={() => setSelectedArticle(a)}
                >
                  <div
                    className="edu-card-top"
                    style={{
                      background: `linear-gradient(135deg, ${a.color}, white)`,
                    }}
                  >
                    <span className="edu-card-icon">{a.icon}</span>
                    <span
                      className="edu-cat-chip"
                      style={{
                        background: 'rgba(255,255,255,0.8)',
                        color: a.textColor,
                      }}
                    >
                      {a.category}
                    </span>
                  </div>
                  <div className="edu-card-body">
                    <h3 className="edu-card-title">{a.title}</h3>
                    <p className="edu-card-desc">{a.desc}</p>
                    <div className="edu-card-footer">
                      <span className="edu-read-time">
                        ⏱ {a.readTime} menit baca
                      </span>
                      <span className="edu-read-link">Baca →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
