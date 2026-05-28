# INDKESTAT Front-End

Front-end aplikasi sistem perpustakaan **INDKESTAT** yang terhubung dengan back-end Golang Fiber RESTful API.

## Tech Stack

- **React 18** + Vite
- **React Router DOM v6**
- **Axios** dengan JWT interceptor
- **Tailwind CSS**
- **Context API** untuk state management
- **React Hot Toast** untuk notifikasi
- **Lucide React** untuk ikon

## Struktur Folder

```
front-end/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/              # DataTable, Modal, Sidebar, Header, dll
│   ├── context/             # AuthContext
│   ├── hooks/               # useAuth, useApi
│   ├── layouts/             # MainLayout, AuthLayout
│   ├── pages/
│   │   ├── buku/            # Buku, JenisBuku, Penulis, Penerbit
│   │   ├── peminjaman/      # PeminjamanPage
│   │   ├── denda/           # DendaPage
│   │   ├── DashboardPage.jsx
│   │   └── LoginPage.jsx
│   ├── routes/              # AppRoutes, ProtectedRoute
│   ├── services/            # api, authService, bukuService, dll
│   ├── styles/              # index.css (Tailwind)
│   ├── utils/               # storage, formatter
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
└── vite.config.js
```

## Installation

```bash
cd front-end
npm install
```

## Running Development

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

## Build Production

```bash
npm run build
npm run preview
```

## Environment Variables

File `.env`:
```
VITE_API_BASE_URL=http://localhost:8001/api/v1
```

## Backend Requirements

Pastikan back-end Golang sudah berjalan di **port 8001** sebelum menjalankan front-end:

```bash
cd ../Golang-Perpustakaan-Restful-API
go run main.go
```

## Endpoint API yang Digunakan

### Authentication
- `POST /api/v1/login` - Login pegawai

### Buku (Public)
- `GET /api/v1/buku` - Semua buku
- `GET /api/v1/buku/:id` - Detail buku

### Buku Admin (Protected - butuh JWT)
- **Jenis Buku**: `/admin/buku/jenbuk` (GET/POST/PUT/DELETE)
- **Penerbit**: `/admin/buku/penbuk` (GET/POST/PUT/DELETE)
- **Penulis**: `/admin/buku/author` (GET/POST/PUT/DELETE)

### Peminjaman (Protected)
- `GET /admin/peminjaman` - Semua peminjaman
- `GET /admin/peminjaman/detail/:id` - Detail peminjaman
- `POST /admin/peminjaman/create`
- `PUT /admin/peminjaman/update`
- `DELETE /admin/peminjaman/delete`

### Denda (Protected)
- `GET /admin/denda`
- `GET /admin/denda/:id`
- `POST /admin/denda/create`
- `PUT /admin/denda/update`
- `DELETE /admin/denda/delete`

## Authentication Flow

1. User login via `/login` (POST username + password)
2. Backend return `{ token, refresh_token, username }`
3. Token disimpan di `localStorage`
4. Axios interceptor otomatis attach `Authorization: Bearer <token>` ke setiap request
5. Jika response 401 → auto redirect ke `/login`
6. Logout → clear localStorage + redirect ke `/login`

## Features

- [x] Login dengan JWT
- [x] Protected Routes (auto-redirect jika unauthorized)
- [x] Dashboard dengan statistik
- [x] CRUD Jenis Buku
- [x] CRUD Penerbit Buku
- [x] CRUD Penulis Buku
- [x] List Buku
- [x] CRUD Peminjaman + Detail Peminjaman
- [x] CRUD Denda dengan format Rupiah
- [x] Search & filter
- [x] Responsive (mobile-friendly)
- [x] Toast notifications
- [x] Confirm dialog untuk delete

## Development Notes

- Semua API call disentralisasi di `src/services/`
- Token JWT diatur di `src/services/api.js` via Axios interceptor
- State auth di `src/context/AuthContext.jsx`
- Ganti `VITE_API_BASE_URL` di `.env` jika back-end di port lain
