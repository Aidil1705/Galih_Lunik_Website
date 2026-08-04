export function LoadingState({ count = 3, className = '' }) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-emerald-100 bg-white/80 p-5 shadow-sm"
        >
          <div className="h-4 w-28 rounded-full bg-emerald-100/80" />
          <div className="mt-4 h-6 w-3/4 rounded-full bg-slate-200/80" />
          <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
          <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  )
}