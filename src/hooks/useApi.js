import { useState, useCallback } from 'react'

/**
 * Generic hook untuk API calls dengan loading/error state.
 * @param {Function} apiFn - fungsi service yang dipanggil
 */
export const useApi = (apiFn) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFn(...args)
      setData(result)
      return { success: true, data: result }
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || 'Terjadi kesalahan'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [apiFn])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}
