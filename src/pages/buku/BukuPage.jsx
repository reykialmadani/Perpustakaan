import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DataTable from '../../components/ui/DataTable'
import SearchInput from '../../components/ui/SearchInput'
import { bukuService } from '../../services/bukuService'
import { formatDate, truncate } from '../../utils/formatter'

const BukuPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await bukuService.getAll()
      setData(res.data || [])
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Gagal memuat data buku')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = data.filter((b) =>
    !search ? true : (b.judul_buku || '').toLowerCase().includes(search.toLowerCase()) ||
                       (b.isbn || '').toLowerCase().includes(search.toLowerCase()),
  )

  const columns = [
    { key: 'isbn', label: 'ISBN' },
    { key: 'judul_buku', label: 'Judul Buku', render: (r) => truncate(r.judul_buku, 40) },
    { key: 'tahun_terbit', label: 'Tahun' },
    { key: 'stok_buku', label: 'Stok' },
    { key: 'rak_buku', label: 'Rak' },
    { key: 'kondisi_buku', label: 'Kondisi' },
    { key: 'created_at', label: 'Dibuat', render: (r) => formatDate(r.created_at) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Buku</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar semua buku dalam perpustakaan</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari judul atau ISBN..." />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}

export default BukuPage
