import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import SearchInput from '../../components/ui/SearchInput'
import { jenisBukuService } from '../../services/bukuService'

const EMPTY_FORM = { jenis_buku: '', deskripsi: '' }

const JenisBukuPage = () => {
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
      const res = await jenisBukuService.getAll(search)
      setData(res.data || [])
    } catch {
      toast.error('Gagal memuat data jenis buku')
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
    setForm({ jenis_buku: row.jenis_buku, deskripsi: row.deskripsi })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.jenis_buku || !form.deskripsi) {
      toast.error('Semua field wajib diisi')
      return
    }
    setSaving(true)
    try {
      if (editData) {
        await jenisBukuService.update({ id: editData.id, ...form })
        toast.success('Jenis buku berhasil diperbarui')
      } else {
        await jenisBukuService.create(form)
        toast.success('Jenis buku berhasil ditambahkan')
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
      await jenisBukuService.delete(deleteTarget.id)
      toast.success('Jenis buku berhasil dihapus')
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Gagal menghapus data')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'jenis_buku', label: 'Jenis Buku' },
    { key: 'deskripsi', label: 'Deskripsi' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus"
          >
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
          <h1 className="text-2xl font-bold text-gray-900">Jenis Buku</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola kategori / jenis buku</p>
        </div>
        <div className="flex gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari jenis buku..." />
          <button onClick={openCreate} className="btn-primary whitespace-nowrap">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Jenis Buku' : 'Tambah Jenis Buku'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Jenis Buku <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.jenis_buku}
              onChange={(e) => setForm((p) => ({ ...p, jenis_buku: e.target.value }))}
              className="input"
              placeholder="Contoh: Fiksi, Non-Fiksi, Sains..."
            />
          </div>
          <div>
            <label className="label">Deskripsi <span className="text-red-500">*</span></label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm((p) => ({ ...p, deskripsi: e.target.value }))}
              className="input resize-none"
              rows={3}
              placeholder="Deskripsi jenis buku..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Jenis Buku"
        message={`Yakin ingin menghapus jenis buku "${deleteTarget?.jenis_buku}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  )
}

export default JenisBukuPage
