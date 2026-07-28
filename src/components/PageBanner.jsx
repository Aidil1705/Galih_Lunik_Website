export function PageBanner({ eyebrow, title, description }) {
  return (
    <section className="page-banner">
      <div className="page-banner-overlay" />
      <div className="page-banner-copy">
        <p className="section-tag">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-banner-lead">{description}</p>
      </div>
    </section>
  )
}