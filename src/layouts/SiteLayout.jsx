import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { useVillageProfile } from '../hooks/useVillageData'
import { pageTitles } from '../content/siteContent'

export function SiteLayout() {
  const location = useLocation()
  const profileQuery = useVillageProfile()

  const title = pageTitles[location.pathname] ?? pageTitles['/']

  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])

  return (
    <div className="min-h-screen bg-transparent text-slate-800">
      <Navbar profile={profileQuery.data} isLoading={profileQuery.isFetching} />
      <main>
        <Outlet context={{ profile: profileQuery.data, profileQuery }} />
      </main>
      <Footer profile={profileQuery.data} isLoading={profileQuery.isFetching} />
    </div>
  )
}