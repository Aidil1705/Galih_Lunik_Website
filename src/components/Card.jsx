export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-emerald-100 bg-white/90 shadow-sm ${className}`}>
      {children}
    </div>
  )
}