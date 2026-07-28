import { useEffect, useState } from 'react'
import './App.css'
import { navItems, normalizePath, pageTitles } from './content/siteContent'
import { PageShell } from './components/PageShell'
import { HomePage } from './pages/HomePage'
import { ProfilPage } from './pages/ProfilPage'
import { PemerintahanPage } from './pages/PemerintahanPage'
import { DataPage } from './pages/DataPage'
import { PendidikanPage } from './pages/PendidikanPage'

function App() {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  useEffect(() => {
    const normalizedPath = normalizePath(window.location.pathname)

    if (normalizedPath !== window.location.pathname) {
      window.history.replaceState({}, '', normalizedPath)
    }

    document.title = pageTitles[currentPath] ?? pageTitles['/']
  }, [currentPath])

  function navigate(event, nextPath) {
    event.preventDefault()

    const normalizedPath = normalizePath(nextPath)

    if (normalizedPath === currentPath) {
      return
    }

    window.history.pushState({}, '', normalizedPath)
    setCurrentPath(normalizedPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const page = {
    '/': <HomePage />,
    '/profil': <ProfilPage />,
    '/pemerintahan': <PemerintahanPage />,
    '/data': <DataPage />,
    '/pendidikan': <PendidikanPage />,
  }[currentPath]

  return (
    <PageShell currentPath={currentPath} navigate={navigate} navItems={navItems}>
      {page}
    </PageShell>
  )
}

export default App
