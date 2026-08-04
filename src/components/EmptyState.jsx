import { Inbox } from 'lucide-react'

export function EmptyState({ title, description, action, className = '' }) {
  return (
    <div className={`rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center ${className}`}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}