import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { peminjamanService } from '../../services/peminjamanService'
import { formatDate, formatDateInput } from '../../utils/formatter'

const EMPTY_FORM = {
  id_anggota: '',
  tgl_pinjam: '',
  tgl_hrs_kembali: '',
  jaminan: '',
}

const PeminjamanPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [detailModal, setDetailModal] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await peminjamanService.getAll()
      setData(res.data || [])
    } catch {
      toast.error('Gagal memuat data peminjaman')
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
      id_anggota: row.id_anggota,
      tgl_pinjam: formatDateInput(row.tgl_pinjam),
      tgl_hrs_kembali: formatDateInput(row.tgl_hrs_kembali),
      jaminan: row.jaminan,
    })
    setModalOpen(true)
  }

  const openDetail = async (row) => {
    setDetailLoading(true)
    setDetailModal(true)
    try {
      const res = await peminjamanService.getDetail(row.id)
      setDetailData(res.data)
    } catch {
      toast.error('Gagal memuat detail peminjaman')
      setDetailModal(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.id_anggota || !form.tgl_pinjam || !form.tgl_hrs_kembali || !form.jaminan) {
      toast.error('Semua field wajib diisi')
      return
    }

    const payload = {
      id_anggota: form.id_anggota,
      tgl_pinjam: new Date(form.tgl_pinjam).toISOString(),
      tgl_hrs_kembali: new Date(form.tgl_hrs_kembali).toISOString(),
      jaminan: form.jaminan,
    }

    setSaving(true)
    try {
      if (editData) {
        await peminjamanService.update({ id_peminjaman: editData.id, ...payload })
        toast.success('Peminjaman berhasil diperbarui')
      } else {
        await peminjamanService.create(payload)
        toast.success('Peminjaman berhasil ditambahkan')
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
      await peminjamanService.delete(deleteTarget.id)
      toast.success('Peminjaman berhasil dihapus')
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Gagal menghapus data')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'id_anggota', label: 'ID Anggota' },
    { key: 'tgl_pinjam', label: 'Tgl Pinjam', render: (r) => formatDate(r.tgl_pinjam) },
    { key: 'tgl_hrs_kembali', label: 'Tgl Kembali', render: (r) => formatDate(r.tgl_hrs_kembali) },
    { key: 'jaminan', label: 'Jaminan' },
    { key: 'created_at', label: 'Dibuat', render: (r) => formatDate(r.created_at) },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openDetail(row)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Detail">
            <Eye size={16} />
          </button>
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
          <h1 className="text-2xl font-bold text-gray-900">Peminjaman</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data peminjaman buku</p>
        </div>
        <button onClick={openCreate} className="btn-primary whitespace-nowrap">
          <Plus size={16} /> Tambah Peminjaman
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Peminjaman' : 'Tambah Peminjaman'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">ID Anggota <span className="text-red-500">*</span></label>
            <input name="id_anggota" value={form.id_anggota} onChange={handleChange} className="input" placeholder="Masukkan ID anggota" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tanggal Pinjam <span className="text-red-500">*</span></label>
              <input name="tgl_pinjam" type="date" value={form.tgl_pinjam} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Tanggal Harus Kembali <span className="text-red-500">*</span></label>
              <input name="tgl_hrs_kembali" type="date" value={form.tgl_hrs_kembali} onChange={handleChange} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Jaminan <span className="text-red-500">*</span></label>
            <input name="jaminan" value={form.jaminan} onChange={handleChange} className="input" placeholder="Contoh: KTP, KTM, dll" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={detailModal}
        onClose={() => { setDetailModal(false); setDetailData(null) }}
        title="Detail Peminjaman"
        size="lg"
      >
        {detailLoading ? (
          <div className="text-center py-8 text-gray-500">Memuat...</div>
        ) : detailData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Anggota:</span>
                <p className="font-medium">{detailData.anggota?.nama || detailData.anggota?.id_anggota || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">Jaminan:</span>
                <p className="font-medium">{detailData.jaminan}</p>
              </div>
              <div>
                <span className="text-gray-500">Tgl Pinjam:</span>
                <p className="font-medium">{formatDate(detailData.tgl_pinjam)}</p>
              </div>
              <div>
                <span className="text-gray-500">Tgl Harus Kembali:</span>
                <p className="font-medium">{formatDate(detailData.tgl_hrs_kembali)}</p>
              </div>
            </div>

            {detailData.details && detailData.details.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Detail Buku Dipinjam:</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2">ID Buku</th>
                        <th className="text-left px-3 py-2">Kondisi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.details.map((d) => (
                        <tr key={d.id_detailpinjam} className="border-t">
                          <td className="px-3 py-2">{d.id_buku}</td>
                          <td className="px-3 py-2">{d.kondisi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Tidak ada data</p>
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Peminjaman"
        message="Yakin ingin menghapus data peminjaman ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  )
}

export default PeminjamanPage
