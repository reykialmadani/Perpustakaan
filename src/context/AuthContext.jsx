import { createContext, useContext, useState, useCallback } from 'react'
import { authService } from '../services/authService'
import { storage } from '../utils/storage'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser())
  const [token, setToken] = useState(() => storage.getToken())
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (username, password) => {
    setLoading(true)
    try {
      const res = await authService.login(username, password)
      const { data } = res
      storage.setToken(data.token)
      storage.setRefreshToken(data.refresh_token)
      storage.setUser({ username: data.username })
      setToken(data.token)
      setUser({ username: data.username })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.msg || 'Login gagal. Periksa username dan password.'
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    storage.clearAll()
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
