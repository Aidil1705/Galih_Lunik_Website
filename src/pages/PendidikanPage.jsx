import { ContactFooter } from '../components/ContactFooter'
import { PageBanner } from '../components/PageBanner'
import { berita, pendidikanProgram } from '../content/siteContent'

export function PendidikanPage() {
  return (
    <>
      <PageBanner
        eyebrow="Pendidikan"
        title="Dukungan belajar dan literasi warga desa"
        description="Halaman ini memuat informasi singkat tentang dukungan pendidikan, literasi, dan koordinasi dengan keluarga serta sekolah."
      />

      <section className="content-section">
        <div className="section-heading centered-heading">
          <p className="section-tag">Program Pendidikan</p>
          <h2>Desa ikut mendorong ruang belajar yang dekat dan mudah diakses.</h2>
        </div>
        <div className="news-grid news-grid--single">
          {pendidikanProgram.map((item) => (
            <article key={item.judul} className="news-card">
              <p className="news-date">{item.tanggal}</p>
              <h3>{item.judul}</h3>
              <p>{item.deskripsi}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading centered-heading">
          <p className="section-tag">Kabar &amp; Kegiatan Terbaru</p>
          <h2>Informasi terbaru yang mendukung pendidikan warga.</h2>
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