import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Auth
import LoginPage from '../pages/LoginPage'

// Dashboard
import DashboardPage from '../pages/DashboardPage'

// Buku
import BukuPage from '../pages/buku/BukuPage'
import JenisBukuPage from '../pages/buku/JenisBukuPage'
import PenerbitBukuPage from '../pages/buku/PenerbitBukuPage'
import PenulisBukuPage from '../pages/buku/PenulisBukuPage'

// Peminjaman
import PeminjamanPage from '../pages/peminjaman/PeminjamanPage'

// Denda
import DendaPage from '../pages/denda/DendaPage'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Buku */}
          <Route path="/buku" element={<BukuPage />} />
          <Route path="/buku/jenis" element={<JenisBukuPage />} />
          <Route path="/buku/penerbit" element={<PenerbitBukuPage />} />
          <Route path="/buku/penulis" element={<PenulisBukuPage />} />

          {/* Peminjaman */}
          <Route path="/peminjaman" element={<PeminjamanPage />} />

          {/* Denda */}
          <Route path="/denda" element={<DendaPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
