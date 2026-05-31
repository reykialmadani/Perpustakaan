import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  Building2,
  ClipboardList,
  AlertCircle,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/buku', label: 'Daftar Buku', icon: BookOpen },
  { to: '/buku/jenis', label: 'Jenis Buku', icon: Layers },
  { to: '/buku/penulis', label: 'Penulis Buku', icon: Users },
  { to: '/buku/penerbit', label: 'Penerbit Buku', icon: Building2 },
  { to: '/peminjaman', label: 'Peminjaman', icon: ClipboardList },
  { to: '/denda', label: 'Denda', icon: AlertCircle },
]

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-700">INDEKSTAT</h1>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
