import heroImg from '../assets/hero.png'
import { ContactFooter } from '../components/ContactFooter'
import { PageBanner } from '../components/PageBanner'
import { agenda, statistik } from '../content/siteContent'

export function DataPage() {
  return (
    <>
      <PageBanner
        eyebrow="Data Desa"
        title="Ringkasan data dan agenda pelayanan"
        description="Halaman ini menampilkan data dasar desa, agenda layanan, dan informasi singkat yang membantu warga mengakses layanan."
      />

      <section className="content-section">
        <div className="section-heading centered-heading">
          <p className="section-tag">Statistik Utama</p>
          <h2>Data dasar desa disajikan ringkas agar mudah dibaca.</h2>
        </div>
        <div className="hero-stats-card hero-stats-card--data" aria-label="Statistik desa">
          {statistik.map((item) => (
            <article key={item.label} className="mini-stat">
              <strong>{item.angka}</strong>
              <span>{item.label}</span>
            </article>
          ))}
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
            <img src={heroImg} alt="Peta aktivitas layanan desa" />
          </div>
          <div className="news-highlight-copy">
            <p className="section-tag">Catatan Data</p>
            <h3>Data administrasi membantu proses layanan lebih cepat</h3>
            <p>
              Ketertiban data keluarga, data bantuan, dan data wilayah memudahkan desa dalam
              menyalurkan program secara tepat sasaran.
            </p>
            <p className="news-author">Tim Pendataan Desa</p>
          </div>
        </article>
      </section>

      <ContactFooter />
    </>
  )
}