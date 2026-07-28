import heroImg from '../assets/hero.png'
import { ContactFooter } from '../components/ContactFooter'
import { PageBanner } from '../components/PageBanner'
import { profilHighlight } from '../content/siteContent'

export function ProfilPage() {
  return (
    <>
      <PageBanner
        eyebrow="Profil Desa"
        title="Mengenal Desa Galih Lunik lebih dekat"
        description="Halaman ini memuat gambaran umum desa, arah pelayanan, dan semangat kerja pemerintah desa bersama warga."
      />

      <section className="content-section split-feature">
        <div className="feature-intro">
          <p className="section-tag">Identitas Desa</p>
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

      <section className="content-section">
        <div className="section-heading centered-heading">
          <p className="section-tag">Nilai Dasar Desa</p>
          <h2>Fokus kerja desa bertumpu pada pelayanan yang dekat dan terbuka.</h2>
        </div>
        <div className="info-grid">
          {profilHighlight.map((item) => (
            <article key={item.label} className="info-card">
              <strong>{item.angka}</strong>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <ContactFooter />
    </>
  )
}