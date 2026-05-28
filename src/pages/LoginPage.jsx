import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { BookOpen, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.password) {
      toast.error('Username dan password wajib diisi')
      return
    }

    const result = await login(formData.username, formData.password)
    if (result.success) {
      toast.success('Login berhasil')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="text-primary-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">INDKESTAT</h1>
        <p className="text-sm text-gray-500 mt-1">Sistem Perpustakaan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Username</label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              className="input pl-10"
              autoComplete="username"
            />
          </div>
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className="input pl-10"
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5"
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        © 2025 INDKESTAT. All rights reserved.
      </p>
    </div>
  )
}

export default LoginPage
