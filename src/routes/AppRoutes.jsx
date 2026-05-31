import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import BukuPage from '../pages/buku/BukuPage'
import JenisBukuPage from '../pages/buku/JenisBukuPage'
import PenerbitBukuPage from '../pages/buku/PenerbitBukuPage'
import PenulisBukuPage from '../pages/buku/PenulisBukuPage'
import PeminjamanPage from '../pages/peminjaman/PeminjamanPage'
import DendaPage from '../pages/denda/DendaPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/buku" element={<BukuPage />} />
          <Route path="/buku/jenis" element={<JenisBukuPage />} />
          <Route path="/buku/penerbit" element={<PenerbitBukuPage />} />
          <Route path="/buku/penulis" element={<PenulisBukuPage />} />
          <Route path="/peminjaman" element={<PeminjamanPage />} />
          <Route path="/denda" element={<DendaPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
