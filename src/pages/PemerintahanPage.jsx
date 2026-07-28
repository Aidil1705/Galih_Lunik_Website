import heroImg from '../assets/hero.png'
import { ContactFooter } from '../components/ContactFooter'
import { PageBanner } from '../components/PageBanner'
import { agenda, strukturPemerintahan } from '../content/siteContent'

export function PemerintahanPage() {
  return (
    <>
      <PageBanner
        eyebrow="Pemerintahan Desa"
        title="Struktur kerja dan pelayanan pemerintah desa"
        description="Informasi ringkas tentang susunan kerja pemerintah desa, alur pelayanan, dan fungsi kelembagaan."
      />

      <section className="content-section">
        <div className="section-heading centered-heading">
          <p className="section-tag">Struktur Pemerintahan</p>
          <h2>Susunan kerja dibuat sederhana agar warga mudah memahami jalur layanan.</h2>
        </div>
        <div className="info-grid info-grid--wide">
          {strukturPemerintahan.map((item) => (
            <article key={item.judul} className="info-card info-card--large">
              <p className="section-tag">{item.judul}</p>
              <p>{item.isi}</p>
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
            <img src={heroImg} alt="Kegiatan pelayanan pemerintah desa" />
          </div>
          <div className="news-highlight-copy">
            <p className="section-tag">Alur Pelayanan</p>
            <h3>Warga dilayani melalui administrasi yang tertib dan terjadwal</h3>
            <p>
              Setiap pengajuan surat, konsultasi data, dan koordinasi program dicatat agar
              proses pelayanan tetap transparan dan mudah ditelusuri.
            </p>
            <p className="news-author">Sekretariat Desa</p>
          </div>
        </article>
      </section>

      <ContactFooter />
    </>
  )
}