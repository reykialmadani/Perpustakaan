import api from './api'

export const peminjamanService = {
  getAll: async () => {
    const { data } = await api.get('/admin/peminjaman')
    return data
  },
  getById: async (id) => {
    const { data } = await api.get(`/admin/peminjaman/${id}`)
    return data
  },
  getDetail: async (id) => {
    const { data } = await api.get(`/admin/peminjaman/detail/${id}`)
    return data
  },
  create: async (payload) => {
    const { data } = await api.post('/admin/peminjaman/create', payload)
    return data
  },
  update: async (payload) => {
    const { data } = await api.put('/admin/peminjaman/update', payload)
    return data
  },
  delete: async (id_peminjaman) => {
    const { data } = await api.delete('/admin/peminjaman/delete', {
      data: { id_peminjaman },
    })
    return data
  },
}
