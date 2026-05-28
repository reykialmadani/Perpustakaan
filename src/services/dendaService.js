import api from './api'

export const dendaService = {
  getAll: async () => {
    const { data } = await api.get('/admin/denda')
    return data
  },
  getById: async (id) => {
    const { data } = await api.get(`/admin/denda/${id}`)
    return data
  },
  create: async (payload) => {
    const { data } = await api.post('/admin/denda/create', payload)
    return data
  },
  update: async (payload) => {
    const { data } = await api.put('/admin/denda/update', payload)
    return data
  },
  delete: async (id_denda) => {
    const { data } = await api.delete('/admin/denda/delete', {
      data: { id_denda },
    })
    return data
  },
}
