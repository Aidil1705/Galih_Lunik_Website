import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import { HomePage } from './pages/HomePage'
import { ProfilPage } from './pages/ProfilPage'
import { PemerintahanPage } from './pages/PemerintahanPage'
import { DataPage } from './pages/DataPage'
import { PendidikanPage } from './pages/PendidikanPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { ManagementPage } from './pages/ManagementPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profil" element={<ProfilPage />} />
        <Route path="pemerintahan" element={<PemerintahanPage />} />
        <Route path="data" element={<DataPage />} />
        <Route path="pendidikan" element={<PendidikanPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="management"
          element={
            <ProtectedRoute>
              <ManagementPage />
            </ProtectedRoute>
          }
        />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
