import heroImg from '../assets/hero.png'
import { agenda, berita, statistik } from '../content/siteContent'
import { ContactFooter } from '../components/ContactFooter'

export function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div
          className="hero-overlay"
          style={{
            backgroundImage: "url('/images/sawah.jpg')",
          }}
        />
        <div className="hero-copy">
          <p className="section-tag">Portal Resmi Pemerintah Desa</p>
          <h1>Selamat Datang di Desa Galih Lunik</h1>
          <p className="hero-lead">
            Pusat informasi pelayanan, pembangunan, dan kegiatan masyarakat Desa Galih Lunik
            yang disajikan secara tertib, resmi, dan mudah diakses oleh seluruh warga.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="/profil">
              Jelajahi Desa
            </a>
            <a className="secondary-action" href="/data">
              Lihat Data
            </a>
          </div>
        </div>

        <div className="hero-stats-card" aria-label="Statistik desa">
          {statistik.map((item) => (
            <article key={item.label} className="mini-stat">
              <strong>{item.angka}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section split-feature">
        <div className="feature-intro">
          <p className="section-tag">Berdiri Saling dalam Keberagaman</p>
          <h2>
            Desa Galih Lunik tumbuh dengan semangat gotong royong, tertib administrasi, dan
            pelayanan yang dekat dengan warga.
          </h2>
          <p>
            Pemerintah Desa Galih Lunik terus memperkuat tata kelola pelayanan publik,
            pembangunan lingkungan, dan pemberdayaan masyarakat melalui kebijakan yang
            transparan serta kolaboratif.
          </p>
        </div>

        <div className="feature-card">
          <img src={heroImg} alt="Suasana alam Desa Galih Lunik" />
          <div className="feature-card-copy">
            <p className="section-tag">Kepala Desa Galih Lunik</p>
            <h3>H. M. Rafiq Hidayat</h3>
            <p>
              Memimpin pelayanan desa dengan pendekatan yang ramah, tegas, dan berorientasi
              pada kebutuhan masyarakat.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section service-layout">
        <div className="service-list-wrap">
          <p className="section-tag">Agenda dan Layanan</p>
          <h2>Layanan utama desa tersedia dalam alur yang sederhana dan mudah dipahami.</h2>
          <div className="accordion-list">
            {agenda.map((item, index) => (
              <details key={item} className="accordion-item" open={index === 0}>
                <summary>{item}</summary>
                <p>
                  Informasi layanan ini disampaikan untuk membantu warga mendapatkan akses
                  administrasi yang cepat, akurat, dan tertib di Balai Desa Galih Lunik.
                </p>
              </details>
            ))}
          </div>
        </div>

        <article className="news-highlight">
          <div className="news-highlight-media">
            <img src={heroImg} alt="Kegiatan warga Desa Galih Lunik" />
          </div>
          <div className="news-highlight-copy">
            <p className="section-tag">Kabar Singkat Desa</p>
            <h3>Pelayanan administrasi makin mudah dijangkau warga</h3>
            <p>
              Penguatan alur pelayanan membantu warga mengurus kebutuhan surat menyurat,
              data keluarga, dan informasi pembangunan secara lebih tertib.
            </p>
            <p className="news-author">Tim Pelaksana Informasi Desa</p>
          </div>
        </article>
      </section>

      <section className="content-section">
        <div className="section-heading centered-heading">
          <p className="section-tag">Kabar &amp; Kegiatan Terbaru</p>
          <h2>Informasi terbaru dari Desa Galih Lunik.</h2>
        </div>
        <div className="news-grid">
          {berita.map((item) => (
            <article key={item.judul} className="news-card">
              <p className="news-date">{item.tanggal}</p>
              <h3>{item.judul}</h3>
              <p>{item.deskripsi}</p>
            </article>
          ))}
        </div>
      </section>

      <ContactFooter />
    </>
  )
}