import { contactInfo } from '../content/siteContent'

export function ContactFooter() {
  return (
    <section className="site-footer">
      <div>
        <p className="section-tag">Kontak Resmi</p>
        <h2>Balai Desa Galih Lunik</h2>
        <p>
          Jl. Raya Desa Galih Lunik, Kecamatan Tanjung Bintang, Kabupaten Lampung Selatan,
          Provinsi Lampung.
        </p>
      </div>
      <div className="footer-meta">
        {contactInfo.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </section>
  )
}