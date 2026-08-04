export function StatCard({ icon: Icon, value, label, description }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {Icon ? (
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            {label}
          </p>
          {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
      </div>
    </div>
  )
}