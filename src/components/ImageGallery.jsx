export function ImageGallery({ items, loading = false, emptyState, className = '' }) {
  if (loading) {
    return (
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse overflow-hidden rounded-3xl bg-white/80 shadow-sm">
            <div className="h-56 bg-slate-200/80" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-24 rounded-full bg-emerald-100/80" />
              <div className="h-5 w-4/5 rounded-full bg-slate-200/80" />
              <div className="h-4 w-full rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return emptyState
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {items.map((item) => (
        <article key={item.id ?? item.title} className="overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-sm">
          <div className="relative h-56 bg-gradient-to-br from-emerald-100 via-lime-100 to-stone-100">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title ?? item.caption ?? 'Galeri foto'} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="space-y-2 p-5">
            {item.album ? (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{item.album}</p>
            ) : null}
            <h3 className="text-lg font-semibold text-slate-900">{item.title ?? item.caption ?? 'Galeri Desa'}</h3>
            {item.caption ? <p className="text-sm leading-6 text-slate-600">{item.caption}</p> : null}
          </div>
        </article>
      ))}
    </div>
  )
}