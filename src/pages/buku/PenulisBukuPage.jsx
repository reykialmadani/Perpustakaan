import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import SearchInput from '../../components/ui/SearchInput'
import { penulisBukuService } from '../../services/bukuService'
import { truncate } from '../../utils/formatter'

const EMPTY_FORM = {
  penulis_buku: '',
  alamat_penulis: '',
  email_penulis: '',
  deskripsi: '',
}

const PenulisBukuPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await penulisBukuService.getAll(search)
      setData(res.data || [])
    } catch {
      toast.error('Gagal memuat data penulis buku')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(fetchData, 300)
    return () => clearTimeout(timer)
  }, [fetchData])

  const openCreate = () => {
    setEditData(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditData(row)
    setForm({
      penulis_buku: row.penulis_buku,
      alamat_penulis: row.alamat,
      email_penulis: row.email_penulis,
      deskripsi: row.deskripsi,
    })
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.penulis_buku || !form.email_penulis) {
      toast.error('Nama penulis dan email wajib diisi')
      return
    }
    setSaving(true)
    try {
      if (editData) {
        await penulisBukuService.update({ id: editData.id, ...form })
        toast.success('Penulis berhasil diperbarui')
      } else {
        await penulisBukuService.create(form)
        toast.success('Penulis berhasil ditambahkan')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await penulisBukuService.delete(deleteTarget.id)
      toast.success('Penulis berhasil dihapus')
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Gagal menghapus data')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'penulis_buku', label: 'Nama Penulis' },
    { key: 'email_penulis', label: 'Email' },
    { key: 'alamat', label: 'Alamat', render: (r) => truncate(r.alamat, 30) },
    { key: 'deskripsi', label: 'Deskripsi', render: (r) => truncate(r.deskripsi, 30) },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
            <Pencil size={16} />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Hapus">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penulis Buku</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data penulis buku</p>
        </div>
        <div className="flex gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari penulis..." />
          <button onClick={openCreate} className="btn-primary whitespace-nowrap">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Penulis Buku' : 'Tambah Penulis Buku'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Nama Penulis <span className="text-red-500">*</span></label>
            <input name="penulis_buku" value={form.penulis_buku} onChange={handleChange} className="input" placeholder="Nama lengkap penulis" />
          </div>
          <div>
            <label className="label">Email <span className="text-red-500">*</span></label>
            <input name="email_penulis" type="email" value={form.email_penulis} onChange={handleChange} className="input" placeholder="email@contoh.com" />
          </div>
          <div>
            <label className="label">Alamat</label>
            <input name="alamat_penulis" value={form.alamat_penulis} onChange={handleChange} className="input" placeholder="Alamat penulis" />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} className="input resize-none" rows={3} placeholder="Deskripsi singkat penulis..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Penulis"
        message={`Yakin ingin menghapus penulis "${deleteTarget?.penulis_buku}"?`}
      />
    </div>
  )
}

export default PenulisBukuPage
