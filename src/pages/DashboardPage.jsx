import { useEffect, useState } from 'react'
import { BookOpen, Layers, Users, Building2, ClipboardList, AlertCircle } from 'lucide-react'
import { jenisBukuService, penerbitBukuService, penulisBukuService, bukuService } from '../services/bukuService'
import { peminjamanService } from '../services/peminjamanService'
import { dendaService } from '../services/dendaService'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? '-'}</p>
    </div>
  </div>
)

const DashboardPage = () => {
  const [stats, setStats] = useState({
    buku: 0,
    jenis: 0,
    penulis: 0,
    penerbit: 0,
    peminjaman: 0,
    denda: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bukuRes, jenisRes, penulisRes, penerbitRes, peminjamanRes, dendaRes] = await Promise.allSettled([
          bukuService.getAll(),
          jenisBukuService.getAll(),
          penulisBukuService.getAll(),
          penerbitBukuService.getAll(),
          peminjamanService.getAll(),
          dendaService.getAll(),
        ])

        const count = (res) => {
          if (res.status !== 'fulfilled') return 0
          const d = res.value?.data
          return Array.isArray(d) ? d.length : 0
        }

        setStats({
          buku: count(bukuRes),
          jenis: count(jenisRes),
          penulis: count(penulisRes),
          penerbit: count(penerbitRes),
          peminjaman: count(peminjamanRes),
          denda: count(dendaRes),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Selamat datang di Sistem Perpustakaan INDKESTAT</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Buku"
          value={loading ? '...' : stats.buku}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={Layers}
          label="Jenis Buku"
          value={loading ? '...' : stats.jenis}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon={Users}
          label="Penulis"
          value={loading ? '...' : stats.penulis}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          icon={Building2}
          label="Penerbit"
          value={loading ? '...' : stats.penerbit}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          icon={ClipboardList}
          label="Peminjaman"
          value={loading ? '...' : stats.peminjaman}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          icon={AlertCircle}
          label="Denda"
          value={loading ? '...' : stats.denda}
          color="bg-red-100 text-red-600"
        />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Selamat Datang</h2>
        <p className="text-sm text-gray-600">
          Gunakan menu di sidebar untuk mengelola data buku, jenis buku, penulis, penerbit, peminjaman, dan denda.
        </p>
      </div>
    </div>
  )
}

export default DashboardPage
