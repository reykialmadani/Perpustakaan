# INDEKSTAT - Sistem Perpustakaan (Front-end)

Front-end aplikasi sistem perpustakaan yang terhubung dengan REST API back-end Golang.

## Pendekatan Implementasi

Saya membangun front-end dengan pendekatan modular dan terstruktur. Fokus utama pada:

- **Clean Architecture**: Memisahkan concerns dengan jelas (services, components, pages, hooks)
- **Authentication Flow**: JWT token management dengan Axios interceptor
- **Protected Routes**: Hanya user terautentikasi yang bisa akses dashboard dan fitur admin
- **Reusable Components**: DataTable, Modal, ConfirmDialog, SearchInput yang bisa dipakai ulang
- **Responsive Design**: Mobile-friendly dengan sidebar yang bisa toggle

## Struktur Halaman

### 1. Login Page
- Form login sederhana dengan validasi
- Handle JWT token dan refresh token
- Auto redirect ke dashboard jika sudah login

### 2. Dashboard
- Statistik ringkas (total buku, jenis, penulis, penerbit, peminjaman, denda)
- Card-based layout dengan icon dan warna berbeda

### 3. Manajemen Buku
- **Daftar Buku**: Tabel semua buku (public route)
- **Jenis Buku**: CRUD kategori buku (fiksi, non-fiksi, dll)
- **Penulis Buku**: CRUD data penulis
- **Penerbit Buku**: CRUD data penerbit

### 4. Peminjaman
- Tabel semua peminjaman
- Detail peminjaman (anggota, buku yang dipinjam, kondisi)
- Form create/update dengan date picker

### 5. Denda
- Tabel denda keterlambatan
- Format currency (Rupiah)
- Form dengan validasi jumlah denda

## Teknologi yang Digunakan

### Core
- **React 18** - Library utama
- **Vite** - Build tool yang cepat
- **React Router DOM v6** - Client-side routing

### State & API
- **Axios** - HTTP client dengan interceptor untuk JWT
- **Context API** - State management untuk auth
- **React Hot Toast** - Notifikasi user-friendly

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon set yang clean
- **Custom Components** - DataTable, Modal, ConfirmDialog

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Environment Variables** - Konfigurasi API base URL

## Struktur Folder

```
src/
├── components/ui/          # Reusable UI components
├── pages/                  # Halaman aplikasi
│   ├── buku/              # Halaman terkait buku
│   ├── peminjaman/        # Halaman peminjaman
│   ├── denda/             # Halaman denda
│   ├── LoginPage.jsx
│   └── DashboardPage.jsx
├── services/              # API service layer
├── hooks/                 # Custom hooks (useApi, useAuth)
├── context/               # Auth context
├── layouts/               # Layout wrapper
├── routes/                # Routing configuration
├── utils/                 # Helper functions
└── styles/                # Global styles
```

## Cara Kerja Authentication

1. User login dengan username/password
2. Back-end validasi dan return JWT token
3. Token disimpan di localStorage
4. Axios interceptor otomatis attach token ke setiap request
5. Jika token expired (401), auto redirect ke login
6. Logout clear localStorage dan redirect

## Fitur Utama

- ✅ Login dengan JWT
- ✅ Protected routes
- ✅ Dashboard dengan statistik
- ✅ CRUD Jenis Buku
- ✅ CRUD Penulis Buku
- ✅ CRUD Penerbit Buku
- ✅ List Buku (public)
- ✅ CRUD Peminjaman + Detail
- ✅ CRUD Denda dengan format Rupiah
- ✅ Search & filter
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Confirm dialog sebelum delete

## Setup & Running

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build production
npm run build
```

## Environment Variables

Buat file `.env`:
```
VITE_API_BASE_URL=http://localhost:8001/api/v1
```

## Catatan

- Back-end harus berjalan di port 8001
- Database MySQL harus sudah setup dengan tabel yang sesuai
- Seeder admin: username `admin`, password `admin`

---

Dibangun dengan React + Vite. Kode dibuat dengan pendekatan modular dan maintainable untuk memudahkan pengembangan lebih lanjut.