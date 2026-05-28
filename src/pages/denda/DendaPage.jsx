import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { dendaService } from '../../services/dendaService'
import { formatDate, formatDateInput, formatCurrency } from '../../utils/formatter'

const EMPTY_FORM = {
  jumlah_denda: '',
  tgl_pinjam: '',
  tgl_hrs_kembali: '',
  tgl_kembali: '',
  id_peminjaman: '',
  id_anggota: '',
}

const DendaPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await dendaService.getAll()
      setData(res.data || [])
    } catch {
      toast.error('Gagal memuat data denda')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    setEditData(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditData(row)
    setForm({
      jumlah_denda: String(row.jumlah_denda || ''),
      tgl_pinjam: formatDateInput(row.tgl_pinjam),
      tgl_hrs_kembali: formatDateInput(row.tgl_hrs_kembali),
      tgl_kembali: formatDateInput(row.tgl_kembali),
      id_peminjaman: row.id_peminjaman,
      id_anggota: row.id_anggota,
    })
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.jumlah_denda || !form.id_peminjaman || !form.id_anggota) {
      toast.error('Jumlah denda, ID peminjaman, dan ID anggota wajib diisi')
      return
    }

    const payload = {
      jumlah_denda: Number(form.jumlah_denda),
      tgl_pinjam: form.tgl_pinjam ? new Date(form.tgl_pinjam).toISOString() : undefined,
      tgl_hrs_kembali: form.tgl_hrs_kembali ? new Date(form.tgl_hrs_kembali).toISOString() : undefined,
      tgl_kembali: form.tgl_kembali ? new Date(form.tgl_kembali).toISOString() : undefined,
      id_peminjaman: form.id_peminjaman,
      id_anggota: form.id_anggota,
    }

    setSaving(true)
    try {
      if (editData) {
        await dendaService.update({ id_denda: editData.id_denda, ...payload })
        toast.success('Denda berhasil diperbarui')
      } else {
        await dendaService.create(payload)
        toast.success('Denda berhasil ditambahkan')
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
      await dendaService.delete(deleteTarget.id_denda)
      toast.success('Denda berhasil dihapus')
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Gagal menghapus data')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'jumlah_denda', label: 'Jumlah Denda', render: (r) => formatCurrency(r.jumlah_denda) },
    { key: 'id_anggota', label: 'ID Anggota' },
    { key: 'tgl_pinjam', label: 'Tgl Pinjam', render: (r) => formatDate(r.tgl_pinjam) },
    { key: 'tgl_hrs_kembali', label: 'Tgl Hrs Kembali', render: (r) => formatDate(r.tgl_hrs_kembali) },
    { key: 'tgl_kembali', label: 'Tgl Kembali', render: (r) => formatDate(r.tgl_kembali) },
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
          <h1 className="text-2xl font-bold text-gray-900">Denda</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data denda keterlambatan</p>
        </div>
        <button onClick={openCreate} className="btn-primary whitespace-nowrap">
          <Plus size={16} /> Tambah Denda
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Denda' : 'Tambah Denda'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">ID Peminjaman <span className="text-red-500">*</span></label>
              <input name="id_peminjaman" value={form.id_peminjaman} onChange={handleChange} className="input" placeholder="ID peminjaman" />
            </div>
            <div>
              <label className="label">ID Anggota <span className="text-red-500">*</span></label>
              <input name="id_anggota" value={form.id_anggota} onChange={handleChange} className="input" placeholder="ID anggota" />
            </div>
          </div>
          <div>
            <label className="label">Jumlah Denda (Rp) <span className="text-red-500">*</span></label>
            <input name="jumlah_denda" type="number" min="0" value={form.jumlah_denda} onChange={handleChange} className="input" placeholder="0" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Tgl Pinjam</label>
              <input name="tgl_pinjam" type="date" value={form.tgl_pinjam} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Tgl Hrs Kembali</label>
              <input name="tgl_hrs_kembali" type="date" value={form.tgl_hrs_kembali} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Tgl Kembali</label>
              <input name="tgl_kembali" type="date" value={form.tgl_kembali} onChange={handleChange} className="input" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Denda"
        message="Yakin ingin menghapus data denda ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  )
}

export default DendaPage
