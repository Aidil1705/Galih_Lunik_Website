export function ChartWrapper({ title, description, loading = false, emptyState, children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-sm ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {loading ? (
        <div className="animate-pulse rounded-2xl bg-slate-100/80 p-6">
          <div className="h-56 rounded-2xl bg-slate-200/70" />
        </div>
      ) : emptyState ? (
        emptyState
      ) : (
        <div className="h-[320px] w-full">{children}</div>
      )}
    </section>
  )
}