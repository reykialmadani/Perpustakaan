import api from './api'

// Public buku
export const bukuService = {
  getAll: async () => {
    const { data } = await api.get('/buku')
    return data
  },
  getById: async (id) => {
    const { data } = await api.get(`/buku/${id}`)
    return data
  },
}

// Jenis Buku (Categories)
export const jenisBukuService = {
  getAll: async (q = '') => {
    const url = q ? `/admin/buku/jenbuk?q=${encodeURIComponent(q)}` : '/admin/buku/jenbuk'
    const { data } = await api.get(url)
    return data
  },
  getById: async (id) => {
    const { data } = await api.get(`/admin/buku/jenbuk/${id}`)
    return data
  },
  create: async (payload) => {
    const { data } = await api.post('/admin/buku/jenbuk/create', payload)
    return data
  },
  update: async (payload) => {
    const { data } = await api.put('/admin/buku/jenbuk/update', payload)
    return data
  },
  delete: async (id) => {
    const { data } = await api.delete('/admin/buku/jenbuk/delete', {
      data: { id },
    })
    return data
  },
}

// Penerbit Buku (Publishers)
export const penerbitBukuService = {
  getAll: async (q = '') => {
    const url = q ? `/admin/buku/penbuk?q=${encodeURIComponent(q)}` : '/admin/buku/penbuk'
    const { data } = await api.get(url)
    return data
  },
  getById: async (id) => {
    const { data } = await api.get(`/admin/buku/penbuk/${id}`)
    return data
  },
  create: async (payload) => {
    const { data } = await api.post('/admin/buku/penbuk/create', payload)
    return data
  },
  update: async (payload) => {
    const { data } = await api.put('/admin/buku/penbuk/update', payload)
    return data
  },
  delete: async (id) => {
    const { data } = await api.delete('/admin/buku/penbuk/delete', {
      data: { id },
    })
    return data
  },
}

// Penulis Buku (Authors)
export const penulisBukuService = {
  getAll: async (q = '') => {
    const url = q ? `/admin/buku/author?q=${encodeURIComponent(q)}` : '/admin/buku/author'
    const { data } = await api.get(url)
    return data
  },
  getById: async (id) => {
    const { data } = await api.get(`/admin/buku/author/${id}`)
    return data
  },
  create: async (payload) => {
    const { data } = await api.post('/admin/buku/author/create', payload)
    return data
  },
  update: async (payload) => {
    const { data } = await api.put('/admin/buku/author/update', payload)
    return data
  },
  delete: async (id) => {
    const { data } = await api.delete('/admin/buku/author/delete', {
      data: { id },
    })
    return data
  },
}
