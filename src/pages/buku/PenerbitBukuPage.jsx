import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import SearchInput from '../../components/ui/SearchInput'
import { penerbitBukuService } from '../../services/bukuService'
import { truncate } from '../../utils/formatter'

const EMPTY_FORM = {
  penerbit_buku: '',
  alamat_penerbit: '',
  telp_penerbit: '',
  email_penerbit: '',
  deskripsi: '',
}

const PenerbitBukuPage = () => {
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
      const res = await penerbitBukuService.getAll(search)
      setData(res.data || [])
    } catch {
      toast.error('Gagal memuat data penerbit buku')
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
      penerbit_buku: row.penerbit_buku,
      alamat_penerbit: row.alamat_penerbit,
      telp_penerbit: row.telp_penerbit,
      email_penerbit: row.email_penerbit,
      deskripsi: row.deskripsi_penerbit,
    })
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.penerbit_buku || !form.email_penerbit) {
      toast.error('Nama penerbit dan email wajib diisi')
      return
    }
    setSaving(true)
    try {
      if (editData) {
        await penerbitBukuService.update({ id: editData.id, ...form })
        toast.success('Penerbit berhasil diperbarui')
      } else {
        await penerbitBukuService.create(form)
        toast.success('Penerbit berhasil ditambahkan')
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
      await penerbitBukuService.delete(deleteTarget.id)
      toast.success('Penerbit berhasil dihapus')
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Gagal menghapus data')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'penerbit_buku', label: 'Nama Penerbit' },
    { key: 'email_penerbit', label: 'Email' },
    { key: 'telp_penerbit', label: 'Telepon' },
    { key: 'alamat_penerbit', label: 'Alamat', render: (r) => truncate(r.alamat_penerbit, 30) },
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
          <h1 className="text-2xl font-bold text-gray-900">Penerbit Buku</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data penerbit buku</p>
        </div>
        <div className="flex gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari penerbit..." />
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
        title={editData ? 'Edit Penerbit Buku' : 'Tambah Penerbit Buku'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Nama Penerbit <span className="text-red-500">*</span></label>
            <input name="penerbit_buku" value={form.penerbit_buku} onChange={handleChange} className="input" placeholder="Nama penerbit" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email <span className="text-red-500">*</span></label>
              <input name="email_penerbit" type="email" value={form.email_penerbit} onChange={handleChange} className="input" placeholder="email@contoh.com" />
            </div>
            <div>
              <label className="label">Telepon</label>
              <input name="telp_penerbit" value={form.telp_penerbit} onChange={handleChange} className="input" placeholder="08xxxxxxxxxx" />
            </div>
          </div>
          <div>
            <label className="label">Alamat</label>
            <input name="alamat_penerbit" value={form.alamat_penerbit} onChange={handleChange} className="input" placeholder="Alamat penerbit" />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} className="input resize-none" rows={3} placeholder="Deskripsi penerbit..." />
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
        title="Hapus Penerbit"
        message={`Yakin ingin menghapus penerbit "${deleteTarget?.penerbit_buku}"?`}
      />
    </div>
  )
}

export default PenerbitBukuPage
